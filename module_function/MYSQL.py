from flask import *
from dotenv import load_dotenv
import os
load_dotenv()

import mysql.connector
from mysql.connector import pooling

config = {
    "host":os.getenv('HOST'),
    "user":os.getenv('USER'),
    "password":os.getenv('PASSWORD'),
    "database":os.getenv('DATABASE'),
}

con = pooling.MySQLConnectionPool(pool_name = "pool",
                              pool_size = 10,
                              **config)

