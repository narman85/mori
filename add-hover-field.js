import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function addHoverImageField() {
  try {
    console.log('Logging in as admin...');
    await pb.collection('users').authWithPassword('admin@pixel-perfect.com', 'PixelPerfect2024!');
    
    console.log('Getting products collection...');
    const collection = await pb.collections.getOne('products');
    
    // Check if hover_image field already exists
    const hasHoverField = collection.schema.some(field => field.name === 'hover_image');
    
    if (hasHoverField) {
      console.log('hover_image field already exists!');
      return;
    }
    
    console.log('Adding hover_image field to products collection...');
    
    // Add hover_image field
    collection.schema.push({
      system: false,
      id: 'hover_' + Math.random().toString(36).substr(2, 9),
      name: 'hover_image',
      type: 'file',
      required: false,
      unique: false,
      options: {
        maxSelect: 1,
        maxSize: 10485760, // 10MB
        mimeTypes: [
          'image/jpeg',
          'image/png',
          'image/svg+xml',
          'image/gif',
          'image/webp'
        ],
        thumbs: [],
        protected: false
      }
    });
    
    // Update the collection
    await pb.collections.update(collection.id, collection);
    
    console.log('Successfully added hover_image field!');
    console.log('Products can now have a separate hover image.');
    
  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      console.error('Response data:', error.response);
    }
  }
}

addHoverImageField();