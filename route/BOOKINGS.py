from flask import Blueprint,jsonify,request
from module_function.MYSQL import *
from module_function.JWT import *

bookings = Blueprint('BOOKINGS', __name__)


@bookings.route("/api/booking", methods=["GET","POST","DELETE"])

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