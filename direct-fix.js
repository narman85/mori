import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function directFix() {
  console.log('🔧 STARTING DIRECT DATABASE FIX...\n');
  
  try {
    // Step 1: List ALL order_items
    console.log('📋 Step 1: Checking ALL order_items...');
    const allOrderItems = await pb.collection('order_items').getFullList({
      expand: 'product,order'
    });
    console.log(`Total order items in database: ${allOrderItems.length}`);
    
    // Step 2: Find problematic items
    console.log('\n🔍 Step 2: Finding problematic items...');
    for (const item of allOrderItems) {
      console.log(`\nOrder Item: ${item.id}`);
      console.log(`- Product ID: ${item.product}`);
      console.log(`- Order ID: ${item.order}`);
      console.log(`- Quantity: ${item.quantity}`);
      console.log(`- Price: ${item.price}`);
      
      // Check if product exists
      if (item.product) {
        try {
          const product = await pb.collection('products').getOne(item.product);
          console.log(`✅ Product exists: ${product.name}`);
        } catch (e) {
          console.log(`❌ Product NOT FOUND: ${item.product}`);
          
          // Try to clear the product reference
          try {
            await pb.collection('order_items').update(item.id, {
              product: ''
            });
            console.log(`✅ Cleared product reference for order item ${item.id}`);
          } catch (updateError) {
            console.log(`❌ Could not clear reference: ${updateError.message}`);
          }
        }
      }
    }
    
    // Step 3: List ALL products
    console.log('\n📦 Step 3: Checking ALL products...');
    const allProducts = await pb.collection('products').getFullList();
    console.log(`Total products in database: ${allProducts.length}`);
    
    for (const product of allProducts) {
      console.log(`\nProduct: ${product.name} (${product.id})`);
      
      // Check for references
      const references = await pb.collection('order_items').getFullList({
        filter: `product = "${product.id}"`
      });
      
      if (references.length > 0) {
        console.log(`⚠️ Has ${references.length} order item references`);
        
        // Clear all references
        for (const ref of references) {
          try {
            await pb.collection('order_items').update(ref.id, {
              product: ''
            });
            console.log(`✅ Cleared reference in order_item ${ref.id}`);
          } catch (e) {
            console.log(`❌ Could not clear: ${e.message}`);
          }
        }
      } else {
        console.log(`✅ No references, safe to delete`);
      }
      
      // Try to delete
      try {
        await pb.collection('products').delete(product.id);
        console.log(`🗑️ DELETED product: ${product.name}`);
      } catch (e) {
        console.log(`❌ Could not delete: ${e.message}`);
      }
    }
    
    console.log('\n✅ DIRECT FIX COMPLETE!');
    
  } catch (error) {
    console.error('❌ Direct fix failed:', error);
  }
}

directFix();