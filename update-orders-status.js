// Update orders collection to add 'paid' status
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

// Update collection schema
async function updateCollectionSchema(collectionId, schema) {
  try {
    const response = await fetch(`${API_BASE}/api/collections/${collectionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken
      },
      body: JSON.stringify({ schema })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Schema update failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ Schema updated for collection "${data.name}"`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to update schema:`, error);
    throw error;
  }
}

// Main function
async function updateOrdersStatus() {
  try {
    console.log('🔧 Updating orders status field...');
    
    // Login as admin
    await loginAdmin();
    
    // Get existing collections
    const collections = await getCollections();
    const ordersCollection = collections.find(col => col.name === 'orders');
    
    if (!ordersCollection) {
      throw new Error('Orders collection not found');
    }

    console.log('📝 Current orders status field:');
    const statusField = ordersCollection.schema.find(field => field.name === 'status');
    if (statusField) {
      console.log('  - values:', statusField.options.values);
    }

    // Update the status field to include 'paid'
    const updatedSchema = ordersCollection.schema.map(field => {
      if (field.name === 'status') {
        return {
          ...field,
          options: {
            ...field.options,
            values: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
            default: "pending"
          }
        };
      }
      return field;
    });

    await updateCollectionSchema(ordersCollection.id, updatedSchema);
    
    console.log('🎉 Orders status updated successfully!');
    console.log('📝 New status values:');
    console.log('  - pending (default)');
    console.log('  - paid (after successful payment)');
    console.log('  - processing');
    console.log('  - shipped');
    console.log('  - delivered');
    console.log('  - cancelled');
    
  } catch (error) {
    console.error('💥 Update failed:', error);
    process.exit(1);
  }
}

// Run update
updateOrdersStatus();