"""
Business: Authenticate admin users and issue JWT tokens
Args: event with httpMethod, body containing username/password
Returns: HTTP response with JWT token or error
"""

import json
import os
import psycopg2
from typing import Dict, Any
import hashlib
import hmac
import base64
from datetime import datetime, timedelta

def generate_token(user_id: int, username: str) -> str:
    secret = os.environ.get('JWT_SECRET', 'default_secret_key')
    expiry = int((datetime.utcnow() + timedelta(days=7)).timestamp())
    
    payload = f"{user_id}:{username}:{expiry}"
    signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    token = base64.b64encode(f"{payload}:{signature}".encode()).decode()
    return token

def verify_token(token: str) -> Dict[str, Any]:
    try:
        secret = os.environ.get('JWT_SECRET', 'default_secret_key')
        decoded = base64.b64decode(token).decode()
        parts = decoded.rsplit(':', 1)
        
        if len(parts) != 2:
            return {'valid': False}
        
        payload, signature = parts
        expected_signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != expected_signature:
            return {'valid': False}
        
        user_id, username, expiry = payload.split(':')
        
        if int(expiry) < int(datetime.utcnow().timestamp()):
            return {'valid': False}
        
        return {'valid': True, 'user_id': int(user_id), 'username': username}
    except Exception:
        return {'valid': False}

def simple_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        username = body_data.get('username', '').strip()
        password = body_data.get('password', '').strip()
        
        if not username or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Username and password required'}),
                'isBase64Encoded': False
            }
        
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, username, password_hash FROM admin_users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid credentials'}),
                'isBase64Encoded': False
            }
        
        user_id, db_username, password_hash = user
        
        if simple_hash(password) != password_hash:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid credentials'}),
                'isBase64Encoded': False
            }
        
        token = generate_token(user_id, db_username)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'token': token, 'username': db_username}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
