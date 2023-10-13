from dotenv import load_dotenv
import os
load_dotenv()

import mysql.connector
from mysql.connector import pooling
config = {
    "host": os.getenv('HOST'),
    "user":os.getenv('USER'),
    "password":os.getenv('PASSWORD'),
    "database":os.getenv('DATABASE'),
}
con =  pooling.MySQLConnectionPool(pool_name = "mypool",
                              pool_size = 3,
                              **config)