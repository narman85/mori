import { createClient } from '@libsql/client';

// Turso database configuration
const tursoConfig = {
  url: import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://your-database.turso.io',
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || '',
};

// Create Turso client
export const turso = createClient(tursoConfig);

// Database types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  stock: number;
  image_url?: string;
  hover_image_url?: string;
  category?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  guest_email?: string;
  guest_name?: string;
  guest_phone?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripe_payment_intent_id?: string;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// Database operations
export const db = {
  // Products
  async getProducts(): Promise<Product[]> {
    const result = await turso.execute('SELECT * FROM products WHERE is_active = TRUE ORDER BY display_order, created_at DESC');
    return result.rows as unknown as Product[];
  },

  async getProduct(id: string): Promise<Product | null> {
    const result = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      args: [id]
    });
    return result.rows[0] as unknown as Product || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const result = await turso.execute('SELECT * FROM products WHERE is_featured = TRUE AND is_active = TRUE ORDER BY display_order');
    return result.rows as unknown as Product[];
  },

  async updateProductStock(id: string, quantity: number): Promise<void> {
    await turso.execute({
      sql: 'UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [quantity, id]
    });
  },

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const orderId = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO orders (id, user_id, guest_email, guest_name, guest_phone, total_amount, status, stripe_payment_intent_id, shipping_address, billing_address, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderId,
        order.user_id || null,
        order.guest_email || null,
        order.guest_name || null,
        order.guest_phone || null,
        order.total_amount,
        order.status,
        order.stripe_payment_intent_id || null,
        order.shipping_address || null,
        order.billing_address || null,
        order.notes || null
      ]
    });
    return orderId;
  },

  async createOrderItem(orderItem: Omit<OrderItem, 'id' | 'created_at'>): Promise<void> {
    const itemId = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        itemId,
        orderItem.order_id,
        orderItem.product_id,
        orderItem.quantity,
        orderItem.unit_price,
        orderItem.total_price
      ]
    });
  },

  async getOrder(id: string): Promise<Order | null> {
    const result = await turso.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [id]
    });
    return result.rows[0] as unknown as Order || null;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const result = await turso.execute({
      sql: 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      args: [userId]
    });
    return result.rows as unknown as Order[];
  },

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const result = await turso.execute({
      sql: 'SELECT * FROM order_items WHERE order_id = ?',
      args: [orderId]
    });
    return result.rows as unknown as OrderItem[];
  },

  // Users
  async createUser(user: Omit<User, 'created_at' | 'updated_at'>): Promise<void> {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO users (id, email, name, avatar_url, role)
            VALUES (?, ?, ?, ?, ?)`,
      args: [user.id, user.email, user.name || null, user.avatar_url || null, user.role]
    });
  },

  async getUser(id: string): Promise<User | null> {
    const result = await turso.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });
    return result.rows[0] as unknown as User || null;
  },
};