import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { CartSidebar } from '@/components/CartSidebar';
import { toast } from 'sonner';
import ProductImageGallery from '@/components/ProductImageGallery';
import TeaPreparationGuide from '@/components/TeaPreparationGuide';

interface DetailProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: string;
  images?: string[];
  preparation?: {
    amount: string;
    temperature: string;
    steepTime: string;
    taste: string;
  };
}

// Sample product data - in a real app this would come from an API/database
const sampleProducts: DetailProduct[] = [
  {
    id: '1',
    name: 'Japanese Matcha Powder',
    description: 'Premium ceremonial grade matcha powder sourced directly from Uji, Japan. This vibrant green powder offers a rich, umami flavor with subtle sweet notes. Perfect for traditional tea ceremonies or modern matcha lattes. Our matcha is stone-ground to preserve its delicate flavor profile and nutritional benefits.',
    price: 24.99,
    originalPrice: 29.99,
    weight: '100g',
    images: [
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1563822249548-64ac0be35aa9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&crop=center'
    ],
    preparation: {
      amount: '2g per 100ml',
      temperature: '70-80°C',
      steepTime: '2-3 minutes',
      taste: 'Rich, umami, sweet'
    }
  },
  {
    id: '2',
    name: 'Organic Earl Grey',
    description: 'A classic blend of Ceylon black tea infused with natural bergamot oil and cornflower petals. This aromatic tea offers a perfect balance of citrus brightness and malty depth. Sourced from certified organic tea gardens, ensuring the highest quality and ethical production standards.',
    price: 18.50,
    weight: '200g',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1597318116841-9a96b5bc8289?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop&crop=center'
    ],
    preparation: {
      amount: '3g per 200ml',
      temperature: '95-100°C',
      steepTime: '3-5 minutes',
      taste: 'Citrusy, malty, floral'
    }
  },
  {
    id: '3',
    name: 'Dragon Well Green Tea',
    description: 'Authentic Longjing green tea from the hills of Hangzhou, China. Known for its flat, sword-shaped leaves and delicate, sweet flavor with a hint of nuttiness. This pan-fired tea offers a smooth, refreshing taste and beautiful jade-colored liquor.',
    price: 22.00,
    weight: '150g',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1564890769747-2f7bb2129cfa?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571194373149-4593ce33e0b0?w=600&h=600&fit=crop&crop=center'
    ],
    preparation: {
      amount: '2-3g per 150ml',
      temperature: '75-85°C',
      steepTime: '2-3 minutes',
      taste: 'Delicate, sweet, nutty'
    }
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const product = sampleProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added`, {
      description: "Click to open cart",
      duration: 3000,
      action: {
        label: "Open cart",
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const handleIncrement = () => {
    addToCart(product);
    toast.success(`${product.name} quantity increased`);
  };

  const handleDecrement = () => {
    removeFromCart(product.id);
    toast.success(`${product.name} quantity decreased`);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center">
      <Header />
      
      <main className="w-full flex flex-col items-center">
        {/* Back button */}
        <div className="w-full max-w-7xl px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 gap-2 text-black hover:bg-[rgba(238,238,238,1)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Product detail content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left side - Product image gallery */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-md lg:max-w-none">
                <ProductImageGallery 
                  images={product.images || []} 
                  productName={product.name}
                />
              </div>
            </div>

            {/* Right side - Product info */}
            <div className="flex flex-col justify-center space-y-6 p-6 lg:p-8">
              {/* Product name */}
              <h1 className="text-2xl lg:text-3xl font-medium text-black leading-tight">
                {product.name}
              </h1>

              {/* Product description */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-black">About this product</h2>
                <p className="text-[rgba(80,80,80,1)] leading-relaxed text-sm lg:text-base">
                  {product.description}
                </p>
              </div>

              {/* Weight and Price */}
              <div className="flex flex-col gap-4">
                {/* Weight */}
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">Weight:</span>
                  <span className="text-[rgba(173,29,24,1)] font-medium">{product.weight}</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">Price:</span>
                  <div className="flex items-center gap-3">
                    {hasDiscount && (
                      <span className="text-black line-through text-sm lg:text-base">
                        {product.originalPrice} EUR
                      </span>
                    )}
                    <span className="text-xl lg:text-2xl font-medium text-black">
                      {product.price} EUR
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy button */}
              <div className="pt-4">
                {getItemQuantity(product.id) > 0 ? (
                  <div className="w-full bg-[rgba(226,226,226,1)] border-[rgba(209,209,209,1)] border flex items-center justify-between p-4 lg:p-6">
                    <button
                      onClick={handleDecrement}
                      className="flex items-center justify-center w-8 h-8 hover:bg-[rgba(216,216,216,1)] rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-base font-normal text-black">
                      In cart ({getItemQuantity(product.id)})
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="flex items-center justify-center w-8 h-8 hover:bg-[rgba(216,216,216,1)] rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="bg-[rgba(226,226,226,1)] w-full flex items-center justify-center gap-2 text-base text-black font-normal p-4 lg:p-6 border-[rgba(209,209,209,1)] border hover:bg-[rgba(216,216,216,1)] transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tea Preparation Guide */}
          {product.preparation && (
            <TeaPreparationGuide 
              preparation={product.preparation} 
              productName={product.name}
            />
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default ProductDetail;