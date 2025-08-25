// Debug PocketBase collections structure
const API_BASE = 'http://127.0.0.1:8090';

// Admin credentials
const ADMIN_EMAIL = 'babayev1994@gmail.com';
const ADMIN_PASSWORD = '1234567890';

let adminToken = '';

// Login as admin
async function loginAdmin() {
  try {
    const response = await fetch(`${API_BASE}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    adminToken = data.token;
    console.log('✅ Admin login successful');
    return data;
  } catch (error) {
    console.error('❌ Admin login failed:', error);
    throw error;
  }
}

// Get collection details
async function getCollectionDetails(collectionName) {
  try {
    const response = await fetch(`${API_BASE}/api/collections`, {
      headers: {
        'Authorization': adminToken
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get collections: ${response.statusText}`);
    }

    const data = await response.json();
    const collection = data.items.find(col => col.name === collectionName);
    
    if (!collection) {
      throw new Error(`Collection '${collectionName}' not found`);
    }

    console.log(`\n📋 Collection: ${collectionName}`);
    console.log(`ID: ${collection.id}`);
    console.log(`Type: ${collection.type}`);
    console.log('\n🏗️  Schema:');
    collection.schema.forEach((field, index) => {
      console.log(`  ${index + 1}. ${field.name} (${field.type})`);
      console.log(`     Required: ${field.required}`);
      if (field.options) {
        console.log(`     Options:`, field.options);
      }
    });
    
    console.log('\n🔐 Rules:');
    console.log(`  List: ${collection.listRule || 'No rule'}`);
    console.log(`  View: ${collection.viewRule || 'No rule'}`);
    console.log(`  Create: ${collection.createRule || 'No rule'}`);
    console.log(`  Update: ${collection.updateRule || 'No rule'}`);
    console.log(`  Delete: ${collection.deleteRule || 'No rule'}`);

    return collection;
  } catch (error) {
    console.error(`❌ Failed to get collection '${collectionName}':`, error);
    throw error;
  }
}

// Test product creation
async function testProductCreation() {
  try {
    const testData = {
      name: 'Test Product',
      description: 'Test description',
      price: 19.99,
      category: 'Test',
      in_stock: true,
      featured: false
    };

    console.log('\n🧪 Testing product creation with data:', testData);

    const response = await fetch(`${API_BASE}/api/collections/products/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Product creation failed:');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', errorData);
      return;
    }

    const record = await response.json();
    console.log('✅ Product created successfully:', record.id);
    
    // Delete test product
    await fetch(`${API_BASE}/api/collections/products/records/${record.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': adminToken
      }
    });
    console.log('🗑️  Test product deleted');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Main function
async function debugCollections() {
  try {
    console.log('🚀 Starting PocketBase collection debug...');
    
    await loginAdmin();
    await getCollectionDetails('products');
    await testProductCreation();
    
  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
}

debugCollections();