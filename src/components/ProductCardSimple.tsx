import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  stock: number;
  weight?: string;
  images?: string[];
  image?: string[];
  hover_image?: string;
  originalPrice?: number;
}

interface ProductCardProps {
  product: Product;
  onCartOpen?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCartOpen }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    onCartOpen?.();
  };

  const displayPrice = product.sale_price || product.price;
  const hasDiscount = Boolean(product.sale_price && product.sale_price < product.price);

  // Use first image from array or default placeholder
  const imageUrl = product.image?.[0] || product.images?.[0] || 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500';

  return (
    <Card className="group relative h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500';
            }}
          />
          
          {/* Stock Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">
              {product.name}
            </h3>
            
            {product.short_description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {product.short_description}
              </p>
            )}
            
            {product.weight && (
              <p className="text-xs text-gray-500">{product.weight}</p>
            )}
          </div>

          {/* Price and Add to Cart */}
          <div className="space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};