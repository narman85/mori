// Simple cleanup script to remove all product references
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function cleanAllProducts() {
  try {
    console.log('Starting database cleanup...');

    // Step 1: Delete ALL order items (nuclear option)
    console.log('Deleting all order items...');
    const allOrderItems = await pb.collection('order_items').getFullList();
    console.log(`Found ${allOrderItems.length} order items to delete`);
    
    for (const item of allOrderItems) {
      try {
        await pb.collection('order_items').delete(item.id);
        console.log(`✓ Deleted order item ${item.id}`);
      } catch (error) {
        console.log(`✗ Failed to delete order item ${item.id}:`, error.message);
      }
    }

    // Step 2: Delete ALL orders (nuclear option)
    console.log('Deleting all orders...');
    const allOrders = await pb.collection('orders').getFullList();
    console.log(`Found ${allOrders.length} orders to delete`);
    
    for (const order of allOrders) {
      try {
        await pb.collection('orders').delete(order.id);
        console.log(`✓ Deleted order ${order.id}`);
      } catch (error) {
        console.log(`✗ Failed to delete order ${order.id}:`, error.message);
      }
    }

    // Step 3: Now delete all products
    console.log('Deleting all products...');
    const allProducts = await pb.collection('products').getFullList();
    console.log(`Found ${allProducts.length} products to delete`);
    
    for (const product of allProducts) {
      try {
        await pb.collection('products').delete(product.id);
        console.log(`✓ Deleted product ${product.name} (${product.id})`);
      } catch (error) {
        console.log(`✗ Failed to delete product ${product.name}:`, error.message);
      }
    }

    console.log('✅ Database cleanup complete!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

// Run cleanup
cleanAllProducts();