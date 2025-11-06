"""
Business: Handle image uploads to S3-compatible storage and save URLs to database
Args: event with httpMethod (POST for upload, GET for list), headers with X-Auth-Token
Returns: HTTP response with uploaded image URL or list of images
"""

import json
import os
import psycopg2
import base64
import hashlib
from typing import Dict, Any
from datetime import datetime
import hmac

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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            cursor.execute("SELECT id, key, url, filename FROM site_images ORDER BY key")
            rows = cursor.fetchall()
            
            images = [
                {'id': row[0], 'key': row[1], 'url': row[2], 'filename': row[3]}
                for row in rows
            ]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(images),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            key = body_data.get('key', '').strip()
            image_url = body_data.get('url', '').strip()
            filename = body_data.get('filename', 'image.jpg').strip()
            
            if not key or not image_url:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Key and URL required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                """
                INSERT INTO site_images (key, url, filename, uploaded_by)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (key) 
                DO UPDATE SET 
                    url = EXCLUDED.url,
                    filename = EXCLUDED.filename,
                    uploaded_at = CURRENT_TIMESTAMP,
                    uploaded_by = EXCLUDED.uploaded_by
                RETURNING id
                """,
                (key, image_url, filename, user_id)
            )
            
            image_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': image_id,
                    'key': key,
                    'url': image_url,
                    'filename': filename
                }),
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
