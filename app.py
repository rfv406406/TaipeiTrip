from flask import *
from flask_cors import CORS
from dotenv import load_dotenv
import os, requests
load_dotenv()

app=Flask(
    __name__,
    static_folder = "static",
    static_url_path = "/static",
    )

CORS(app, resources={r"/*": {"origins": "*"}})

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

#=============================================================================================
from module_function.JWT import create_token, decode_token
from module_function.MYSQL import *
from route.ATTRACTIONS import attractions
app.register_blueprint(attractions)
# ============================================================================================

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


@app.route("/api/mrts")

def api_mrts():
    connection = con.get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT mrts.mrt, COUNT(attractions.mrtnumber) as count_mrt FROM mrts INNER JOIN attractions ON mrts.id = attractions.mrtnumber GROUP BY mrts.mrt ORDER BY count_mrt DESC")
    mrts = cursor.fetchall()
    cursor.close()
    connection.close()

    if mrts:
        mrt_names = []
        for name in mrts:
            mrt_names.append(name["mrt"])
        spot_dict = {
            "data": mrt_names
            }
        return jsonify(spot_dict)
    else:
        error_dict = {
            "error": True,
            "data": "no mrt"
        }
        return jsonify(error_dict)

@app.route("/api/user", methods = ["POST"])

def user():
    try:
        data = request.json
        name = data["signonName"]
        email = data["signonEmail"]
        password = data["signonPassword"]

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT email FROM member WHERE email= %s", (email, ))
        data = cursor.fetchone()

        if data is None:
            cursor.execute("INSERT INTO member(name, email, password) VALUES(%s, %s, %s)", (name, email, password))
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({"ok":True}), 200
        else:
            cursor.close()
            connection.close()
            return jsonify({"error": True,"message": "Email已經註冊帳戶"}), 400
    except mysql.connector.Error:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True,"message": "databaseError"}), 500

@app.route("/api/user/auth", methods=["GET","PUT"])
def user_auth():
    if request.method == "PUT":
        try:
            data = request.json
            email = data["email"]
            password = data["password"]

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, name, email FROM member WHERE email= %s AND password=%s", (email, password))
            data = cursor.fetchone()

            if data is None:
                cursor.close()
                connection.close()
                return jsonify({"error": True,"message": "電子郵件或密碼錯誤"}), 400
            else:
                cursor.close()
                connection.close()
                token = create_token(data)
                return jsonify({'token': token}), 200
        except mysql.connector.Error:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True,"message": "databaseError"}), 500
                   
    if request.method == "GET":
        try:
            auth_header = request.headers.get('Authorization')
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
    
            user_id = payload.get('id')
            user_name = payload.get('name')
            user_email = payload.get('email')

            return jsonify({"data":{'id': user_id, 'name': user_name, 'email': user_email}}), 200
        except ExpiredSignatureError:
            return ({"error": True, "message": "Token is expired"}),401
        except Exception:
            return jsonify(None), 400

@app.route("/api/booking", methods=["GET","POST","DELETE"])

def api_booking():
    if request.method == "POST":
        try:
            auth_header = request.headers.get('Authorization')
            # print(auth_header)
            if auth_header is None:
                return ({"error": True,"message": "please sign in"}), 403
            else:
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                member_id = payload.get('id')

            data = request.json
            # print(data)
            if not data:
                return ({"error": True,"message": "data is not existed"}), 400
            
            attractionId = data["attractionId"]
            date = data["date"]
            time = data["time"]
            price = data["price"]

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM booking WHERE member_id = %s",(member_id,))
            data = cursor.fetchall()
            # print(data)

            if data:
                cursor.execute("DELETE FROM booking WHERE member_id = %s", (member_id,))
                connection.commit()

            cursor.execute("INSERT INTO booking(member_id, attractionId, date, time, price) VALUES(%s, %s, %s, %s, %s)", (member_id, attractionId, date, time, price))
            connection.commit()
            cursor.close()
            connection.close()

            return jsonify({"ok": True}), 200
        
        except mysql.connector.Error:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True,"message": "databaseError"}), 500

    if request.method == "GET":
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header is None:
                return ({"error": True,"message": "please sign in"}), 403
            else:
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                member_id = payload.get('id')

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT booking.attractionId, booking.date, booking.time, booking.price, attractions.name, attractions.address, images.URL_image "
            "FROM booking "
            "LEFT JOIN attractions ON attractions.id = booking.attractionId "
            "LEFT JOIN images ON images.attractions = booking.attractionId "
            "WHERE booking.member_id = %s "
            "LIMIT 1",
            (member_id,))

            data = cursor.fetchone()
            # print(data)
            if data:
                keys = ["attractionId", "name", "address", "URL_image"]
                keys_data = {k: data[k] for k in keys}

                return jsonify({"data":{"attraction":keys_data, "date":data["date"], "time":data["time"], "price":data["price"]}}), 200
                # return jsonify({"data":{"attraction":{"id": data["attractionId"], "name": data["name"], "address":data["address"], "image":data["URL_image"]},
                #                             "date":data["date"], "time":data["time"], "price":data["price"]}}), 200
            else:
                return jsonify(None)     
        except mysql.connector.Error:
            return jsonify({"error": True,"message": "databaseError"}), 500
        
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    if request.method == "DELETE":
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header is None:
                return ({"error": True,"message": "please sign in"}), 403
            else:
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                member_id = payload.get('id')

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("DELETE FROM booking WHERE member_id = %s", (member_id, ))
            connection.commit()

            if cursor.rowcount == 0: #如無對應id，該語句將成功執行，但不會刪除任何記錄
                return jsonify({"error": True, "message": "No record found to delete"}), 404

            return jsonify({"ok":True}), 200
        except mysql.connector.Error:
            return jsonify({"error": True,"message": "databaseError"}), 500
        
        finally:
            cursor.close()
            connection.close()

