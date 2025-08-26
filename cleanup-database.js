import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Admin login (you'll need to provide admin credentials)
async function loginAsAdmin() {
  try {
    await pb.admins.authWithPassword('admin@example.com', 'your-admin-password');
    console.log('Logged in as admin');
  } catch (error) {
    console.log('Admin login failed, trying to continue without auth...');
  }
}

async function cleanupDatabase() {
  try {
    await loginAsAdmin();

    console.log('=== CLEANING UP DATABASE RELATIONS ===');

    // 1. Get all products
    const products = await pb.collection('products').getFullList();
    console.log(`Found ${products.length} products`);

    // 2. For each product, find and clean up related records
    for (const product of products) {
      console.log(`\n--- Cleaning product: ${product.name} (${product.id}) ---`);

      // Find order_items that reference this product
      try {
        const orderItems = await pb.collection('order_items').getFullList({
          filter: `product = "${product.id}"`
        });

        console.log(`Found ${orderItems.length} order items for this product`);

        // Delete or nullify order items
        for (const item of orderItems) {
          try {
            // Try to delete the order item first
            await pb.collection('order_items').delete(item.id);
            console.log(`✓ Deleted order item: ${item.id}`);
          } catch (deleteError) {
            // If can't delete, try to nullify the product reference
            try {
              await pb.collection('order_items').update(item.id, {
                product: null,
                product_name: `[DELETED] ${item.product_name || 'Unknown'}`,
                product_deleted: true
              });
              console.log(`✓ Nullified order item: ${item.id}`);
            } catch (updateError) {
              console.log(`✗ Failed to clean order item: ${item.id}`, updateError.message);
            }
          }
        }
      } catch (error) {
        console.log(`Could not check order_items for product ${product.id}:`, error.message);
      }

      // Now try to delete the product
      try {
        await pb.collection('products').delete(product.id);
        console.log(`✓ Successfully deleted product: ${product.name}`);
      } catch (deleteError) {
        console.log(`✗ Still cannot delete product: ${product.name}`, deleteError.message);
        
        // Last resort: mark as deleted
        try {
          await pb.collection('products').update(product.id, {
            in_stock: false,
            name: `[DELETED] ${product.name}`,
            description: '[This product has been deleted]',
            deleted_flag: true,
            deleted_at: new Date().toISOString()
          });
          console.log(`✓ Marked product as deleted: ${product.name}`);
        } catch (markError) {
          console.log(`✗ Cannot even mark as deleted: ${product.name}`, markError.message);
        }
      }
    }

    console.log('\n=== CLEANUP COMPLETE ===');

  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

// Run the cleanup
cleanupDatabase().then(() => {
  console.log('Script finished');
  process.exit(0);
}).catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});