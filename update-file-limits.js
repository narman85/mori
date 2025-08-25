// Update PocketBase collection file size limits
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
async function updateFileLimits() {
  try {
    console.log('📁 Updating file size limits...');
    
    // Login as admin
    await loginAdmin();
    
    // Get existing collections
    const collections = await getCollections();
    const productsCollection = collections.find(col => col.name === 'products');
    
    if (!productsCollection) {
      throw new Error('Products collection not found');
    }

    console.log('📝 Current image field config:');
    const imageField = productsCollection.schema.find(field => field.name === 'image');
    if (imageField) {
      console.log('  - maxSelect:', imageField.options.maxSelect);
      console.log('  - maxSize:', imageField.options.maxSize, '(', Math.round(imageField.options.maxSize / 1024 / 1024 * 100) / 100, 'MB)');
      console.log('  - mimeTypes:', imageField.options.mimeTypes);
    }

    // Update the image field with larger file size limit (10MB)
    const updatedSchema = productsCollection.schema.map(field => {
      if (field.name === 'image') {
        return {
          ...field,
          options: {
            ...field.options,
            maxSize: 10485760, // 10MB
            maxSelect: 5
          }
        };
      }
      return field;
    });

    await updateCollectionSchema(productsCollection.id, updatedSchema);
    
    console.log('🎉 File limits updated successfully!');
    console.log('📝 New image field config:');
    console.log('  - maxSelect: 5');
    console.log('  - maxSize: 10485760 (10MB)');
    console.log('  - mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"]');
    
  } catch (error) {
    console.error('💥 Update failed:', error);
    process.exit(1);
  }
}

// Run update
updateFileLimits();