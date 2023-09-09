from flask import Flask, request, render_template, session, redirect
import json

app = Flask(
    __name__,
    static_folder= "templates",
    static_url_path= "/",
)
app.secret_key = "any string but secret"

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

json_file_path = "data\\taipei-attractions.json"
with open(json_file_path, "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

def database():
    spot_list=data["result"]["results"]

    filter_mrt = set()
    filter_category = set()
    attractions = []
    image_URL = []
    
    connection = con.get_connection()
    cursor = connection.cursor()
    
    for sightspot in spot_list:

        name = sightspot["name"]
        category = sightspot["CAT"]
        description = sightspot["description"]
        direction = sightspot["direction"]
        mrt = sightspot["MRT"]
        address = sightspot["address"]
        lng = sightspot["longitude"]
        lat = sightspot["latitude"]
        
        filter_mrt.add(mrt)
        filter_category.add(category)
        attractions.append((name,description,address,direction,lng,lat))

        image_URL_split = sightspot["file"].split("https")
        for parts in image_URL_split:
            if ".jpg" in parts.lower():
                image_URL_connect = "https" + parts
                image_URL.append(image_URL_connect)
                
    for mrt in filter_mrt:
        cursor.execute("INSERT IGNORE INTO mrts (name) VALUES (%s)",(mrt,)) 
        connection.commit()
    
    for category in filter_category:
        cursor.execute("INSERT IGNORE INTO categories (name) VALUES(%s)", (category,)) 
        connection.commit()

    for name, description, address, direction, lng, lat in attractions:
        cursor.execute("INSERT INTO attractions (name,description,address,direction,lng,lat) VALUES(%s, %s, %s, %s, %s, %s)", (name,description,address,direction,lng,lat,))
        connection.commit() 

    for image_URL_connect in image_URL:
            cursor.execute("INSERT INTO images (URL_image) VALUES(%s)", (image_URL_connect,)) 
            connection.commit()

    for sightspot in spot_list:
        mrt_name = sightspot["MRT"]
        cursor.execute("SELECT id FROM mrts WHERE name = %s", (mrt_name,))
        result = cursor.fetchone()
        if result:
            mrt_id = result[0]
            cursor.execute("INSERT INTO attractions (mrt) VALUES (%s)",(mrt_id,))
            connection.commit()  


    
    
          

    cursor.close()
    connection.close()

database()



