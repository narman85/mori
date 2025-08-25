import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { pb } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import DraggableImageGrid from './DraggableImageGrid';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  featured: boolean;
  image?: string[];
  preparation?: {
    amount: string;
    temperature: string;
    steepTime: string;
    taste: string;
  };
}

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductUpdated: () => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  open, 
  onOpenChange, 
  onProductUpdated, 
  product 
}) => {
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [mainImages, setMainImages] = useState<File[]>([]);
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    in_stock: true,
    preparation: {
      amount: '',
      temperature: '',
      steepTime: '',
      taste: ''
    }
  });

  const categories = [
    'Black Tea',
    'Green Tea',
    'White Tea',
    'Oolong Tea',
    'Herbal Tea',
    'Fruit Tea',
    'Tea Accessories',
    'Gift Sets',
    'Other'
  ];

  // Load product data when modal opens
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        in_stock: product.in_stock ?? true,
        preparation: product.preparation || {
          amount: '',
          temperature: '',
          steepTime: '',
          taste: ''
        }
      });
      
      // Set existing images
      if (product.image && product.image.length > 0) {
        const imageUrls = product.image.map(img => pb.files.getURL(product, img));
        setExistingImages(imageUrls);
      } else {
        setExistingImages([]);
      }
      
      setMainImages([]);
      setHoverImage(null);
    }
  }, [product, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreparationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      preparation: {
        ...prev.preparation,
        [field]: value
      }
    }));
  };

  const handleMainImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      files.forEach(file => {
        if (file.size > maxSize) {
          invalidFiles.push(`${file.name} (${Math.round(file.size / 1024 / 1024 * 100) / 100}MB)`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        toast({
          title: "File Size Warning",
          description: `Some files are too large (max 10MB): ${invalidFiles.join(', ')}`,
          variant: "destructive",
        });
      }

      if (validFiles.length > 0) {
        setMainImages(prev => {
          const combined = [...prev, ...validFiles];
          const totalWithExisting = existingImages.length + combined.length + (hoverImage ? 1 : 0);
          
          if (totalWithExisting > 5) {
            const maxAllowed = 5 - existingImages.length - (hoverImage ? 1 : 0);
            toast({
              title: "Too Many Images",
              description: `Maximum 5 total images allowed. You can add ${maxAllowed} more main images.`,
              variant: "destructive",
            });
            return combined.slice(0, Math.max(0, maxAllowed));
          }
          return combined;
        });
      }
    }
  };

  const handleHoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        toast({
          title: "File Size Warning",
          description: `File is too large (max 10MB): ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`,
          variant: "destructive",
        });
        return;
      }

      // Check if adding hover image would exceed limit
      const totalWithHover = existingImages.length + mainImages.length + 1;
      if (totalWithHover > 5) {
        toast({
          title: "Too Many Images",
          description: `Maximum 5 total images allowed. Cannot add hover image.`,
          variant: "destructive",
        });
        return;
      }
      
      setHoverImage(file);
    }
  };


  const removeMainImage = (index: number) => {
    setMainImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeHoverImage = () => {
    setHoverImage(null);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      in_stock: true,
      preparation: {
        amount: '',
        temperature: '',
        steepTime: '',
        taste: ''
      }
    });
    setMainImages([]);
    setHoverImage(null);
    setExistingImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Name and price are required",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const hasPreparationData = Object.values(formData.preparation).some(value => value.trim() !== '');

      // Combine main images and hover image
      const allNewImages = [...mainImages];
      if (hoverImage) {
        allNewImages.push(hoverImage);
      }

      // Check if images have been modified (either existing images removed or new images added)
      const originalImageCount = product.image?.length || 0;
      const currentExistingCount = existingImages.length;
      const newImageCount = allNewImages.length;
      const imagesHaveChanged = (currentExistingCount !== originalImageCount) || (newImageCount > 0);
      
      // When images change, we need to determine the final strategy:
      // - If user added new images: REPLACE ALL with only new images (ignore existing)
      // - If user only removed existing: CLEAR all images
      const willReplaceWithNewImages = newImageCount > 0;
      const finalImageCount = willReplaceWithNewImages ? newImageCount : 0;

      console.log('Edit Product - Image Analysis:', {
        name: formData.name,
        price: formData.price,
        originalImageCount,
        currentExistingCount,
        newImageCount,
        imagesHaveChanged,
        willReplaceWithNewImages,
        finalImageCount,
        hasPreparationData,
        preparationData: formData.preparation,
        productId: product.id
      });

      // Start with minimal required fields only
      const productData: any = {
        name: formData.name,
        price: priceValue,
        in_stock: formData.in_stock,
      };

      // Add optional fields only if they have values
      if (formData.description) {
        productData.description = formData.description;
      }
      
      if (formData.category) {
        productData.category = formData.category;
      }

      if (product.display_order) {
        productData.display_order = product.display_order;
      }

      // Add preparation data only if it has content
      if (hasPreparationData) {
        productData.preparation = formData.preparation;
      }

      console.log('Updating product with data:', productData);

      // If images have been modified, we need to handle image replacement
      if (imagesHaveChanged) {
        console.log(`Images changed - Strategy: ${willReplaceWithNewImages ? 'Replace with new' : 'Clear all'}, final count: ${finalImageCount}`);
        
        if (finalImageCount > 5) {
          toast({
            title: "Too Many Images",
            description: `Maximum 5 images allowed. You're uploading ${finalImageCount} images.`,
            variant: "destructive",
          });
          return;
        }

        if (newImageCount === 0) {
          // User removed all existing images but didn't add new ones - clear images
          console.log('Clearing all images...');
          const updateData = { ...productData, image: [] };
          await pb.collection('products').update(product.id, updateData);
        } else {
          // User added new images - replace all images with new ones only
          // Note: This replaces ALL existing images with only the NEW uploaded images
          const data = new FormData();
          
          // Add all text fields to FormData
          data.append('name', formData.name);
          data.append('description', formData.description || '');
          data.append('price', priceValue.toString());
          data.append('category', formData.category || '');
          data.append('in_stock', formData.in_stock.toString());
          data.append('display_order', (product.display_order || 0).toString());
          
          // Add preparation data as JSON string if any field is filled
          if (hasPreparationData) {
            data.append('preparation', JSON.stringify(formData.preparation));
          } else {
            data.append('preparation', '');
          }
          
          // Add only the new images - this will replace all existing images
          console.log('Adding new images to FormData:', allNewImages.map(f => f.name));
          allNewImages.forEach((file, index) => {
            console.log(`Appending image ${index + 1}:`, file.name, `Size: ${file.size} bytes`);
            data.append('image', file);
          });

          console.log('FormData contents before sending:');
          for (let pair of data.entries()) {
            if (pair[0] === 'image') {
              console.log(`- ${pair[0]}: File(${(pair[1] as File).name})`);
            } else {
              console.log(`- ${pair[0]}: ${pair[1]}`);
            }
          }

          console.log('Replacing all images with new uploads...');
          await pb.collection('products').update(product.id, data);
        }
      } else {
        // No new images - just update text fields
        await pb.collection('products').update(product.id, productData);
      }

      toast({
        title: "Success!",
        description: "Product updated successfully",
      });

      resetForm();
      onOpenChange(false);
      onProductUpdated();

    } catch (error: any) {
      console.error('Edit Product Error:', error);
      console.error('Error details:', {
        status: error.status,
        response: error.response,
        data: error.response?.data,
        message: error.message,
        url: error.url
      });
      
      // Log the exact data that caused the error
      if (error.response?.data) {
        console.error('PocketBase error data:', JSON.stringify(error.response.data, null, 2));
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Current Images</Label>
                <p className="text-sm text-gray-500 mt-1">Existing product images</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Current ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                      Current {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Main Images */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Add New Main Images</Label>
              <p className="text-sm text-gray-500 mt-1">Upload up to 4 new main product images (10MB each)</p>
              {existingImages.length > 0 && (
                <p className="text-sm text-amber-600 mt-1 font-medium">
                  ⚠️ Adding new images will replace ALL existing images
                </p>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <Label htmlFor="main-images" className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Click to upload new main images
                  </span>
                  <span className="text-sm text-gray-500 block">or drag and drop</span>
                </Label>
                <Input
                  id="main-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMainImagesUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB each</p>
              </div>
            </div>

            {mainImages.length > 0 && (
              <DraggableImageGrid
                images={mainImages}
                onReorder={setMainImages}
                onRemove={removeMainImage}
                labelPrefix="New Main"
                labelColor="bg-green-500"
              />
            )}
          </div>

          {/* New Hover Image */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Add New Hover Image (Optional)</Label>
              <p className="text-sm text-gray-500 mt-1">New image to show when hovering over product card</p>
              {existingImages.length > 0 && (
                <p className="text-sm text-amber-600 mt-1 font-medium">
                  ⚠️ Adding new images will replace ALL existing images
                </p>
              )}
            </div>
            
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
              <div className="space-y-2">
                {hoverImage ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(hoverImage)}
                      alt="New hover preview"
                      className="w-24 h-24 object-cover rounded-lg border mx-auto"
                    />
                    <button
                      type="button"
                      onClick={removeHoverImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                      New Hover
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto bg-orange-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-orange-500" />
                    </div>
                    <Label htmlFor="hover-image" className="cursor-pointer">
                      <span className="text-sm font-medium text-orange-600 hover:text-orange-500">
                        Click to upload new hover image
                      </span>
                    </Label>
                  </>
                )}
                <Input
                  id="hover-image"
                  type="file"
                  accept="image/*"
                  onChange={handleHoverImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Tea Preparation Guide (Optional) */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-base font-medium">Tea Preparation Guide (Optional)</Label>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Update preparation instructions for tea products
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prep-amount">Amount</Label>
                <Input
                  id="prep-amount"
                  value={formData.preparation.amount}
                  onChange={(e) => handlePreparationChange('amount', e.target.value)}
                  placeholder="1 tsp per cup"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prep-temperature">Temperature</Label>
                <Input
                  id="prep-temperature"
                  value={formData.preparation.temperature}
                  onChange={(e) => handlePreparationChange('temperature', e.target.value)}
                  placeholder="80-85°C"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prep-steeptime">Steep Time</Label>
                <Input
                  id="prep-steeptime"
                  value={formData.preparation.steepTime}
                  onChange={(e) => handlePreparationChange('steepTime', e.target.value)}
                  placeholder="2-3 minutes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prep-taste">Taste Profile</Label>
                <Input
                  id="prep-taste"
                  value={formData.preparation.taste}
                  onChange={(e) => handlePreparationChange('taste', e.target.value)}
                  placeholder="Light & floral"
                />
              </div>
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="in_stock">In Stock</Label>
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;