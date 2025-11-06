-- Update contact information
UPDATE site_content SET value = 'Сахалинская область, г. Южно-Сахалинск, Ул. Чехова, 43, 2 этаж, кабинет 3' WHERE key = 'address';
UPDATE site_content SET value = '+7 914 767-51-12' WHERE key = 'phone_primary';
UPDATE site_content SET value = '+7 914 744-95-68' WHERE key = 'phone_secondary';
UPDATE site_content SET value = 'intermed.ltd@bk.ru' WHERE key = 'email';

-- Add working hours to content
INSERT INTO site_content (key, value, updated_by) VALUES
('working_hours', 'Пн — Пт: 05:00–19:00, Сб — Вс: 06:00–18:00, Перерыв 12:00–15:00', 1)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
