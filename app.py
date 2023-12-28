from flask import *
from flask_cors import CORS

from module_function.JWT import create_token, decode_token
from module_function.MYSQL import *

from route.ORDERS import orders_blueprint
from route.MRTS import mrts
from route.ATTRACTIONS import attractions
from route.USERS import users
from route.BOOKINGS import bookings

app=Flask(__name__, static_folder = "static", static_url_path = "/static",)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.register_blueprint(orders_blueprint)
app.register_blueprint(mrts)
app.register_blueprint(attractions)
app.register_blueprint(users)
app.register_blueprint(bookings)

# Pages
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
@app.route("/booking")
def booking():
    return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")

app.run(debug=True, host="0.0.0.0", port=3000)
# app.run(debug = True, port = 3000)
