from flask import Blueprint,jsonify,request
from module_function.MYSQL import *

attractions = Blueprint('ATTRACTIONS', __name__)

@attractions.route("/api/attractions")

def api_attractions():
    page = max(0, int(request.args.get("page", 1)))
    per_page = 12
    keyword = request.args.get("keyword", None)
    offset = max(0, page * per_page)
    limit = per_page

    connection = con.get_connection()
    cursor = connection.cursor(dictionary=True)
    try: 
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

        if len(attractions) > 0:
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
        
    except mysql.connector.Error as err:
        return jsonify({
            "error": True,
            "message": "databaseError"
        }),500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@attractions.route("/api/attraction/<int:attractionId>")

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

            spot_dict = {
                "data": attraction
            }
            return jsonify(spot_dict),200
        else:
            error_dict = {
                "error": True,
                "message": "NO ID"
            }
            return jsonify(error_dict),400

    except mysql.connector.Error:

        return jsonify({
            "error": True,
            "message": "databaseError"
        }),500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()