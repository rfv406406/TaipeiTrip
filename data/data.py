from flask import Flask, request, render_template, session, redirect
import json

app = Flask(
    __name__,
    static_folder= "templates",
    static_url_path= "/",
)
app.secret_key = "rfv406406"

from mysql.connector import pooling

# config = {
#     "host":"127.0.0.1",
#     "user":"root",
#     "password":"rfv406406",
#     "database":"taipeiattractions",
# }

config = {
    "host":"parking-rds.clw082guwyfz.ap-southeast-2.rds.amazonaws.com",
    "user":"rfv406406",
    "password":"rfv406406",
    "database":"taipeiattractions",
}

con =  pooling.MySQLConnectionPool(pool_name = "mypool",
                              pool_size = 3,
                              **config)

json_file_path = "taipei-attractions.json"
with open(json_file_path, "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

def database():
    spot_list=data["result"]["results"]

    filter_mrt = set()
    filter_category = set()
    
    connection = con.get_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    
    for sightspot in spot_list:
        mrt = sightspot["MRT"]
        category = sightspot["CAT"]
        filter_mrt.add(mrt)
        filter_category.add(category)
    
    for mrt in filter_mrt:
        cursor.execute("INSERT INTO mrts (mrt) VALUES (%s)",(mrt,)) 
        connection.commit()
    
    for category in filter_category:
        cursor.execute("INSERT INTO categories (category) VALUES(%s)", (category,)) 
        connection.commit()


    for sightspot in spot_list:
        name = sightspot["name"]
        description = sightspot["description"]
        direction = sightspot["direction"]
        address = sightspot["address"]
        lng = sightspot["longitude"]
        lat = sightspot["latitude"]
        mrt = sightspot["MRT"]
        category = sightspot["CAT"]

            # Retrieve MRT id
        cursor.execute("SELECT id FROM mrts WHERE mrt = %s", (mrt,))
        mrt_result = cursor.fetchone()
        if mrt_result:
            mrt_id = mrt_result["id"]
        else:
            # Handle the case where MRT doesn't exist in mrts table
            mrt_id = None

        # Retrieve Category id
        cursor.execute("SELECT id FROM categories WHERE category = %s", (category,))
        category_result = cursor.fetchone()
        if category_result:
            category_id = category_result["id"]
        else:
            # Handle the case where Category doesn't exist in categories table
            category_id = None

        image_URL = []
        image_URL_split = sightspot["file"].split("https")
        for parts in image_URL_split:
            if ".jpg" in parts.lower():
                image_URL_connect = "https" + parts
                image_URL.append(image_URL_connect)

        cursor.execute("INSERT INTO attractions (name, description, address, transport, lng, lat, categorynumber, mrtnumber) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)", (name, description, address, direction, lng, lat, category_id, mrt_id,))
        connection.commit()
        cursor.execute("SELECT LAST_INSERT_ID()")
        result = cursor.fetchone()
        if result:
            attraction_id = result["LAST_INSERT_ID()"]
            for image_URL_connect in image_URL:
                cursor.execute("INSERT INTO images (URL_image, attractions) VALUES(%s, %s)", (image_URL_connect, attraction_id,)) 
                connection.commit()
                
    cursor.close()
    connection.close()

database()



