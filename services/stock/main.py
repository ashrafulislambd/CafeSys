from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import func
import redis, pika, threading, json, os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "queue")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:80")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
CORS(
    app,
    origins=[FRONTEND_ORIGIN],
    supports_credentials=True
)
db = SQLAlchemy(app)
r = redis.Redis(host="redis-cache", port=6379, decode_responses=True)

"""
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        resp = make_response("", 204)
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        resp.headers["Access-Control-Max-Age"] = "0"
        return resp


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response
"""

class ConfigInt(db.Model):
    key = db.Column(db.String(100), primary_key=True)
    value = db.Column(db.Integer)
    version = db.Column(db.Integer, default=1)

    def as_dict(self):
        return {"key": self.key, "value": self.value}
    
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(100))
    quantity = db.Column(db.Integer)
    place_time = db.Column(db.DateTime, server_default=func.now())
    status = db.Column(db.String(20), default="waiting")
    version = db.Column(db.Integer, default=1)

with app.app_context():
    db.create_all()

def callback(ch, method, properties, body):
    with app.app_context():
        message = json.loads(body)
        order_id = message["id"]
        status = message["status"]

        status_val = {
            "waiting": 0,
            "received": 1,
            "cooking": 2,
            "packaging": 3,
            "ready": 4
        }

        order = Order.query.get(order_id)
        if order and status_val[status] > status_val[order.status]:
            Order.query.filter_by(id=order_id, version=order.version).update({
                "status": status,
                "version": order.version + 1
            })
            db.session.commit()
        ch.basic_ack(delivery_tag=method.delivery_tag)

def start_consumer():
    conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT))
    channel = conn.channel()
    channel.queue_declare(queue='status_queue', durable=True)
    channel.basic_consume(queue='status_queue', on_message_callback=callback)
    try:
        channel.start_consuming()
    except Exception as e:
        print("Consumer error:", e)

@app.get('/')
def hello():
    return "I am running"

@app.get('/health')
def health():
    return {"status": "ok"}

@app.get('/status')
def get_status():
    stock = ConfigInt.query.get("stock")
    if not stock:
        stock = ConfigInt(key="stock", value=0)
        db.session.add(stock)
        db.session.commit()
        r.set('stock', 0)
    return stock.as_dict()

@app.post('/setstock')
def set_stock():
    data = request.json
    qty = data.get("quantity")
    if qty is None:
        return {"error": "You must provide 'quantity'"}, 403

    stock = ConfigInt.query.get("stock")
    if not stock:
        stock = ConfigInt(key="stock", value=qty)
        db.session.add(stock)
    else:
        ConfigInt.query.filter_by(key="stock", version=stock.version).update({
            "value": qty,
            "version": stock.version + 1
        })
    r.set('stock', qty)
    db.session.commit()
    return {"success": "ok"}

@app.post('/order')
def make_order():
    data = request.json
    student_id = data.get("student_id")
    quantity = data.get("quantity")

    if student_id is None or quantity is None:
        return {"error": "Missing 'student_id' or 'quantity'"}, 400

    stock_value = r.get('stock')
    if stock_value and int(stock_value) < quantity:
        return {"error": "Insufficient stock"}, 400

    stock = ConfigInt.query.get("stock")
    if not stock or stock.value < quantity:
        return {"error": "Insufficient stock"}, 400

    ConfigInt.query.filter_by(key="stock", version=stock.version).update({
        "value": stock.value - quantity,
        "version": stock.version + 1
    })
    db.session.commit()
    r.set('stock', stock.value - quantity)

    order = Order(student_id=student_id, quantity=quantity)
    db.session.add(order)
    db.session.commit()

    try:
        conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT))
        channel = conn.channel()
        channel.queue_declare(queue='order_queue', durable=True)
        message = json.dumps({"student_id": student_id, "id": order.id, "quantity": quantity})
        channel.basic_publish(exchange='', routing_key='order_queue', body=message)
        channel.close()
        conn.close()
    except Exception as e:
        return {"error": f"Failed to publish order: {e}"}, 500

    return {"success": "ok"}

if __name__ == '__main__':
    threading.Thread(target=start_consumer, daemon=True).start()
    app.run(host="0.0.0.0", port=8080)