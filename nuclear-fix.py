import sqlite3

# Connect to database
db_path = 'pb_data/data.db'
print(f"Opening database: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("\n=== NUCLEAR DATABASE FIX ===")
    
    print("\n1. DELETING ALL ORDER_ITEMS...")
    cursor.execute("DELETE FROM order_items")
    conn.commit()
    deleted_items = cursor.rowcount
    print(f"   Deleted {deleted_items} order items")
    
    print("\n2. DELETING ALL ORDERS...")
    cursor.execute("DELETE FROM orders")
    conn.commit()
    deleted_orders = cursor.rowcount
    print(f"   Deleted {deleted_orders} orders")
    
    print("\n3. DELETING ALL PRODUCTS...")
    cursor.execute("DELETE FROM products")
    conn.commit()
    deleted_products = cursor.rowcount
    print(f"   Deleted {deleted_products} products")
    
    print("\n4. FINAL CHECK...")
    cursor.execute("SELECT COUNT(*) FROM products")
    products_left = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM orders")
    orders_left = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM order_items")
    items_left = cursor.fetchone()[0]
    
    print(f"   Products remaining: {products_left}")
    print(f"   Orders remaining: {orders_left}")
    print(f"   Order items remaining: {items_left}")
    
    if products_left == 0:
        print("\n=== SUCCESS! DATABASE COMPLETELY CLEANED! ===")
        print("You can now add fresh products without any issues.")
    else:
        print(f"\nWARNING: {products_left} products still remain somehow")
    
    conn.close()
    
except Exception as e:
    print(f"\nERROR: {e}")
    conn.close()