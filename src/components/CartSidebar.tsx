import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-xl font-medium">Cart</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {cart.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {cart.length === 0 ? (
            // Empty Cart
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cart is empty</h3>
              <p className="text-gray-500">Browse the store to add products</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.weight}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="text-right">
                        <div className="font-medium">
                          {(item.price * item.quantity).toFixed(2)} EUR
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.price} EUR / each
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t bg-white p-6 space-y-4 flex-shrink-0">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear cart
                </button>
                
                {/* Total */}
                <div className="flex justify-between items-center text-lg font-medium">
                  <span>Total:</span>
                  <span>{getTotalPrice().toFixed(2)} EUR</span>
                </div>
                
                {/* Checkout Button */}
                <Button className="w-full bg-black hover:bg-gray-800 text-white py-3">
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};