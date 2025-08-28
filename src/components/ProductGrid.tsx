import React, { useState, useEffect } from 'react';
import { ProductCard, Product } from './ProductCardSimple';
import { CartSidebar } from './CartSidebarSimple';
import { db } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ className = '' }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const tursoProducts = await db.getProducts();
        
        const formattedProducts: Product[] = tursoProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          short_description: product.short_description,
          price: product.price,
          sale_price: product.sale_price,
          stock: product.stock,
          weight: '100g', // Default weight
          images: [], // Not used
          image: product.image_url ? [product.image_url] : [],
          hover_image: product.hover_image_url,
          originalPrice: undefined
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onCartOpen={() => setIsCartOpen(true)}
          />
        ))}
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};