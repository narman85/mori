import React, { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
  quantity?: number;
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
    <article className={`flex flex-col bg-white ${className}`}>
      <div className="w-full">
        <div className="w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[1.06] object-contain w-full"
          />
        </div>
        
        <div className="bg-[rgba(238,238,238,1)] flex w-full gap-4 text-base font-normal justify-between p-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-black">
              {product.name}
            </h3>
            <p className="text-[rgba(80,80,80,1)] mt-1.5">
              {product.description}
            </p>
          </div>
          
          <div className="flex flex-col text-right justify-center flex-shrink-0">
            {hasDiscount && (
              <div className="text-black leading-none line-through whitespace-nowrap">
                {product.originalPrice} EUR
              </div>
            )}
            <div className={`text-black leading-none whitespace-nowrap ${hasDiscount ? 'mt-1.5' : ''}`}>
              {product.price} EUR
            </div>
            <div className="text-[rgba(173,29,24,1)] mt-1.5">
              {product.weight}
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-[rgba(226,226,226,1)] flex w-full items-center gap-2.5 text-base text-black font-normal justify-center p-6 border-[rgba(209,209,209,1)] border-t hover:bg-[rgba(216,216,216,1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
      >
        <span className="self-stretch my-auto">
          {isLoading ? 'Adding...' : 'Add to cart'}
        </span>
      </button>
    </article>
  );
};
