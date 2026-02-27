import websockets
import asyncio
import pika
import os
import json
from websockets import WebSocketServerProtocol

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))

rabbitmq_conn = pika.BlockingConnection(pika.ConnectionParameters(
    host=RABBITMQ_HOST,
    port=RABBITMQ_PORT
))
rabbitmq_channel = rabbitmq_conn.channel()
rabbitmq_channel.queue_declare(queue='notification_queue', durable=True)

def callback(ch, method, properties, body):
    message = body.decode()
    parsed = json.loads(message)
    student_id = parsed["student_id"]
    print(f"Received message: {message}")
    push_notification(student_id, message)
    ch.basic_ack(delivery_tag=method.delivery_tag)

def prepare_rabbitmq_consumer():
    rabbitmq_channel.basic_consume(queue='notification_queue', on_message_callback=callback)
    print("Waiting for notifications...")
    rabbitmq_channel.start_consuming()

connected = {}

def push_notification(user_id, message):
    try:
        asyncio.run(connected[user_id].send(message))
    except Exception as e:
        pass

async def serve(websocket: WebSocketServerProtocol):
    user_id = await websocket.recv()
    connected[user_id] = websocket
    print(f"Client connected: {user_id}")
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
        connected.pop(user_id, None)

async def main():
    asyncio.create_task(asyncio.to_thread(prepare_rabbitmq_consumer))
    async with websockets.serve(serve, "0.0.0.0", 8765):
        print("WebSocket server started on ws://0.0.0.0:8765")
        await asyncio.Future()  # run forever

asyncio.run(main())