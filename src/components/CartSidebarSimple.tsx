import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-96 p-0 flex flex-col h-full">
        <SheetHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart
              {getTotalItems() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getTotalItems()}
                </Badge>
              )}
            </SheetTitle>
          </div>
          <SheetDescription className="text-left">
            Review your selected items
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const imageUrl = item.image?.[0] || item.images?.[0] || 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=150';
                const displayPrice = item.sale_price || item.price;

                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {/* Product Image */}
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=150';
                      }}
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-lg font-semibold text-gray-900">
                        ${displayPrice.toFixed(2)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        Subtotal: ${(displayPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cart.length > 0 && (
          <>
            <Separator />
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                size="lg"
              >
                Checkout ({getTotalItems()} items)
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};