import React, { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsLoading(false);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <article className={`min-w-60 grow shrink w-[371px] max-md:max-w-full ${className}`}>
      <div className="flex w-full items-center gap-3 max-md:max-w-full">
        <div className="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
          <div className="w-full overflow-hidden max-md:max-w-full">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[1.06] object-contain w-full max-md:max-w-full"
            />
          </div>
          
          <div className="bg-[rgba(238,238,238,1)] flex w-full gap-[40px_54px] text-base font-normal justify-between p-6 max-md:max-w-full max-md:px-5">
            <div className="min-w-60 w-[300px]">
              <h3 className="text-black">
                {product.name}
              </h3>
              <p className="text-[rgba(80,80,80,1)] mt-1.5">
                {product.description}
              </p>
            </div>
            
            <div className="flex flex-col text-right justify-center">
              {hasDiscount && (
                <div className="text-black leading-none line-through">
                  {product.originalPrice} EUR
                </div>
              )}
              <div className={`text-black leading-none ${hasDiscount ? 'mt-1.5' : ''}`}>
                {product.price} EUR
              </div>
              <div className="text-[rgba(173,29,24,1)] mt-1.5">
                {product.weight}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-[rgba(226,226,226,1)] flex w-full items-center gap-2.5 text-base text-black font-normal justify-center p-6 border-[rgba(209,209,209,1)] border-t max-md:max-w-full max-md:px-5 hover:bg-[rgba(216,216,216,1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="self-stretch my-auto">
          {isLoading ? 'Adding...' : 'Add to cart'}
        </span>
      </button>
    </article>
  );
};
