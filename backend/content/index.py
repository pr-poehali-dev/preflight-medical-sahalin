"""
Business: Manage site content - get and update content items
Args: event with httpMethod (GET/PUT), headers with X-Auth-Token for auth
Returns: HTTP response with content list or update confirmation
"""

import json
import os
import psycopg2
from typing import Dict, Any
import hashlib
import hmac
import base64
from datetime import datetime

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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    auth_result = verify_token(token)
    if not auth_result['valid']:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid or expired token'}),
            'isBase64Encoded': False
        }
    
    user_id = auth_result['user_id']
    
    try:
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        if method == 'GET':
            cursor.execute("SELECT key, value FROM site_content ORDER BY key")
            rows = cursor.fetchall()
            
            content = [{'key': row[0], 'value': row[1]} for row in rows]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(content),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            content_items = body_data.get('content', [])
            
            for item in content_items:
                key = item.get('key')
                value = item.get('value')
                
                if key and value is not None:
                    cursor.execute(
                        """
                        UPDATE site_content 
                        SET value = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s 
                        WHERE key = %s
                        """,
                        (value, user_id, key)
                    )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Content updated successfully'}),
                'isBase64Encoded': False
            }
        
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
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
