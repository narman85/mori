import { createClient } from '@libsql/client';

// Turso database client
export const turso = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL || '',
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || ''
});

// Database operations using Turso
export const tursoDb = {
  // Products
  async getProducts() {
    const result = await turso.execute(`
      SELECT * FROM products 
      WHERE is_active = 1 
      ORDER BY display_order DESC, created_at DESC
    `);
    return result.rows;
  },

  async getProduct(id: string) {
    const result = await turso.execute({
      sql: `SELECT * FROM products WHERE id = ? AND is_active = 1`,
      args: [id]
    });
    return result.rows[0] || null;
  },

  async createProduct(productData: any) {
    return await turso.execute({
      sql: `INSERT INTO products (
        id, name, description, short_description, price, sale_price, stock,
        image_url, hover_image_url, category, is_featured, is_active,
        display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        productData.id,
        productData.name,
        productData.description,
        productData.short_description,
        productData.price,
        productData.sale_price,
        productData.stock,
        productData.image_url,
        productData.hover_image_url,
        productData.category,
        productData.is_featured ? 1 : 0,
        productData.is_active ? 1 : 0,
        productData.display_order,
        productData.created_at,
        productData.updated_at
      ]
    });
  },

  async updateProduct(id: string, productData: any) {
    return await turso.execute({
      sql: `UPDATE products SET 
        name = ?, description = ?, short_description = ?, 
        price = ?, sale_price = ?, stock = ?, 
        category = ?, is_featured = ?, is_active = ?, 
        updated_at = ?
        WHERE id = ?`,
      args: [
        productData.name,
        productData.description,
        productData.short_description,
        productData.price,
        productData.sale_price,
        productData.stock,
        productData.category,
        productData.is_featured ? 1 : 0,
        productData.is_active ? 1 : 0,
        new Date().toISOString(),
        id
      ]
    });
  },

  async deleteProduct(id: string) {
    return await turso.execute({
      sql: `UPDATE products SET is_active = 0, updated_at = ? WHERE id = ?`,
      args: [new Date().toISOString(), id]
    });
  },

  // Orders
  async createOrder(orderData: any) {
    const orderId = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO orders (
        id, user_id, guest_email, guest_name, total_amount, 
        status, shipping_address, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderId,
        orderData.user_id,
        orderData.guest_email,
        orderData.guest_name,
        orderData.total_amount,
        orderData.status || 'pending',
        orderData.shipping_address,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    });
    return orderId;
  },

  async getOrders() {
    const result = await turso.execute(`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `);
    return result.rows;
  }
};

// Legacy exports for backward compatibility
export const pb = null; // Deprecated - use tursoDb
export const supabase = null; // Deprecated - use tursoDb