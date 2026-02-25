import redis
from flask import Flask, abort
from flask_cors import CORS
from supertokens_python.framework.flask import Middleware
from supertokens_python import get_all_cors_headers

from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session, dashboard

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
def make_order():
    pass

if __name__ == '__main__':
    r = redis.Redis(host="redis-cache", port=6379, decode_responses=True)
    print("Redis Info: ", r.info())
    app.run(debug=True, host="0.0.0.0", port=8000)