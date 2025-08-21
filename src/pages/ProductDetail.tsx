import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { toast } from 'sonner';

// Sample product data - in a real app this would come from an API/database
const sampleProducts = [
  {
    id: '1',
    name: 'Japanese Matcha Powder',
    description: 'Premium ceremonial grade matcha powder sourced directly from Uji, Japan. This vibrant green powder offers a rich, umami flavor with subtle sweet notes. Perfect for traditional tea ceremonies or modern matcha lattes. Our matcha is stone-ground to preserve its delicate flavor profile and nutritional benefits.',
    price: 24.99,
    originalPrice: 29.99,
    weight: '100g',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop&crop=center',
  },
  {
    id: '2',
    name: 'Organic Earl Grey',
    description: 'A classic blend of Ceylon black tea infused with natural bergamot oil and cornflower petals. This aromatic tea offers a perfect balance of citrus brightness and malty depth. Sourced from certified organic tea gardens, ensuring the highest quality and ethical production standards.',
    price: 18.50,
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
  },
  {
    id: '3',
    name: 'Dragon Well Green Tea',
    description: 'Authentic Longjing green tea from the hills of Hangzhou, China. Known for its flat, sword-shaped leaves and delicate, sweet flavor with a hint of nuttiness. This pan-fired tea offers a smooth, refreshing taste and beautiful jade-colored liquor.',
    price: 22.00,
    weight: '150g',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
    toast.success(`${product.name} added to cart`);
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
            {/* Left side - Product image */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-md lg:max-w-none">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto aspect-square object-cover shadow-sm"
                />
              </div>
            </div>

            {/* Right side - Product info */}
            <div className="flex flex-col justify-center space-y-6 bg-[rgba(238,238,238,1)] p-6 lg:p-8">
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
                <button
                  onClick={handleAddToCart}
                  className="bg-[rgba(226,226,226,1)] w-full flex items-center justify-center gap-2 text-base text-black font-normal p-4 lg:p-6 border-[rgba(209,209,209,1)] border hover:bg-[rgba(216,216,216,1)] transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;