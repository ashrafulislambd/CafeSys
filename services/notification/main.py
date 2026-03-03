import websockets
import asyncio
import aiohttp
from aiohttp import web
import pika
import os
import json

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))

# Global dictionary of connected clients
connected = {}

# RabbitMQ setup
rabbitmq_conn = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT)
)
rabbitmq_channel = rabbitmq_conn.channel()
rabbitmq_channel.queue_declare(queue='notification_queue', durable=True)


def push_notification(user_id, message, loop):
    """Schedule message sending in the main asyncio loop."""
    if user_id in connected:
        ws = connected[user_id]
        loop.call_soon_threadsafe(asyncio.create_task, ws.send(message))


def callback(ch, method, properties, body, loop):
    message = body.decode()
    parsed = json.loads(message)
    student_id = parsed["student_id"]
    print(f"Received message: {message}")
    push_notification(student_id, message, loop)
    ch.basic_ack(delivery_tag=method.delivery_tag)


def prepare_rabbitmq_consumer(loop):
    """Runs in a separate thread."""
    # Wrap the callback to include the loop
    wrapped_callback = lambda ch, method, properties, body: callback(ch, method, properties, body, loop)
    rabbitmq_channel.basic_consume(queue='notification_queue', on_message_callback=wrapped_callback)
    print("Waiting for notifications...")
    rabbitmq_channel.start_consuming()  # Blocking call


async def serve(websocket):
    user_id = await websocket.recv()
    connected[user_id] = websocket
    print(f"Client connected: {user_id}")
    try:
        async for message in websocket:
            print(f"Received message from {user_id}: {message}")
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected: {user_id}")
        connected.pop(user_id, None)


# ── Lightweight health-check HTTP server (aiohttp) ──────────────────────────
async def handle_health(request):
    return web.Response(
        text=json.dumps({"status": "ok"}),
        content_type="application/json"
    )

async def start_health_server():
    health_app = web.Application()
    health_app.router.add_get('/health', handle_health)
    runner = web.AppRunner(health_app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 8766)
    await site.start()
    print("Health server started on http://0.0.0.0:8766")
# ────────────────────────────────────────────────────────────────────────────


async def main():
    loop = asyncio.get_running_loop()

    # Run RabbitMQ consumer in a separate thread, but don't await it
    asyncio.create_task(asyncio.to_thread(prepare_rabbitmq_consumer, loop))

    # Start health HTTP server
    await start_health_server()

    # Start WebSocket server immediately
    async with websockets.serve(serve, "0.0.0.0", 8765):
        print("WebSocket server started on ws://0.0.0.0:8765")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())