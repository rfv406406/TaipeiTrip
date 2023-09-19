from flask import *
from flask_cors import CORS

app=Flask(__name__)

app=Flask(
	__name__,
	static_folder = "static",
    static_url_path = "/static",
	)

CORS(app, resources={r"/*": {"origins": "*"}})

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

import mysql.connector
from mysql.connector import pooling
config = {
    "host":"127.0.0.1",
    "user":"root",
    "password":"rfv406406",
    "database":"taipeiattractions",
}
con =  pooling.MySQLConnectionPool(pool_name = "mypool",
                              pool_size = 3,
                              **config)

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

@app.route("/api/attractions")

def api_attractions():
	page = max(0, int(request.args.get("page", 1)))
	per_page = 12
	keyword = request.args.get("keyword", None)
	offset = max(0, page * per_page)
	limit = per_page

	connection = con.get_connection()
	cursor = connection.cursor(dictionary=True)

	if keyword:
		sql_query = (
			"SELECT attractions.id, attractions.name, attractions.description, attractions.address, "
			"attractions.transport, attractions.lat, attractions.lng, mrts.mrt, categories.category "
			"FROM attractions "
			"LEFT JOIN mrts ON mrts.id = attractions.mrtnumber "
			"LEFT JOIN categories ON categories.id = attractions.categorynumber "
			"WHERE mrts.mrt = %s OR attractions.name LIKE %s OR attractions.name LIKE %s "
			"LIMIT %s OFFSET %s"
		)
		cursor.execute(
			sql_query,
			(keyword, '%' + keyword + '%', keyword + '%', limit, offset)
		)
	else:
		sql_query = (
			"SELECT attractions.id, attractions.name, attractions.description, attractions.address, "
			"attractions.transport, attractions.lat, attractions.lng, mrts.mrt, categories.category "
			"FROM attractions "
			"LEFT JOIN mrts ON mrts.id = attractions.mrtnumber "
			"LEFT JOIN categories ON categories.id = attractions.categorynumber "
			"LIMIT %s OFFSET %s"
		)
		cursor.execute(sql_query, (limit, offset))

	attractions = cursor.fetchall()

	for attraction in attractions:
		cursor.execute("SELECT URL_image FROM images WHERE attractions = %s", (attraction["id"],))
		images = cursor.fetchall()
		images_list = []
		for image in images:
			images_list.append(image["URL_image"])
		attraction["images"] = images_list

	cursor.close()
	connection.close()
	
	if attractions:
		if len(attractions) == per_page:
			nextPage = page + 1
		else:
			nextPage = None  
		
		spot_dict = {
			"nextPage": nextPage,
        	"data": attractions
			}
		return jsonify(spot_dict),200
	else:
		error_dict = {
			"error": True,
			"message": "no spot"
		}
		return jsonify(error_dict),500

@app.route("/api/attraction/<int:attractionId>")

def api_attraction(attractionId):
	try:
		connection = con.get_connection()
		cursor = connection.cursor(dictionary=True)

		cursor.execute(
			"SELECT attractions.id, attractions.name, mrts.mrt, attractions.description, "
			"attractions.address, attractions.transport, categories.category, attractions.lat, attractions.lng "
			"FROM attractions "
			"LEFT JOIN mrts ON mrts.id = attractions.mrtnumber "
			"LEFT JOIN categories ON categories.id = attractions.categorynumber "
			"WHERE attractions.id = %s",
			(attractionId,)
			)
		attraction = cursor.fetchone()

		if attraction:
			cursor.execute("SELECT URL_image FROM images WHERE attractions = %s", (attractionId,))
			images = cursor.fetchall()
			images_list = []
			for image in images:
				images_list.append(image["URL_image"])
			attraction["images"] = images_list
			
			cursor.close()
			connection.close()

			spot_dict = {
				"data": attraction
			}
			return jsonify(spot_dict),200
		else:
			cursor.close()
			connection.close()
			error_dict = {
				"error": True,
				"message": "NO ID"
			}
			return jsonify(error_dict),400

	except mysql.connector.Error:
		cursor.close()
		connection.close()
		return jsonify({
			"error": True,
            "message": "databaseError"
		}),500

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

@app.route("/api/signon", methods = ["POST"])

def signon():
    try:
        data = request.json
        name = data["name"]
        email = data["email"]
        password = data["password"]

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
            return jsonify({"error": True,"message": "註冊失敗"}), 400
    except mysql.connector.Error:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True,"message": "databaseError"}), 500
app.run(debug=True, host="0.0.0.0", port=3000)
# app.run(debug = True, port = 3000)
