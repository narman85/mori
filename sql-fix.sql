-- SQL COMMANDS TO FIX DATABASE CONSTRAINTS

-- 1. First, check what foreign keys exist
SELECT sql FROM sqlite_master WHERE type='table' AND name='order_items';

-- 2. Remove ALL order_items records that reference products
DELETE FROM order_items WHERE product IS NOT NULL;

-- 3. Now delete all products
DELETE FROM products;

-- 4. If constraint still exists, we need to recreate the table without constraint
-- Drop and recreate order_items table without foreign key constraint
DROP TABLE IF EXISTS order_items_backup;
CREATE TABLE order_items_backup AS SELECT * FROM order_items;
DROP TABLE order_items;

-- Recreate without foreign key
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order TEXT,
    product TEXT, -- No REFERENCES constraint
    quantity INTEGER,
    price REAL,
    created TEXT,
    updated TEXT,
    product_name TEXT,
    product_deleted INTEGER
);

-- Copy data back
INSERT INTO order_items SELECT * FROM order_items_backup;
DROP TABLE order_items_backup;