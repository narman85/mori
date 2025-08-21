import React from 'react';
import { ProductCard, Product } from './ProductCard';

interface ProductGridProps {
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ className = '' }) => {

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


  return (
    <section className={`px-8 max-md:px-4 ${className}`}>
      <h2 className="text-black text-5xl font-normal leading-none text-center mt-[30px] max-md:text-[36px] max-md:mt-6">
        Selection
      </h2>
      
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 w-full max-w-[1428px] mt-[35px] max-md:mt-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => {}} // Bu artıq istifadə olunmur
              className="w-full"
            />
          ))}
        </div>
      </div>
      
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex justify-start mt-[205px] max-md:mt-10 max-md:w-full max-md:relative max-md:left-0 max-md:right-0 max-md:ml-0 max-md:mr-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f9a083c8737fcdd71aaa82d2560e2547c2c34744?placeholderIfAbsent=true"
          alt="Tea ceremony decoration"
          className="aspect-[3.53] object-contain w-[965px] max-w-full max-md:max-w-[70%]"
        />
      </div>
    </section>
  );
};
