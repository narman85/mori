import React, { useState, useEffect } from 'react';
import { ProductCard, Product } from './ProductCard';
import { CartSidebar } from './CartSidebar';
import { pb } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  className?: string;
}

interface PocketBaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  featured: boolean;
  image: string[];
  created: string;
  updated: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ className = '' }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('products').getFullList<PocketBaseProduct>({
        sort: '-featured,-created',
        filter: 'in_stock = true'
      });

      // Transform PocketBase products to match our Product interface
      const transformedProducts: Product[] = records.map(record => ({
        id: record.id,
        name: record.name,
        description: record.description,
        price: record.price,
        weight: record.category || '100gr', // Use category as weight for now
        images: record.image && record.image.length > 0
          ? record.image.map(img => pb.files.getURL(record, img))
          : ['https://via.placeholder.com/400x400?text=No+Image'],
        originalPrice: record.featured ? record.price * 1.2 : undefined // Add discount for featured
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to demo products if error
      setProducts([
    {
      id: '1',
      name: 'Hōji-cha - Strong Roasted',
      description: 'A deeply roasted green tea with a smoky, earthy aroma and robust flavor.',
      price: 18,
      weight: '100gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    },
    {
      id: '2',
      name: 'Hōji-cha - Strong Roasted',
      description: 'A deeply roasted green tea with a smoky, earthy aroma and robust flavor.',
      price: 18,
      weight: '100gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/f3bba78c5228f67b6184e5f8344191447ce20481?placeholderIfAbsent=true']
    },
    {
      id: '3',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto. ..',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    },
    {
      id: '4',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    },
    {
      id: '5',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    },
    {
      id: '6',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    },
    {
      id: '7',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    },
    {
      id: '8',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      images: ['https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true']
    }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className={`px-8 max-md:px-4 ${className}`}>
      <h2 className="text-black text-5xl font-normal leading-none text-center mt-[30px] max-md:text-[36px] max-md:mt-6">
        Selection
      </h2>
      
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 w-full max-w-[1428px] mt-[35px] max-md:mt-8">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <Skeleton className="h-6 w-1/3 mt-3" />
              </div>
            ))
          ) : products.length === 0 ? (
            // No products message
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products available</p>
              <p className="text-gray-400 text-sm mt-2">Please check back later</p>
            </div>
          ) : (
            // Products grid
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {}} // Bu artıq istifadə olunmur
                onCartOpen={() => setIsCartOpen(true)}
                className="w-full"
              />
            ))
          )}
        </div>
      </div>
      
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex justify-start mt-[205px] max-md:mt-10 max-md:w-[70vw] max-md:relative max-md:left-0 max-md:right-auto max-md:-ml-4 max-md:mr-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f9a083c8737fcdd71aaa82d2560e2547c2c34744?placeholderIfAbsent=true"
          alt="Tea ceremony decoration"
          className="aspect-[3.53] object-contain w-[965px] max-w-full max-md:w-full md:w-[420px] lg:w-[965px] md:self-start"
        />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </section>
  );
};
