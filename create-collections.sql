-- Create collections directly in PocketBase SQLite database

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price REAL NOT NULL,
    sale_price REAL,
    category TEXT,
    in_stock INTEGER DEFAULT 1,
    stock INTEGER DEFAULT 0,
    image TEXT, -- JSON array
    hover_image TEXT,
    display_order INTEGER DEFAULT 0,
    hidden INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    preparation TEXT, -- JSON object
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    updated TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT OR REPLACE INTO products (
    id, name, description, short_description, price, sale_price, 
    category, in_stock, stock, image, display_order, featured, preparation
) VALUES 
('prod1', 'Hojicha Tea', 
 'Premium Japanese roasted green tea with a distinctive smoky flavor and reddish-brown color. Low in caffeine, perfect for evening enjoyment.',
 'Japanese roasted green tea with smoky flavor', 
 55, 20, 'Green Tea', 1, 15, 
 '["https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600"]',
 1, 1, 
 '{"amount":"3","temperature":"80","steepTime":"2","taste":"Smoky and nutty"}'
),
('prod2', 'Earl Grey', 
 'Classic black tea blend flavored with oil of bergamot. A British favorite with citrusy notes and bold flavor.',
 'Classic black tea with bergamot', 
 30, 0, 'Black Tea', 1, 20, 
 '["https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600"]',
 2, 0, 
 '{"amount":"5","temperature":"95","steepTime":"3","taste":"Bold and citrusy"}'
),
('prod3', 'Sencha Green Tea', 
 'Traditional Japanese green tea with fresh, grassy notes. Rich in antioxidants and perfect for daily enjoyment.',
 'Traditional Japanese green tea', 
 45, 35, 'Green Tea', 1, 25, 
 '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"]',
 3, 1, 
 '{"amount":"4","temperature":"75","steepTime":"2","taste":"Fresh and vegetal"}'
),
('prod4', 'Jasmine Tea', 
 'Delicate green tea scented with jasmine flowers. A fragrant and soothing tea with floral notes.',
 'Floral green tea with jasmine', 
 40, 0, 'Green Tea', 1, 18, 
 '["https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600"]',
 4, 0, 
 '{"amount":"3","temperature":"80","steepTime":"3","taste":"Floral and delicate"}'
);