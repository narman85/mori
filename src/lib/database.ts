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

// Static demo products
const demoProducts: Product[] = [
  {
    id: 'tea_1',
    name: 'Premium Green Tea',
    description: 'High-quality green tea leaves sourced from the finest gardens. Rich in antioxidants with a delicate, refreshing taste.',
    short_description: 'Premium organic green tea',
    price: 24.99,
    sale_price: undefined,
    stock: 100,
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
    hover_image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&brightness=110',
    category: 'green',
    is_featured: true,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tea_2',
    name: 'Earl Grey Supreme',
    description: 'Classic Earl Grey blend with bergamot oil and cornflower petals. A sophisticated and aromatic tea experience.',
    short_description: 'Classic Earl Grey blend',
    price: 22.99,
    sale_price: 19.99,
    stock: 75,
    image_url: 'https://images.unsplash.com/photo-1571334100328-9a1a5b2ffc1c?w=500',
    hover_image_url: 'https://images.unsplash.com/photo-1571334100328-9a1a5b2ffc1c?w=500&brightness=110',
    category: 'black',
    is_featured: true,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tea_3',
    name: 'Chamomile Dreams',
    description: 'Soothing chamomile flowers perfect for evening relaxation. Naturally caffeine-free herbal blend.',
    short_description: 'Relaxing chamomile herbal tea',
    price: 18.99,
    sale_price: undefined,
    stock: 150,
    image_url: 'https://images.unsplash.com/photo-1627220467425-5b4b64d1c3c1?w=500',
    hover_image_url: 'https://images.unsplash.com/photo-1627220467425-5b4b64d1c3c1?w=500&brightness=110',
    category: 'herbal',
    is_featured: false,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tea_4',
    name: 'Dragon Well Longjing',
    description: 'Traditional Chinese green tea with a sweet, delicate flavor. Pan-roasted leaves with a distinctive flat shape.',
    short_description: 'Traditional Chinese green tea',
    price: 32.99,
    sale_price: undefined,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1563822249548-7a58fb1fc03b?w=500',
    hover_image_url: 'https://images.unsplash.com/photo-1563822249548-7a58fb1fc03b?w=500&brightness=110',
    category: 'green',
    is_featured: true,
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tea_5',
    name: 'Himalayan Gold',
    description: 'High-altitude black tea from the Himalayas. Bold and malty with golden tips and exceptional depth.',
    short_description: 'Premium Himalayan black tea',
    price: 45.99,
    sale_price: 39.99,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
    hover_image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&brightness=110',
    category: 'black',
    is_featured: true,
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tea_6',
    name: 'Jasmine Phoenix Pearls',
    description: 'Hand-rolled green tea pearls scented with jasmine flowers. A delicate floral aroma with sweet undertones.',
    short_description: 'Jasmine-scented green tea pearls',
    price: 28.99,
    sale_price: undefined,
    stock: 80,
    image_url: 'https://images.unsplash.com/photo-1597318378904-d16154d3d04d?w=500',
    hover_image_url: 'https://images.unsplash.com/photo-1597318378904-d16154d3d04d?w=500&brightness=110',
    category: 'green',
    is_featured: false,
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Database operations (now using static data)
export const db = {
  // Products
  async getProducts(): Promise<Product[]> {
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