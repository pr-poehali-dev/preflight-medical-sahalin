-- Create images table for uploaded files
CREATE TABLE IF NOT EXISTS site_images (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    filename VARCHAR(512) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES admin_users(id)
);

-- Insert default image placeholders
INSERT INTO site_images (key, url, filename, uploaded_by) VALUES
('hero_image', 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200', 'hero-default.jpg', 1),
('about_image', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 'about-default.jpg', 1),
('service_image', 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600', 'service-default.jpg', 1)
ON CONFLICT (key) DO NOTHING;
