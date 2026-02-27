import redis, requests, os
from flask import Flask, abort, g, request
from flask_cors import CORS
from supertokens_python.framework.flask import Middleware
from supertokens_python import get_all_cors_headers

from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session, dashboard

from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.flask import verify_session

r = redis.Redis(host="redis-cache", port=6379, decode_responses=True)

STOCK_SERVICE_URL = os.getenv("STOCK_SERVICE_URL", "http://stock:8080")

init(
    app_info=InputAppInfo(
        app_name="Order Microservice",
        api_domain="http://localhost:8000",
        website_domain="http://localhost:8000",
        api_base_path="/auth",
        website_base_path="/auth"
    ),
    supertokens_config=SupertokensConfig(
        # We use try.supertokens for demo purposes.
        # At the end of the tutorial we will show you how to create
        # your own SuperTokens core instance and then update your config.
        connection_uri="http://auth:3567",
        api_key= "the-most-super-secret-key"
    ),
    framework='flask',
    recipe_list=[
	    session.init(), # initializes session features
        emailpassword.init(),
        dashboard.init()
    ]
)

app = Flask(__name__)
Middleware(app)

CORS(
    app=app,
    origins=[
        "http://localhost:8000"
    ],
    supports_credentials=True,
    allow_headers=["Content-Type"] + get_all_cors_headers()
)

@app.route('/', defaults={'u_path': ''})  
@app.route('/<path:u_path>')  
def catch_all(u_path: str):
    abort(404)

@app.post('/order')
@verify_session()
def make_order():
    session: SessionContainer = g.supertokens

    user_id = session.get_user_id()

    try:
        data = request.json
        quantity = data["quantity"]
        if r.get('stock') is not None:
            stock = int(r.get('stock'))
            if stock < quantity:
                return {
                    "error": "Insufficient stock"
                }, 400
        req_data = {
            "student_id": user_id,
            "quantity": quantity
        }
        res = requests.post(f"{STOCK_SERVICE_URL}/order", json=req_data)
        if res.status_code != 200:
            return {
                "error": res.json().get("error", "Unknown error")
            }, res.status_code
        return {
            "success": "ok",
            "user_id": user_id
        }
    
    except Exception as e:
        return {
            "error": str(e)
        }, 500

if __name__ == '__main__':
    print("Redis Info: ", r.info())
    app.run(debug=True, host="0.0.0.0", port=8000)