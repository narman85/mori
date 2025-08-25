// Fix PocketBase collection permissions
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

// Get collections
async function getCollections() {
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
    return data.items;
  } catch (error) {
    console.error('❌ Failed to get collections:', error);
    throw error;
  }
}

// Update collection permissions
async function updateCollectionPermissions(collectionId, permissions) {
  try {
    const response = await fetch(`${API_BASE}/api/collections/${collectionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken
      },
      body: JSON.stringify(permissions)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Permission update failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ Permissions updated for collection "${data.name}"`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to update permissions:`, error);
    throw error;
  }
}

// Main function
async function fixPermissions() {
  try {
    console.log('🔧 Fixing collection permissions...');
    
    // Login as admin
    await loginAdmin();
    
    // Get existing collections
    const collections = await getCollections();
    const productsCollection = collections.find(col => col.name === 'products');
    
    if (!productsCollection) {
      throw new Error('Products collection not found');
    }

    console.log('📝 Current products collection rules:');
    console.log('  - listRule:', productsCollection.listRule || '(empty)');
    console.log('  - viewRule:', productsCollection.viewRule || '(empty)');
    console.log('  - createRule:', productsCollection.createRule || '(empty)');
    console.log('  - updateRule:', productsCollection.updateRule || '(empty)');
    console.log('  - deleteRule:', productsCollection.deleteRule || '(empty)');

    // Update permissions to allow authenticated users to create products
    const newPermissions = {
      listRule: "",  // Anyone can list
      viewRule: "",  // Anyone can view
      createRule: "@request.auth.id != ''",  // Any authenticated user can create
      updateRule: "@request.auth.id != ''",  // Any authenticated user can update
      deleteRule: "@request.auth.id != ''"   // Any authenticated user can delete
    };

    await updateCollectionPermissions(productsCollection.id, newPermissions);
    
    console.log('🎉 Permissions fixed successfully!');
    console.log('📝 New products collection rules:');
    console.log('  - listRule: "" (anyone can list)');
    console.log('  - viewRule: "" (anyone can view)');
    console.log('  - createRule: "@request.auth.id != \'\'" (authenticated users can create)');
    console.log('  - updateRule: "@request.auth.id != \'\'" (authenticated users can update)');
    console.log('  - deleteRule: "@request.auth.id != \'\'" (authenticated users can delete)');
    
  } catch (error) {
    console.error('💥 Permission fix failed:', error);
    process.exit(1);
  }
}

// Run fix
fixPermissions();