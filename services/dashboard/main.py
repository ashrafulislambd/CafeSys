import asyncio
import logging
import os
import time
from collections import deque
from typing import Dict, Optional, Set

import aiohttp
import docker as docker_sdk
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("dashboard")

# ── Service registry ─────────────────────────────────────────────────────────
SERVICES: Dict[str, str] = {
    "order":        os.getenv("ORDER_URL",        "http://order:8000"),
    "stock":        os.getenv("STOCK_URL",         "http://stock:8080"),
    "kitchen":      os.getenv("KITCHEN_URL",       "http://kitchen:8002"),
    "notification": os.getenv("NOTIFICATION_URL",  "http://notification:8766"),
}

# Docker compose project name (used to filter containers)
COMPOSE_PROJECT = os.getenv("COMPOSE_PROJECT", "devsprint")

POLL_INTERVAL = 2  # seconds
HISTORY_LEN   = 30

# ── In-memory state ──────────────────────────────────────────────────────────
# killed_services: services intentionally stopped via chaos toggle (for button state)
killed_services: Set[str] = set()

health_state: Dict[str, dict] = {
    name: {"status": "UNKNOWN", "latency_ms": None, "latency_history": []}
    for name in SERVICES
}

order_throughput: dict = {"total_orders": 0, "last_updated": None}
ws_clients: Set[WebSocket] = set()

# Docker client (initialized at startup)
docker_client: Optional[docker_sdk.DockerClient] = None


# ── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(title="CafeSys Health Dashboard")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def root():
    with open("static/index.html", "r") as f:
        return HTMLResponse(content=f.read())


@app.get("/api/status")
async def api_status():
    snapshot = {}
    for name, state in health_state.items():
        snapshot[name] = {
            "status": state["status"],
            "latency_ms": state["latency_ms"],
            "latency_history": state["latency_history"],
            "killed": name in killed_services,
        }
    return {"services": snapshot, "throughput": order_throughput}


@app.post("/api/chaos/{service}")
async def chaos_kill(service: str):
    if service not in SERVICES:
        return {"error": f"Unknown service '{service}'"}, 404

    # Immediately update UI state
    killed_services.add(service)
    health_state[service]["status"] = "DOWN"
    health_state[service]["latency_ms"] = None
    await broadcast()

    # Actually stop the container (non-blocking via thread)
    container = await asyncio.to_thread(_get_container, service)
    if container:
        try:
            await asyncio.to_thread(lambda: container.stop(timeout=5))
            log.info("[chaos] Stopped container for service '%s'", service)
        except Exception as e:
            log.warning("[chaos] Failed to stop '%s': %s", service, e)
    else:
        log.warning("[chaos] No container found for service '%s'", service)

    return {"service": service, "killed": True}


@app.post("/api/chaos/{service}/restore")
async def chaos_restore(service: str):
    if service not in SERVICES:
        return {"error": f"Unknown service '{service}'"}, 404

    killed_services.discard(service)
    await broadcast()

    # Actually start the container back up
    container = await asyncio.to_thread(_get_container, service)
    if container:
        try:
            await asyncio.to_thread(container.start)
            log.info("[restore] Started container for service '%s'", service)
        except Exception as e:
            log.warning("[restore] Failed to start '%s': %s", service, e)
    else:
        log.warning("[restore] No container found for service '%s'", service)

    return {"service": service, "killed": False}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    ws_clients.add(websocket)
    try:
        await websocket.send_json(build_snapshot())
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass
    finally:
        ws_clients.discard(websocket)


# ── Docker helpers ────────────────────────────────────────────────────────────
def _get_container(service: str):
    """Find a compose service container by label. Runs in a thread."""
    if not docker_client:
        return None
    try:
        containers = docker_client.containers.list(
            all=True,
            filters={
                "label": [
                    f"com.docker.compose.project={COMPOSE_PROJECT}",
                    f"com.docker.compose.service={service}",
                ]
            },
        )
        return containers[0] if containers else None
    except Exception as e:
        log.warning("Docker lookup failed for '%s': %s", service, e)
        return None


# ── Helpers ──────────────────────────────────────────────────────────────────
def build_snapshot() -> dict:
    snapshot = {}
    for name, state in health_state.items():
        snapshot[name] = {
            "status": state["status"],
            "latency_ms": state["latency_ms"],
            "latency_history": list(state["latency_history"]),
            "killed": name in killed_services,
        }
    return {"services": snapshot, "throughput": order_throughput}


async def broadcast():
    if not ws_clients:
        return
    data = build_snapshot()
    dead: Set[WebSocket] = set()
    for ws in list(ws_clients):
        try:
            await ws.send_json(data)
        except Exception:
            dead.add(ws)
    ws_clients.difference_update(dead)


# ── Background polling task ──────────────────────────────────────────────────
async def poll_services():
    connector = aiohttp.TCPConnector(force_close=True)
    timeout = aiohttp.ClientTimeout(total=4)
    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        while True:
            tasks = [poll_one(session, name, base_url) for name, base_url in SERVICES.items()]
            await asyncio.gather(*tasks, return_exceptions=True)
            await broadcast()
            await asyncio.sleep(POLL_INTERVAL)


async def poll_one(session: aiohttp.ClientSession, name: str, base_url: str):
    state   = health_state[name]
    history = state["latency_history"]

    # If intentionally killed, hold DOWN — don't poll until restored
    if name in killed_services:
        state["status"]     = "DOWN"
        state["latency_ms"] = None
        history.append(None)
        if len(history) > HISTORY_LEN:
            history.pop(0)
        return

    url = f"{base_url}/health"
    t0  = time.monotonic()
    try:
        async with session.get(url) as resp:
            latency = round((time.monotonic() - t0) * 1000, 1)
            if resp.status == 200:
                state["status"]     = "UP"
                state["latency_ms"] = latency
                history.append(latency)
            else:
                state["status"]     = "DEGRADED"
                state["latency_ms"] = latency
                history.append(latency)
    except Exception as e:
        log.warning("[%s] poll error: %s: %s", name, type(e).__name__, e)
        state["status"]     = "DOWN"
        state["latency_ms"] = None
        history.append(None)

    if len(history) > HISTORY_LEN:
        history.pop(0)

    # Update stock level from stock /status
    if name == "stock" and state["status"] == "UP":
        try:
            async with session.get(f"{SERVICES['stock']}/status") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    order_throughput["total_orders"] = data.get("value", 0)
                    order_throughput["last_updated"] = time.strftime("%H:%M:%S")
        except Exception:
            pass


@app.on_event("startup")
async def startup_event():
    global docker_client
    try:
        docker_client = docker_sdk.from_env()
        log.info("Docker client connected — real chaos enabled")
    except Exception as e:
        log.warning("Docker socket unavailable, chaos will be UI-only: %s", e)
    asyncio.create_task(poll_services())
