import React, { useState } from 'react';
import { ProductCard, Product } from './ProductCard';

interface ProductGridProps {
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ className = '' }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const products: Product[] = [
    {
      id: '1',
      name: 'Hōji-cha - Strong Roasted',
      description: 'A deeply roasted green tea with a smoky, earthy aroma and robust flavor.',
      price: 18,
      weight: '100gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    },
    {
      id: '2',
      name: 'Hōji-cha - Strong Roasted',
      description: 'A deeply roasted green tea with a smoky, earthy aroma and robust flavor.',
      price: 18,
      weight: '100gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/f3bba78c5228f67b6184e5f8344191447ce20481?placeholderIfAbsent=true'
    },
    {
      id: '3',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto. ..',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    },
    {
      id: '4',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    },
    {
      id: '5',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    },
    {
      id: '6',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    },
    {
      id: '7',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    },
    {
      id: '8',
      name: 'Uji Matcha "Yui"',
      description: 'High-quality ceremonial-grade matcha from Uji, Kyoto.',
      price: 13,
      originalPrice: 18,
      weight: '30gr',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2eda7905de45b6ae8321802ded9bb0bb102d95d4?placeholderIfAbsent=true'
    }
  ];

  const handleAddToCart = async (product: Product) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <section className={className}>
      <h2 className="text-black text-6xl font-normal leading-none text-center mt-[50px] max-md:text-[40px] max-md:mt-10">
        Selection
      </h2>
      
      <div className="flex w-full max-w-[1428px] gap-[48px_20px] flex-wrap mt-[50px] max-md:max-w-full max-md:mt-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            className="min-h-[645px]"
          />
        ))}
      </div>
      
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/f9a083c8737fcdd71aaa82d2560e2547c2c34744?placeholderIfAbsent=true"
        alt="Tea ceremony decoration"
        className="aspect-[3.53] object-contain w-[965px] max-w-full mt-[205px] max-md:mt-10"
      />
    </section>
  );
};