@app.route("/api/orders", methods=["POST"])

def api_orders():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return ({"error": True,"message": "please sign in"}), 403
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        member_id = payload.get('id')
        if not payload:
            return ({"error": True,"message": "please sign in"}), 403
        
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.get_json()
       
        name = data["order"]["contact"]["name"]
        email = data["order"]["contact"]["email"]
        phone_number = data["order"]["contact"]["phone"]
        prime = data["prime"]
        price = data["order"]["price"]
        attraction_name = data["order"]["trip"]["attraction"]["name"] 
        attraction_address = data["order"]["trip"]["attraction"]["address"]
        attraction_id = data["order"]["trip"]["attraction"]["id"]  
        date = data["order"]["trip"]["date"]  
        time = data["order"]["trip"]["time"]
    
        if not name or not email or not phone_number:
            return jsonify({"error": True,"message": "please fill all information"}), 400
        else:
            order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
            payload = {
                "prime": data["prime"],
                "partner_key": os.getenv('PARTNER_KEY'),
                "merchant_id": "rfv406406_CTBC",
                "details": "TapPay Test",
                "amount": data["order"]["price"],
                "order_number": order_number,
                "cardholder": {
                    "phone_number": phone_number,
                    "name": name,
                    "email": email
                },
                "remember": True
            }
        cursor.execute("""
                       INSERT INTO ordering(
                       member_id, order_number, attraction_id, attraction_name, attraction_address,
                       connection_name, connection_email, phone_number, 
                       date, time, price, status) 
                       VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", 
                       (member_id, order_number, attraction_id, attraction_name, attraction_address, name, email, phone_number, date, time, price, '未繳款'))
        connection.commit()
        cursor.close()
        connection.close()
   
        headers = {'content-type': 'application/json',
                   "x-api-key": os.getenv('PARTNER_KEY')}
        response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                                 data=json.dumps(payload), headers=headers)
        response_json = response.json()
        print(response_json)
        if response_json["status"] == 0:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                            UPDATE ordering
                            SET status = %s
                            WHERE order_number = %s
                        """, ('已繳款', order_number))
            connection.commit()
            cursor.execute("DELETE FROM booking WHERE member_id = %s", (member_id, ))
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({
				"data": {
					"number": response_json['order_number'],
					"payment": {
					"status": "已付款",
					"message": "付款成功"
					}
				}
			}),200
        else:
            return jsonify({
				"data": {
					"number": response_json['order_number'],
					"payment": {
					"status": "未付款",
					"message": "付款失敗"
					}
				}
			}),200
    except Exception as e:
            return jsonify({"error": True,"message":f"Error occurred: {str(e)}"}), 500
    
@app.route("/api/orders/<orderNumber>", methods=['GET'])
def orders_get(orderNumber):
 
    auth_header = request.headers.get('Authorization')
    # print(auth_header)
    if not auth_header:
        return ({"error": True,"message": "please sign in"}), 403
    token = auth_header.split(' ')[1]
    payload = decode_token(token)
    if not payload:
        return ({"error": True,"message": "please sign in"}), 403
    
    connection = con.get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM ordering WHERE order_number = %s",(orderNumber,))
    data = cursor.fetchone()
    # print(data)
    cursor.close()
    connection.close()
    if data:
        order_info = {
            'data':{
            "number": data["order_number"],
            "price": data["price"],
            "trip": {
                "attraction": {
                    "id": data["attraction_id"],
                    "name": data["attraction_name"],
                    "address": data["attraction_address"],
                },
                "date": data["date"],
                "time": data["time"],
            },
            "contact": {
                "name": data["connection_name"],
                "email":data["connection_email"],
                "phone": data["phone_number"]
            },
            "status": data["status"]
        }}

    return jsonify(order_info), 200
        
        
app.run(debug=None, host="0.0.0.0", port=3000)
# app.run(debug = True, port = 3000)
