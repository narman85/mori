// NUCLEAR DELETE - Completely removes all database constraints
// This script will clean EVERYTHING and allow product deletion

const pb = require('pocketbase');
const client = new pb.default('http://127.0.0.1:8090');

async function nuclearClean() {
  console.log('🚀 STARTING NUCLEAR DATABASE CLEANUP...');
  
  try {
    // Step 1: Delete ALL order_items (this breaks all constraints)
    console.log('💥 Step 1: Nuking ALL order_items...');
    const allOrderItems = await client.collection('order_items').getFullList();
    console.log(`Found ${allOrderItems.length} order items to delete`);
    
    for (const item of allOrderItems) {
      try {
        await client.collection('order_items').delete(item.id);
        console.log(`✅ Deleted order item: ${item.id}`);
      } catch (e) {
        console.log(`❌ Failed: ${item.id}`);
      }
    }

    // Step 2: Delete ALL orders (removes all order references)  
    console.log('💥 Step 2: Nuking ALL orders...');
    const allOrders = await client.collection('orders').getFullList();
    console.log(`Found ${allOrders.length} orders to delete`);
    
    for (const order of allOrders) {
      try {
        await client.collection('orders').delete(order.id);
        console.log(`✅ Deleted order: ${order.id}`);
      } catch (e) {
        console.log(`❌ Failed: ${order.id}`);
      }
    }

    // Step 3: Now delete ALL products (should work now)
    console.log('💥 Step 3: Nuking ALL products...');
    const allProducts = await client.collection('products').getFullList();
    console.log(`Found ${allProducts.length} products to delete`);
    
    for (const product of allProducts) {
      try {
        await client.collection('products').delete(product.id);
        console.log(`✅ Deleted product: ${product.name} (${product.id})`);
      } catch (e) {
        console.log(`❌ Failed: ${product.name}`);
      }
    }

    console.log('🎉 NUCLEAR CLEANUP COMPLETE!');
    console.log('All products, orders, and order items have been removed.');
    console.log('You can now add fresh products without any constraint issues.');

  } catch (error) {
    console.error('💀 Nuclear cleanup failed:', error);
  }
}

nuclearClean();