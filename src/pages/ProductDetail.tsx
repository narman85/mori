import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { toast } from 'sonner';
import { tursoDb } from '@/integrations/turso/client';
import type { Product } from '@/lib/database';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const tursoProduct = await tursoDb.getProduct(id);
        
        if (tursoProduct) {
          // Format Turso data to match Product interface
          const formattedProduct: Product = {
            id: tursoProduct.id,
            name: tursoProduct.name,
            description: tursoProduct.description || '',
            short_description: tursoProduct.short_description,
            price: tursoProduct.price,
            sale_price: tursoProduct.sale_price,
            stock: tursoProduct.stock,
            image_url: tursoProduct.image_url,
            hover_image_url: tursoProduct.hover_image_url,
            category: tursoProduct.category,
            is_featured: Boolean(tursoProduct.is_featured),
            is_active: Boolean(tursoProduct.is_active),
            display_order: tursoProduct.display_order || 1,
            created_at: tursoProduct.created_at,
            updated_at: tursoProduct.updated_at
          };
          
          setProduct(formattedProduct);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Get all product images (main + additional)
  const getProductImages = () => {
    if (!product) return [];
    
    const images = [];
    
    // Add main image
    if (product.image_url) {
      images.push(product.image_url);
    }
    
    // Add hover image if different from main
    if (product.hover_image_url && product.hover_image_url !== product.image_url) {
      images.push(product.hover_image_url);
    }
    
    // Add additional images if available
    if ((product as any).additional_images) {
      const additionalImages = (product as any).additional_images.split(',').filter((img: string) => img.trim());
      images.push(...additionalImages);
    }
    
    // If no images, add default
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center');
    }
    
    return images;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      short_description: product.short_description,
      price: product.sale_price || product.price,
      sale_price: product.sale_price,
      stock: product.stock,
      image: product.image_url ? [product.image_url] : [],
      hover_image: product.hover_image_url,
      weight: product.category || '30g'
    };
    
    addToCart(cartProduct);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />
        <div className="flex items-center justify-center flex-1 min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />
        <div className="flex items-center justify-center flex-1 min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.sale_price && product.sale_price > 0 && product.sale_price < product.price;

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center">
      <Header />
      
      <main className="w-full bg-gray-100 min-h-screen">
        {/* Back button */}
        <div className="px-6 pt-6 pb-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Product content */}
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Left side - Product images with gallery */}
              <div className="flex flex-col gap-4">
                {/* Main image */}
                <div className="flex justify-center">
                  <img
                    src={getProductImages()[selectedImageIndex] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center'}
                    alt={product.name}
                    className="w-full h-full aspect-square object-cover rounded-lg"
                  />
                </div>
                
                {/* Thumbnail gallery */}
                {getProductImages().length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {getProductImages().map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`border-2 rounded-md overflow-hidden transition-all ${
                          selectedImageIndex === index ? 'border-black' : 'border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-20 h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right side - Product info */}
              <div className="flex flex-col justify-start space-y-6 pt-4">
                {/* Product name */}
                <h1 className="text-2xl font-medium text-black">
                  {product.name}
                </h1>

                {/* About this product */}
                <div className="space-y-3">
                  <h2 className="text-sm font-medium text-black">About this product</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.description || product.short_description}
                  </p>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-black">Weight:</h3>
                  <p className="text-sm text-gray-700">{product.category || '30g'}</p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-black">Price:</h3>
                  <div className="flex items-center gap-3">
                    {hasDiscount && (
                      <span className="text-gray-500 line-through text-sm">
                        {product.price} EUR
                      </span>
                    )}
                    <span className="text-lg font-medium text-black">
                      {hasDiscount ? product.sale_price : product.price} EUR
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-black font-medium py-3 rounded-none"
                  >
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;