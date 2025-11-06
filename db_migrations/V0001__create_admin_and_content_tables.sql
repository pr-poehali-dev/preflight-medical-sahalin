-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_content table for editable content
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES admin_users(id)
);

-- Insert default admin (password: admin123)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$rQYz0YxKjN7K0YxKjN7K0uZxKjN7K0YxKjN7K0YxKjN7K0YxKjN7K0')
ON CONFLICT (username) DO NOTHING;

-- Insert default content
INSERT INTO site_content (key, value, updated_by) VALUES
('hero_title', 'Медицинские осмотры водителей', 1),
('hero_subtitle', 'Профессиональные медицинские осмотры для транспортных компаний на Сахалине', 1),
('phone_primary', '+7 (4242) 12-34-56', 1),
('phone_secondary', '+7 (914) 765-43-21', 1),
('address', 'г. Южно-Сахалинск, ул. Ленина, 123', 1),
('email', 'info@medosmotr-sakhalin.ru', 1)
ON CONFLICT (key) DO NOTHING;