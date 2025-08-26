import sqlite3
import os

# Connect to database
db_path = 'pb_data/data.db'
print(f"Opening database: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("\n1. CHECKING ORDER_ITEMS...")
    cursor.execute("SELECT COUNT(*) FROM order_items")
    count = cursor.fetchone()[0]
    print(f"   Found {count} order items")
    
    if count > 0:
        print("   Clearing all product references in order_items...")
        cursor.execute("UPDATE order_items SET product = NULL WHERE product IS NOT NULL")
        conn.commit()
        print("   ✅ Cleared all product references")
    
    print("\n2. CHECKING PRODUCTS...")
    cursor.execute("SELECT id, name FROM products")
    products = cursor.fetchall()
    print(f"   Found {len(products)} products:")
    for p in products:
        print(f"   - {p[1]} ({p[0]})")
    
    print("\n3. DELETING ALL PRODUCTS...")
    cursor.execute("DELETE FROM products")
    conn.commit()
    deleted = cursor.rowcount
    print(f"   ✅ Deleted {deleted} products")
    
    print("\n4. VERIFYING...")
    cursor.execute("SELECT COUNT(*) FROM products")
    remaining = cursor.fetchone()[0]
    print(f"   Products remaining: {remaining}")
    
    if remaining == 0:
        print("\n✅ SUCCESS! All products deleted from database!")
    else:
        print(f"\n❌ WARNING: {remaining} products still remain")
        
        # Try more aggressive deletion
        print("\n5. TRYING AGGRESSIVE DELETION...")
        cursor.execute("DELETE FROM products WHERE 1=1")
        conn.commit()
        
        cursor.execute("SELECT COUNT(*) FROM products")
        remaining = cursor.fetchone()[0]
        print(f"   Products remaining after aggressive delete: {remaining}")
    
    conn.close()
    print("\n✅ DATABASE FIX COMPLETE!")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    conn.close()