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
    <article className={`flex flex-col h-full bg-white shadow-sm ${className}`}>
      {/* Product Image */}
      <div className="w-full flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[1.06] object-cover w-full"
        />
      </div>
      
      {/* Product Info - takes remaining space */}
      <div className="bg-[rgba(238,238,238,1)] flex flex-col justify-between p-4 sm:p-6 flex-grow">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-black font-medium text-base leading-tight">
              {product.name}
            </h3>
            <p className="text-[rgba(80,80,80,1)] mt-2 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>
          
          {/* Price Info */}
          <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end text-right flex-shrink-0 gap-2 sm:gap-1">
            {hasDiscount && (
              <div className="text-black leading-none line-through whitespace-nowrap text-sm sm:text-base">
                {product.originalPrice} EUR
              </div>
            )}
            <div className={`text-black leading-none whitespace-nowrap font-medium text-base sm:text-lg ${hasDiscount ? 'sm:mt-1' : ''}`}>
              {product.price} EUR
            </div>
            <div className="text-[rgba(173,29,24,1)] text-sm whitespace-nowrap">
              {product.weight}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Button - always at bottom */}
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-[rgba(226,226,226,1)] flex w-full items-center justify-center gap-2 text-base text-black font-normal p-4 sm:p-6 border-[rgba(209,209,209,1)] border-t hover:bg-[rgba(216,216,216,1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        <span>
          {isLoading ? 'Adding...' : 'Add to cart'}
        </span>
      </button>
    </article>
  );
};
