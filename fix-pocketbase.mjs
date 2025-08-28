import fetch from 'node-fetch';

const API_URL = 'https://mori-tea-backend.fly.dev';
const ADMIN_EMAIL = 'admin@mori.az';
const ADMIN_PASSWORD = 'MoriTea2024!';

let authToken = '';

async function login() {
  try {
    const response = await fetch(`${API_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
      console.log('✅ Logged in successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

async function createCollection(collectionData) {
  try {
    const response = await fetch(`${API_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify(collectionData)
    });
    
    if (response.ok) {
      console.log(`✅ Created collection: ${collectionData.name}`);
      return await response.json();
    } else {
      const error = await response.text();
      console.log(`⚠️ Collection ${collectionData.name} might already exist`);
    }
  } catch (error) {
    console.error(`❌ Error creating ${collectionData.name}:`, error.message);
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up PocketBase database...\n');
  
  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.error('Cannot proceed without login');
    return;
  }

  // Create Products Collection
  await createCollection({
    name: 'products',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'name', type: 'text', required: true, options: { min: 1, max: 200 } },
      { name: 'description', type: 'text', required: false, options: { max: 2000 } },
      { name: 'short_description', type: 'text', required: false, options: { max: 500 } },
      { name: 'price', type: 'number', required: true, options: { min: 0, max: 999999, noDecimal: false } },
      { name: 'sale_price', type: 'number', required: false, options: { min: 0, max: 999999, noDecimal: false } },
      { name: 'category', type: 'text', required: false, options: { max: 100 } },
      { name: 'in_stock', type: 'bool', required: false, options: {} },
      { name: 'stock', type: 'number', required: false, options: { min: 0, max: 99999, noDecimal: true } },
      { name: 'image', type: 'json', required: false, options: { maxSize: 5000000 } },
      { name: 'hover_image', type: 'text', required: false, options: { max: 500 } },
      { name: 'display_order', type: 'number', required: false, options: { min: 0, max: 9999, noDecimal: true } },
      { name: 'hidden', type: 'bool', required: false, options: {} },
      { name: 'featured', type: 'bool', required: false, options: {} },
      { name: 'preparation', type: 'json', required: false, options: { maxSize: 5000000 } }
    ]
  });

  // Create Orders Collection
  await createCollection({
    name: 'orders',
    type: 'base',
    listRule: '@request.auth.id != "" || @request.data.guest_email != ""',
    viewRule: '@request.auth.id != "" || @request.data.guest_email != ""',
    createRule: '',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'user', type: 'relation', required: false, options: { collectionId: '_pb_users_auth_', cascadeDelete: false, maxSelect: 1 } },
      { name: 'total_price', type: 'number', required: true, options: { min: 0, max: 999999 } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] } },
      { name: 'shipping_address', type: 'json', required: true, options: { maxSize: 5000000 } },
      { name: 'guest_email', type: 'email', required: false, options: {} },
      { name: 'guest_name', type: 'text', required: false, options: { max: 200 } },
      { name: 'guest_phone', type: 'text', required: false, options: { max: 50 } },
      { name: 'payment_intent_id', type: 'text', required: false, options: { max: 200 } }
    ]
  });

  // Get collections to find IDs
  const collectionsResponse = await fetch(`${API_URL}/api/collections`, {
    headers: { 'Authorization': authToken }
  });
  const collections = await collectionsResponse.json();
  
  const productsCollection = collections.items?.find(c => c.name === 'products');
  const ordersCollection = collections.items?.find(c => c.name === 'orders');

  if (productsCollection && ordersCollection) {
    // Create Order Items Collection with proper relations
    await createCollection({
      name: 'order_items',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      schema: [
        { name: 'order', type: 'relation', required: true, options: { collectionId: ordersCollection.id, cascadeDelete: true, maxSelect: 1 } },
        { name: 'product', type: 'relation', required: true, options: { collectionId: productsCollection.id, cascadeDelete: false, maxSelect: 1 } },
        { name: 'quantity', type: 'number', required: true, options: { min: 1, max: 999, noDecimal: true } },
        { name: 'price', type: 'number', required: true, options: { min: 0, max: 999999 } }
      ]
    });
  }

  // Create Categories Collection
  await createCollection({
    name: 'categories',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'name', type: 'text', required: true, options: { min: 1, max: 100 } },
      { name: 'slug', type: 'text', required: true, options: { min: 1, max: 100, pattern: '^[a-z0-9-]+$' } },
      { name: 'display_order', type: 'number', required: false, options: { min: 0, max: 999, noDecimal: true } }
    ]
  });

  console.log('\n📝 Adding sample products...');
  
  // Add sample products
  const products = [
    {
      name: 'Hojicha Tea',
      description: 'Premium Japanese roasted green tea with a distinctive smoky flavor and reddish-brown color. Low in caffeine, perfect for evening enjoyment. This tea undergoes a unique roasting process that gives it its characteristic nutty and caramel notes.',
      short_description: 'Japanese roasted green tea with smoky flavor',
      price: 55,
      sale_price: 20,
      category: 'Green Tea',
      in_stock: true,
      stock: 15,
      image: ['https://i.imgur.com/FQvscCe.png'],
      hover_image: 'https://i.imgur.com/xOZxNzV.png',
      display_order: 1,
      hidden: false,
      featured: true,
      preparation: {
        amount: '3',
        temperature: '80',
        steepTime: '2',
        taste: 'Smoky and nutty',
        grams: '3g',
        ml: '250ml'
      }
    },
    {
      name: 'Earl Grey',
      description: 'Classic black tea blend flavored with oil of bergamot. A British favorite with citrusy notes and bold flavor. Perfect for afternoon tea time with milk or lemon.',
      short_description: 'Classic black tea with bergamot',
      price: 30,
      sale_price: 0,
      category: 'Black Tea',
      in_stock: true,
      stock: 20,
      image: ['https://i.imgur.com/7qXFSCn.png'],
      hover_image: 'https://i.imgur.com/HZ8ZJPX.png',
      display_order: 2,
      hidden: false,
      featured: false,
      preparation: {
        amount: '5',
        temperature: '95',
        steepTime: '3',
        taste: 'Bold and citrusy',
        grams: '5g',
        ml: '250ml'
      }
    }
  ];

  for (const product of products) {
    try {
      const response = await fetch(`${API_URL}/api/collections/products/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        console.log(`✅ Added product: ${product.name}`);
      } else {
        const error = await response.text();
        console.log(`⚠️ Could not add ${product.name}: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${product.name}:`, error.message);
    }
  }

  console.log('\n✨ Setup complete! Your site should now work.');
  console.log('🌐 Visit: https://mori-sigma.vercel.app');
}

setupDatabase();