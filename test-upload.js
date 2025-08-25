// Test PocketBase file upload
import PocketBase from 'pocketbase';
import fs from 'fs';
import FormData from 'form-data';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testUpload() {
  try {
    // Login as user
    await pb.collection('users').authWithPassword('babayev1994@gmail.com', '1234567890');
    console.log('✅ Logged in');

    // Create a simple test image file
    const testImagePath = 'test-image.jpg';
    
    // If test image doesn't exist, create a dummy one
    if (!fs.existsSync(testImagePath)) {
      // Create a minimal valid JPEG file
      const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
        0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
      ]);
      fs.writeFileSync(testImagePath, jpegHeader);
      console.log('📝 Created test image');
    }

    // Test 1: Create product without image using FormData
    console.log('\n🧪 Test 1: Create with FormData (no image)');
    const formData1 = new FormData();
    formData1.append('name', 'Test Product FormData');
    formData1.append('description', 'Test description');
    formData1.append('price', '99.99');
    formData1.append('category', 'Test');
    formData1.append('in_stock', 'true');
    formData1.append('featured', 'false');

    try {
      const product1 = await pb.collection('products').create(formData1);
      console.log('✅ Created product:', product1.id);
      await pb.collection('products').delete(product1.id);
      console.log('🗑️  Deleted test product');
    } catch (error) {
      console.error('❌ FormData without image failed:', error.response?.data || error.message);
    }

    // Test 2: Create product with image using FormData
    console.log('\n🧪 Test 2: Create with FormData (with image)');
    const formData2 = new FormData();
    formData2.append('name', 'Test Product with Image');
    formData2.append('description', 'Test description');
    formData2.append('price', '99.99');
    formData2.append('category', 'Test');
    formData2.append('in_stock', 'true');
    formData2.append('featured', 'false');
    
    // Add the image file
    const imageBuffer = fs.readFileSync(testImagePath);
    formData2.append('image', imageBuffer, {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg'
    });

    try {
      const product2 = await pb.collection('products').create(formData2);
      console.log('✅ Created product with image:', product2.id);
      console.log('   Image field:', product2.image);
      await pb.collection('products').delete(product2.id);
      console.log('🗑️  Deleted test product');
    } catch (error) {
      console.error('❌ FormData with image failed:', error.response?.data || error.message);
    }

    // Clean up test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('🧹 Cleaned up test image');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUpload();