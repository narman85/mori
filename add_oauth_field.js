// Temporary script to add oauth_user_id field to orders collection
const PocketBase = require('pocketbase/cjs');

async function addOAuthField() {
  const pb = new PocketBase('http://127.0.0.1:8090');
  
  try {
    // Login as admin (you'll need to create admin first)
    await pb.admins.authWithPassword('admin@example.com', 'adminpassword');
    
    // Get orders collection
    const collection = await pb.collections.getOne('orders');
    
    // Add oauth_user_id field
    collection.schema.push({
      id: 'oauth_user_id_field',
      name: 'oauth_user_id',
      type: 'text',
      system: false,
      required: false,
      presentable: false,
      unique: false,
      options: {
        min: null,
        max: null,
        pattern: ''
      }
    });
    
    // Update collection
    await pb.collections.update(collection.id, collection);
    
    console.log('oauth_user_id field added successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

addOAuthField();