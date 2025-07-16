from flask import Blueprint,jsonify,request
from module_function.MYSQL import *

mrts = Blueprint('MRTS', __name__)

@mrts.route("/api/mrts")

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