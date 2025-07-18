from flask import Blueprint,jsonify,request
from module_function.MYSQL import *
from module_function.JWT import create_token, decode_token
import os, requests
from datetime import datetime

orders_blueprint = Blueprint('ORDERS', __name__, template_folder='route')


@orders_blueprint.route("/api/orders", methods=["POST"])
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
   
        headers = {'content-type': 'application/json',
                   "x-api-key": os.getenv('PARTNER_KEY')}
        response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                                 data=json.dumps(payload), headers=headers)
        response_json = response.json()
        if response_json["status"] == 0:
            cursor.execute("""
                            UPDATE ordering
                            SET status = %s
                            WHERE order_number = %s
                        """, ('已繳款', order_number))
            cursor.execute("DELETE FROM booking WHERE member_id = %s", (member_id, ))
            connection.commit()

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
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    
@orders_blueprint.route("/api/orders/<orderNumber>", methods=['GET'])
def orders_get(orderNumber):
 
    auth_header = request.headers.get('Authorization')
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