import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { CartSidebar } from '@/components/CartSidebar';
import { toast } from 'sonner';
import ProductImageGallery from '@/components/ProductImageGallery';
import TeaPreparationGuide from '@/components/TeaPreparationGuide';
import { pb } from '@/integrations/supabase/client';

interface DetailProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string[];
  weight?: string;
  category?: string;
  stock?: number;
  created: string;
  updated: string;
  preparation?: {
    amount: string;
    temperature: string;
    steepTime: string;
    taste: string;
  };
}


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItemQuantity, updateQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product from PocketBase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const record = await pb.collection('products').getOne<DetailProduct>(id);
        
        // Parse preparation data if it's a string
        if (record.preparation && typeof record.preparation === 'string') {
          try {
            record.preparation = JSON.parse(record.preparation);
          } catch (parseError) {
            console.warn('Could not parse preparation data:', parseError);
            record.preparation = undefined;
          }
        }
        
        setProduct(record);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Convert DetailProduct to Product format for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight || '',
      images: product.image?.map(img => pb.files.getURL(product, img)) || []
    };
    
    console.log('Adding to cart:', cartProduct);
    addToCart(cartProduct);
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
    // Convert DetailProduct to Product format for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight || '',
      images: product.image?.map(img => pb.files.getURL(product, img)) || []
    };
    
    addToCart(cartProduct);
    toast.success(`${product.name} quantity increased`);
  };

  const handleDecrement = () => {
    const currentQuantity = getItemQuantity(product.id);
    if (currentQuantity > 1) {
      updateQuantity(product.id, currentQuantity - 1);
    } else {
      removeFromCart(product.id);
    }
    toast.success(`${product.name} quantity decreased`);
  };

  // Get product images with proper URLs
  const productImages = product.image?.map(img => 
    pb.files.getURL(product, img)
  ) || [];

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
                {productImages.length > 0 ? (
                  <ProductImageGallery 
                    images={productImages} 
                    productName={product.name}
                    excludeHoverImage={true}
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
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

              {/* Product Details */}
              <div className="flex flex-col gap-4">
                {/* Category */}
                {product.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-black font-medium">Category:</span>
                    <span className="text-[rgba(173,29,24,1)] font-medium capitalize">{product.category}</span>
                  </div>
                )}

                {/* Weight */}
                {product.weight && (
                  <div className="flex items-center justify-between">
                    <span className="text-black font-medium">Weight:</span>
                    <span className="text-[rgba(173,29,24,1)] font-medium">{product.weight}</span>
                  </div>
                )}

                {/* Stock */}
                {product.stock !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-black font-medium">In Stock:</span>
                    <span className={`font-medium ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">Price:</span>
                  <span className="text-xl lg:text-2xl font-medium text-black">
                    €{product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Buy button */}
              <div className="pt-4">
                {product.stock === 0 ? (
                  <div className="w-full bg-gray-200 border border-gray-300 flex items-center justify-center p-4 lg:p-6">
                    <span className="text-base font-normal text-gray-500">
                      Out of Stock
                    </span>
                  </div>
                ) : getItemQuantity(product.id) > 0 ? (
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
                      disabled={product.stock !== undefined && getItemQuantity(product.id) >= product.stock}
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

          {/* Additional Product Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Product Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Product ID:</span> {product.id}</p>
                  <p><span className="font-medium">Added:</span> {new Date(product.created).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(product.updated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
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