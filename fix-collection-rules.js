// Fix PocketBase collection rules
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

    const data = await response.json();
    adminToken = data.token;
    console.log('✅ Admin login successful');
    return data;
  } catch (error) {
    console.error('❌ Admin login failed:', error);
    throw error;
  }
}

// Update collection rules
async function updateCollectionRules() {
  try {
    // Get products collection ID
    const collectionsResponse = await fetch(`${API_BASE}/api/collections`, {
      headers: { 'Authorization': adminToken }
    });
    const collections = await collectionsResponse.json();
    const productsCollection = collections.items.find(col => col.name === 'products');

    if (!productsCollection) {
      throw new Error('Products collection not found');
    }

    // Update rules to allow any authenticated user
    const updateData = {
      ...productsCollection,
      listRule: '', // Anyone can list
      viewRule: '', // Anyone can view
      createRule: '@request.auth.id != ""', // Any authenticated user can create
      updateRule: '@request.auth.id != ""', // Any authenticated user can update
      deleteRule: '@request.auth.id != ""'  // Any authenticated user can delete
    };

    const response = await fetch(`${API_BASE}/api/collections/${productsCollection.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update collection: ${errorData}`);
    }

    console.log('✅ Products collection rules updated successfully!');
    console.log('📋 New rules:');
    console.log('  Create: Any authenticated user can create products');
    console.log('  Update: Any authenticated user can update products');
    console.log('  Delete: Any authenticated user can delete products');

  } catch (error) {
    console.error('❌ Failed to update collection rules:', error);
    throw error;
  }
}

// Main function
async function fixRules() {
  try {
    console.log('🔧 Fixing PocketBase collection rules...');
    await loginAdmin();
    await updateCollectionRules();
    console.log('🎉 Rules fixed! You can now add products from the React app.');
  } catch (error) {
    console.error('💥 Fix failed:', error);
  }
}

fixRules();