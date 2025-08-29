import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, EyeOff, Eye, Package, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tursoDb } from '@/integrations/turso/client';
import { useToast } from '@/hooks/use-toast';
import SimpleDragCard from '@/components/admin/SimpleDragCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  stock?: number;
  image: string[];
  created: string;
  updated: string;
  display_order?: number;
  order_count?: number;
  total_sold?: number;
  hidden?: boolean;
  preparation?: {
    amount: string;
    temperature: string;
    steepTime: string;
    taste: string;
  };
}

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load static products for demo
  const fetchProducts = async () => {
    setLoading(true);
    
    try {
      const tursoProducts = await tursoDb.getProducts();
      const processedProducts = tursoProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category || 'tea',
        in_stock: product.stock > 0,
        stock: product.stock,
        image: [product.image_url || ''],
        created: product.created_at,
        updated: product.updated_at,
        order_count: Math.floor(Math.random() * 50), // Mock order count
        total_sold: Math.floor(Math.random() * 100), // Mock sales
        hidden: !product.is_active,
        display_order: product.display_order,
        preparation: {
          amount: '1-2 tsp',
          temperature: '80-85°C',
          steepTime: '2-3 min',
          taste: 'Delicate and refreshing'
        }
      }));
      
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const editProduct = (product: Product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  // Move product (drag & drop) - Demo mode
  const moveProduct = async (dragIndex: number, hoverIndex: number) => {
    const draggedProduct = products[dragIndex];
    
    // Update local state for demo
    const updatedProducts = [...products];
    updatedProducts.splice(dragIndex, 1);
    updatedProducts.splice(hoverIndex, 0, draggedProduct);
    setProducts(updatedProducts);

    toast({
      title: "Success",
      description: "Product order updated (demo mode)",
    });
  };

  // Toggle product visibility (hide/show) - Demo mode
  const toggleProductVisibility = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const isHidden = product.hidden || false;
    const action = isHidden ? 'show' : 'hide';
    const confirmMsg = isHidden 
      ? `Show "${product.name}" in store for customers?`
      : `Hide "${product.name}" from store? Customers won't see it.`;
    
    if (!confirm(confirmMsg)) return;
    
    // Update local state for demo
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, hidden: !isHidden } : p
    ));
    
    toast({
      title: "Success",
      description: `Product ${action === 'hide' ? 'hidden from' : 'shown in'} store (demo mode)`,
    });
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600">Add, edit, and manage your products. Drag to reorder.</p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate('/admin/products/new')}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Start by adding your first product to your store. You can add product details, images, and set pricing.
            </p>
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin/products/new')}
            >
              <Plus className="h-4 w-4" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <SimpleDragCard
                key={product.id}
                product={product}
                index={index}
                onEdit={editProduct}
                onToggleVisibility={toggleProductVisibility}
                moveProduct={moveProduct}
              />
            ))}
          </div>
        </div>
      )}

      </div>
    </DndProvider>
  );
};

export default ProductsManagement;