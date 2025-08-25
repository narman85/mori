import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: string;
  images?: string[];
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
  const { addToCart, updateQuantity, cart } = useCart();
  const navigate = useNavigate();

  // Get current quantity in cart
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      addToCart(product);
      toast.success(`${product.name} added`, {
        description: "Click to open cart",
        duration: 3000,
        action: {
          label: "Open cart",
          onClick: () => onCartOpen?.()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  
  // Tea images - by product type
  const getTeaImage = (productName: string) => {
    if (productName.toLowerCase().includes('matcha')) {
      return 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=200&h=200&fit=crop&crop=center';
    }
    if (productName.toLowerCase().includes('hōji') || productName.toLowerCase().includes('hojicha')) {
      return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&crop=center';
    }
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center';
  };

  return (
    <article 
      className={`flex flex-col h-full bg-white shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="w-full flex-shrink-0 relative overflow-hidden">
        {/* Original image */}
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center'}
          alt={product.name}
          className={`aspect-[1.06] object-cover w-full transition-opacity duration-[1500ms] ease-in-out ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Hover image - overlay - use last image as hover if available */}
        <img
          src={
            product.images && product.images.length > 1 
              ? product.images[product.images.length - 1]  // Last image as hover
              : getTeaImage(product.name)
          }
          alt={`${product.name} hover view`}
          className={`absolute inset-0 aspect-[1.06] object-cover w-full transition-opacity duration-[1500ms] ease-in-out ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
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
      {quantity === 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={isLoading}
          className="bg-[rgba(226,226,226,1)] flex w-full items-center justify-center gap-2 text-base text-black font-normal p-4 sm:p-6 border-[rgba(209,209,209,1)] border-t hover:bg-[rgba(216,216,216,1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <span>
            {isLoading ? 'Adding...' : 'Add to cart'}
          </span>
        </button>
      ) : (
        <div className="bg-[rgba(226,226,226,1)] flex w-full items-center justify-between gap-2 text-base text-black font-normal p-4 sm:p-6 border-[rgba(209,209,209,1)] border-t flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(product.id, quantity - 1);
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-[rgba(216,216,216,1)] rounded-full transition-colors"
          >
            -
          </button>
          <span className="flex-1 text-center">
            In cart ({quantity})
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(product.id, quantity + 1);
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-[rgba(216,216,216,1)] rounded-full transition-colors"
          >
            +
          </button>
        </div>
      )}
    </article>
  );
};
