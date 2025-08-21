import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

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
  onCartOpen?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onCartOpen,
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      addToCart(product);
      toast.success(`${product.name} əlavə edildi`, {
        description: "Səbəti açmaq üçün düyməyə basın",
        duration: 3000,
        action: {
          label: "Səbəti aç",
          onClick: () => onCartOpen?.()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  
  // Çay şəkillər - məhsul tipinə görə
  const getTeaImage = (productName: string) => {
    if (productName.toLowerCase().includes('matcha')) {
      return 'https://api.builder.io/api/v1/image/assets/TEMP/matcha-tea-prepared?placeholderIfAbsent=true';
    }
    if (productName.toLowerCase().includes('hōji') || productName.toLowerCase().includes('hojicha')) {
      return 'https://api.builder.io/api/v1/image/assets/TEMP/hojicha-tea-prepared?placeholderIfAbsent=true';
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/green-tea-prepared?placeholderIfAbsent=true';
  };

  return (
    <article 
      className={`flex flex-col h-full bg-white shadow-sm hover:shadow-lg transition-all duration-300 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="w-full flex-shrink-0 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`aspect-[1.06] object-cover w-full transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Tea Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="bg-white rounded-lg p-4 transform transition-all duration-300 scale-90 group-hover:scale-100">
            <img
              src={getTeaImage(product.name)}
              alt={`${product.name} hazır çay`}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <p className="text-xs text-center mt-2 font-medium text-gray-700">Hazır çay görünüşü</p>
          </div>
        </div>
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
