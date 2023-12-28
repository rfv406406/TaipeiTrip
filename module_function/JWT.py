from dotenv import load_dotenv
import os, jwt
from datetime import datetime, timedelta
from jwt import ExpiredSignatureError

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def create_token(user_data):
    payload = {
        'id': user_data['id'],
        'name': user_data['name'],
        'email': user_data['email'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return 'Token has expired'
    except jwt.InvalidTokenError:
        return 'Invalid token'