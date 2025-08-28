// Direct API setup for Fly.io PocketBase
const POCKETBASE_URL = 'https://mori-tea-backend.fly.dev';

async function setupDatabase() {
  console.log('🚀 Setting up PocketBase on Fly.io...\n');
  console.log('⚠️  IMPORTANT: First create admin account manually!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Open: https://mori-tea-backend.fly.dev/_/');
  console.log('2. Create admin with:');
  console.log('   Email: admin@mori.az');
  console.log('   Password: MoriTea2024!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Sample products data
  const products = [
    {
      name: 'Hojicha Tea',
      description: 'Premium Japanese roasted green tea with a distinctive smoky flavor.',
      short_description: 'Japanese roasted green tea',
      price: 55,
      sale_price: 20,
      category: 'Green Tea',
      in_stock: true,
      stock: 15,
      image: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400'],
      display_order: 1,
      featured: true
    },
    {
      name: 'Earl Grey',
      description: 'Classic black tea blend flavored with oil of bergamot.',
      short_description: 'Classic black tea with bergamot',
      price: 30,
      category: 'Black Tea',
      in_stock: true,
      stock: 20,
      image: ['https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400'],
      display_order: 2
    }
  ];
  
  console.log('Sample products ready to add manually via admin panel.');
  console.log('Products to add:', products.map(p => p.name).join(', '));
}

setupDatabase();