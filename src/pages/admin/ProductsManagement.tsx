import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, GripVertical } from 'lucide-react';
import { pb } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
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
  image: string[];
  created: string;
  updated: string;
  display_order?: number;
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Fetch products from PocketBase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('products').getFullList<Product>({
        sort: '-display_order,-created',
      });
      setProducts(records);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Move product (drag & drop)
  const moveProduct = async (dragIndex: number, hoverIndex: number) => {
    const draggedProduct = products[dragIndex];
    
    // Update local state immediately for smooth UX
    const updatedProducts = [...products];
    updatedProducts.splice(dragIndex, 1);
    updatedProducts.splice(hoverIndex, 0, draggedProduct);
    setProducts(updatedProducts);

    // Update database immediately
    try {
      // Update all products with their new display_order based on current array position
      const updatePromises = updatedProducts.map((product, index) => 
        pb.collection('products').update(product.id, {
          display_order: updatedProducts.length - index  // Higher number = first position
        })
      );
      
      await Promise.all(updatePromises);
      
    } catch (error) {
      console.error('Error updating product order:', error);
      toast({
        title: "Error", 
        description: "Failed to update product order",
        variant: "destructive",
      });
      // Revert local changes on error
      await fetchProducts();
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await pb.collection('products').delete(productId);
      await fetchProducts(); // Refresh list
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
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
            onClick={() => setShowAddModal(true)}
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
              onClick={() => setShowAddModal(true)}
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
                onDelete={deleteProduct}
                moveProduct={moveProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onProductAdded={fetchProducts}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onProductUpdated={fetchProducts}
        product={selectedProduct}
      />
      </div>
    </DndProvider>
  );
};

export default ProductsManagement;