-- Tea Store Database Schema for Turso
-- Create tables for the tea store application

-- Users table (for authentication with Clerk)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price REAL NOT NULL,
    sale_price REAL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    hover_image_url TEXT,
    category TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    guest_email TEXT,
    guest_name TEXT,
    guest_phone TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    stripe_payment_intent_id TEXT,
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

-- Insert sample tea products
INSERT OR IGNORE INTO products (id, name, description, short_description, price, sale_price, stock, image_url, category, is_featured, display_order) VALUES
('tea_1', 'Premium Green Tea', 'High-quality green tea leaves sourced from the finest gardens. Rich in antioxidants with a delicate, refreshing taste.', 'Premium organic green tea', 24.99, NULL, 100, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', 'green', TRUE, 1),
('tea_2', 'Earl Grey Supreme', 'Classic Earl Grey blend with bergamot oil and cornflower petals. A sophisticated and aromatic tea experience.', 'Classic Earl Grey blend', 22.99, 19.99, 75, 'https://images.unsplash.com/photo-1571334100328-9a1a5b2ffc1c?w=500', 'black', TRUE, 2),
('tea_3', 'Chamomile Dreams', 'Soothing chamomile flowers perfect for evening relaxation. Naturally caffeine-free herbal blend.', 'Relaxing chamomile herbal tea', 18.99, NULL, 150, 'https://images.unsplash.com/photo-1627220467425-5b4b64d1c3c1?w=500', 'herbal', FALSE, 3),
('tea_4', 'Dragon Well Longjing', 'Traditional Chinese green tea with a sweet, delicate flavor. Pan-roasted leaves with a distinctive flat shape.', 'Traditional Chinese green tea', 32.99, NULL, 50, 'https://images.unsplash.com/photo-1563822249548-7a58fb1fc03b?w=500', 'green', TRUE, 4),
('tea_5', 'Himalayan Gold', 'High-altitude black tea from the Himalayas. Bold and malty with golden tips and exceptional depth.', 'Premium Himalayan black tea', 45.99, 39.99, 25, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', 'black', TRUE, 5);