-- Update admin password to use simple SHA256 hash
UPDATE admin_users 
SET password_hash = 'c0a0f97f6d7c4b9f86a1b0c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0'
WHERE username = 'admin';
