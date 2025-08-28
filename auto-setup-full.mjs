// Full automatic setup for PocketBase
import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'https://mori-tea-backend.fly.dev';

async function setupAdmin() {
  console.log('🔧 Creating admin account...');
  
  try {
    const adminData = {
      email: 'babayev1994@gmail.com',
      password: 'Alibaba1994',
      passwordConfirm: 'Alibaba1994'
    };
    
    const response = await fetch(`${API_URL}/api/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });
    
    if (response.ok) {
      console.log('✅ Admin created successfully');
      return true;
    } else {
      console.log('⚠️ Admin might already exist or first-time setup needed');
      return true; // Continue anyway
    }
  } catch (error) {
    console.log('⚠️ Admin setup issue, continuing...');
    return true;
  }
}

async function loginAdmin() {
  console.log('🔐 Logging in as admin...');
  
  try {
    const loginData = {
      identity: 'babayev1994@gmail.com',
      password: 'Alibaba1994'
    };
    
    const response = await fetch(`${API_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Logged in successfully');
      return data.token;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('❌ Could not login:', error.message);
    return null;
  }
}

async function createCollection(token, collectionData) {
  try {
    const response = await fetch(`${API_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(collectionData)
    });
    
    if (response.ok) {
      console.log(`✅ Created collection: ${collectionData.name}`);
      return await response.json();
    } else {
      const error = await response.text();
      console.log(`⚠️ Collection ${collectionData.name} might already exist`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error creating ${collectionData.name}:`, error.message);
    return null;
  }
}

async function addProduct(token, productData) {
  try {
    const response = await fetch(`${API_URL}/api/collections/products/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      console.log(`✅ Added product: ${productData.name}`);
      return true;
    } else {
      const error = await response.text();
      console.log(`⚠️ Could not add ${productData.name}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error adding ${productData.name}:`, error.message);
    return false;
  }
}

async function fullSetup() {
  console.log('🚀 Starting full PocketBase setup...\n');
  
  // Step 1: Create admin
  await setupAdmin();
  
  // Step 2: Login
  const token = await loginAdmin();
  if (!token) {
    console.error('❌ Cannot proceed without admin token');
    return;
  }
  
  // Step 3: Create collections
  console.log('\n📦 Creating collections...');
  
  // Products collection
  const productsCollection = await createCollection(token, {
    name: 'products',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
    schema: [
      { name: 'name', type: 'text', required: true, options: { max: 200 } },
      { name: 'description', type: 'text', required: false, options: { max: 2000 } },
      { name: 'short_description', type: 'text', required: false, options: { max: 500 } },
      { name: 'price', type: 'number', required: true, options: { min: 0, max: 999999 } },
      { name: 'sale_price', type: 'number', required: false, options: { min: 0, max: 999999 } },
      { name: 'category', type: 'text', required: false, options: { max: 100 } },
      { name: 'in_stock', type: 'bool', required: false },
      { name: 'stock', type: 'number', required: false, options: { min: 0, max: 99999, noDecimal: true } },
      { name: 'image', type: 'json', required: false },
      { name: 'hover_image', type: 'text', required: false, options: { max: 500 } },
      { name: 'display_order', type: 'number', required: false, options: { min: 0, max: 9999, noDecimal: true } },
      { name: 'hidden', type: 'bool', required: false },
      { name: 'featured', type: 'bool', required: false },
      { name: 'preparation', type: 'json', required: false }
    ]
  });
  
  // Orders collection
  await createCollection(token, {
    name: 'orders',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
    schema: [
      { name: 'user', type: 'relation', required: false, options: { collectionId: '_pb_users_auth_', cascadeDelete: false, maxSelect: 1 } },
      { name: 'total_price', type: 'number', required: true, options: { min: 0, max: 999999 } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] } },
      { name: 'shipping_address', type: 'json', required: true },
      { name: 'guest_email', type: 'email', required: false },
      { name: 'guest_name', type: 'text', required: false, options: { max: 200 } },
      { name: 'guest_phone', type: 'text', required: false, options: { max: 50 } },
      { name: 'payment_intent_id', type: 'text', required: false, options: { max: 200 } }
    ]
  });
  
  // Get collection IDs for relations
  const collections = await fetch(`${API_URL}/api/collections`, {
    headers: { 'Authorization': token }
  }).then(r => r.json());
  
  const productsId = collections.items?.find(c => c.name === 'products')?.id;
  const ordersId = collections.items?.find(c => c.name === 'orders')?.id;
  
  if (productsId && ordersId) {
    // Order items collection
    await createCollection(token, {
      name: 'order_items',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      schema: [
        { name: 'order', type: 'relation', required: true, options: { collectionId: ordersId, cascadeDelete: true, maxSelect: 1 } },
        { name: 'product', type: 'relation', required: true, options: { collectionId: productsId, cascadeDelete: false, maxSelect: 1 } },
        { name: 'quantity', type: 'number', required: true, options: { min: 1, max: 999, noDecimal: true } },
        { name: 'price', type: 'number', required: true, options: { min: 0, max: 999999 } }
      ]
    });
  }
  
  // Step 4: Add sample products
  console.log('\n🫖 Adding sample products...');
  
  const products = [
    {
      name: 'Hojicha Tea',
      description: 'Premium Japanese roasted green tea with a distinctive smoky flavor and reddish-brown color. Low in caffeine, perfect for evening enjoyment.',
      short_description: 'Japanese roasted green tea with smoky flavor',
      price: 55,
      sale_price: 20,
      category: 'Green Tea',
      in_stock: true,
      stock: 15,
      image: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600'],
      hover_image: '',
      display_order: 1,
      hidden: false,
      featured: true,
      preparation: {
        amount: '3',
        temperature: '80',
        steepTime: '2',
        taste: 'Smoky and nutty'
      }
    },
    {
      name: 'Earl Grey',
      description: 'Classic black tea blend flavored with oil of bergamot. A British favorite with citrusy notes and bold flavor.',
      short_description: 'Classic black tea with bergamot',
      price: 30,
      sale_price: 0,
      category: 'Black Tea',
      in_stock: true,
      stock: 20,
      image: ['https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600'],
      hover_image: '',
      display_order: 2,
      hidden: false,
      featured: false,
      preparation: {
        amount: '5',
        temperature: '95',
        steepTime: '3',
        taste: 'Bold and citrusy'
      }
    },
    {
      name: 'Sencha Green Tea',
      description: 'Traditional Japanese green tea with fresh, grassy notes. Rich in antioxidants and perfect for daily enjoyment.',
      short_description: 'Traditional Japanese green tea',
      price: 45,
      sale_price: 35,
      category: 'Green Tea',
      in_stock: true,
      stock: 25,
      image: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
      display_order: 3,
      featured: true,
      preparation: {
        amount: '4',
        temperature: '75',
        steepTime: '2',
        taste: 'Fresh and vegetal'
      }
    },
    {
      name: 'Jasmine Tea',
      description: 'Delicate green tea scented with jasmine flowers. A fragrant and soothing tea with floral notes.',
      short_description: 'Floral green tea with jasmine',
      price: 40,
      category: 'Green Tea',
      in_stock: true,
      stock: 18,
      image: ['https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600'],
      display_order: 4,
      preparation: {
        amount: '3',
        temperature: '80',
        steepTime: '3',
        taste: 'Floral and delicate'
      }
    }
  ];
  
  for (const product of products) {
    await addProduct(token, product);
  }
  
  console.log('\n✨ Setup complete!');
  console.log('🌐 Visit your site: https://mori-sigma.vercel.app');
  console.log('🔧 Admin panel: https://mori-tea-backend.fly.dev/_/');
  console.log('📧 Admin login: babayev1994@gmail.com / Alibaba1994');
}

fullSetup();