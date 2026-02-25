from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

import redis

import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
db = SQLAlchemy(app)
r = redis.Redis(host="redis-cache", port=6379, decode_responses=True)

class ConfigInt(db.Model):
    key = db.Column(db.String(100), primary_key=True)
    value = db.Column(db.Integer)
    version = db.Column(db.Integer, default=1)

    def as_dict(self):
        return {"key": self.key, "value": self.value}

with app.app_context():
    db.create_all()

@app.get('/')
def hello():
    return "I am running"

@app.get('/status')
def get_status():
    stock = ConfigInt.query.get("stock")
    if stock is None:
        stock = ConfigInt(key="stock", value=0)
        r.set('stock', 0)
        db.session.add(stock)
        db.session.commit()
    return stock.as_dict()

@app.post('/setstock')
def set_stock():
    try:
        data = request.json
        qty = data["quantity"]
        if "quantity" not in data:
            return {
                "error": "You must provide 'quantity'" 
            }, 403
        stock = ConfigInt.query.get("stock")
        if stock is None:
            stock = ConfigInt(key="stock", value=qty)
            db.session.add(stock)
        stock.value = qty
        r.set('stock', qty)
        db.session.commit()
        return {
            "success": "ok"
        }
    except Exception as e:
        return {
            "error": e
        }
    
@app.post('/order')
def make_order():
    try:
        student_id = request.json["student_id"]
        quantity = request.json["quantity"]

        if r.get('stock') is not None:
            stock = int(r.get('stock'))
            if stock < quantity:
                return {
                    "error": "Insufficient stock"
                }, 400
        
        stock = ConfigInt.query.get("stock")
        r.set('stock', stock.value)
        if stock is None or stock.value < quantity:
            return {
                "error": "Insufficient stock"
            }, 400
        stock.value -= quantity
        db.session.commit()
        return {
            "success": "order placed"
        }
    except Exception as e:
        return {
            "error": e
        }

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)

