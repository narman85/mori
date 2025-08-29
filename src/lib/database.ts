// Static data for demo - In production this would be API calls

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

// Demo products removed - now using only Turso database
const demoProducts: Product[] = [];

// Database operations (now using Turso - this file is deprecated)
export const db = {
  // Products
  async getProducts(): Promise<Product[]> {
    console.warn('⚠️ WARNING: Using deprecated db.getProducts(). Use tursoDb.getProducts() instead!');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return demoProducts.filter(p => p.is_active);
  },

  async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return demoProducts.find(p => p.id === id && p.is_active) || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return demoProducts.filter(p => p.is_featured && p.is_active);
  },

  async updateProductStock(id: string, quantity: number): Promise<void> {
    // In real app, this would update the database
    const product = demoProducts.find(p => p.id === id);
    if (product) {
      product.stock = Math.max(0, product.stock - quantity);
    }
  },

  // Orders (demo functions)
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const orderId = crypto.randomUUID();
    console.log('Demo: Created order', orderId, order);
    return orderId;
  },

  async createOrderItem(orderItem: Omit<OrderItem, 'id' | 'created_at'>): Promise<void> {
    console.log('Demo: Created order item', orderItem);
  },

  async getOrder(id: string): Promise<Order | null> {
    console.log('Demo: Get order', id);
    return null; // Demo implementation
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    console.log('Demo: Get orders for user', userId);
    return []; // Demo implementation
  },

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    console.log('Demo: Get order items', orderId);
    return []; // Demo implementation
  },

  // Users (demo functions)
  async createUser(user: Omit<User, 'created_at' | 'updated_at'>): Promise<void> {
    console.log('Demo: Created user', user);
  },

  async getUser(id: string): Promise<User | null> {
    console.log('Demo: Get user', id);
    return null; // Demo implementation
  },
};