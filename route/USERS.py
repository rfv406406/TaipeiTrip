from flask import Blueprint,jsonify,request
from module_function.MYSQL import *
from module_function.JWT import *

users = Blueprint('USERS', __name__)


@users.route("/api/user", methods = ["POST"])

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

@users.route("/api/user/auth", methods=["GET","PUT"])

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