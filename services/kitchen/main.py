import pika, os, random, time, json

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "queue")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))

rabbitmq_conn = pika.BlockingConnection(pika.ConnectionParameters(
    host=RABBITMQ_HOST,
    port=RABBITMQ_PORT
))

rabbitmq_channel = rabbitmq_conn.channel()
rabbitmq_channel.queue_declare(queue='order_queue', durable=True)
rabbitmq_channel.queue_declare(queue='status_queue', durable=True)
rabbitmq_channel.queue_declare(queue='notification_queue', durable=True)

def prepare_status_message(order_id: int, status: str, student_id: str = None):
    return json.dumps({
        "id": order_id,
        "status": status,
        "student_id": student_id
    })

def process_order(ch, method, properties, body):
    order = json.loads(body)

    time.sleep(random.randint(1, 15))
    status_message = prepare_status_message(order["id"], "received", student_id=order["student_id"])
    ch.basic_publish(exchange='', routing_key='status_queue', body=status_message)
    ch.basic_publish(exchange='', routing_key='notification_queue', body=status_message)

    time.sleep(random.randint(1, 15))
    status_message = prepare_status_message(order["id"], "cooking", student_id=order["student_id"])
    ch.basic_publish(exchange='', routing_key='status_queue', body=status_message)
    ch.basic_publish(exchange='', routing_key='notification_queue', body=status_message)


    time.sleep(random.randint(1, 15))
    status_message = prepare_status_message(order["id"], "packaging", student_id=order["student_id"])
    ch.basic_publish(exchange='', routing_key='status_queue', body=status_message)
    ch.basic_publish(exchange='', routing_key='notification_queue', body=status_message)

    time.sleep(random.randint(1, 15))
    status_message = prepare_status_message(order["id"], "ready", student_id=order["student_id"])
    ch.basic_publish(exchange='', routing_key='status_queue', body=status_message)
    ch.basic_publish(exchange='', routing_key='notification_queue', body=status_message)

    ch.basic_ack(delivery_tag=method.delivery_tag)

rabbitmq_channel.basic_qos(prefetch_count=5)
rabbitmq_channel.basic_consume(queue='order_queue', on_message_callback=process_order)
print("Waiting for orders...")
rabbitmq_channel.start_consuming()

