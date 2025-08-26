import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { pb } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin } from 'lucide-react';
import { StripePaymentForm } from '@/components/StripePaymentForm';
import { createStripePaymentIntent } from '@/utils/stripe-api';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const Checkout: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Azerbaijan'
  });

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create payment intent and move to payment step
  const proceedToPayment = async () => {
    try {
      setLoading(true);
      const total = getTotalPrice() + (getTotalPrice() > 50 ? 0 : 5);
      const paymentIntent = await createStripePaymentIntent(total);
      setClientSecret(paymentIntent.client_secret);
      setCurrentStep('payment');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await proceedToPayment();
    }
  };

  const handlePaymentSuccess = async () => {
    if (!user) {
      toast.error('Please log in to place an order');
      return;
    }

    try {
      setLoading(true);

      // Create order in PocketBase with 'paid' status
      const subtotal = getTotalPrice();
      const shipping = subtotal > 50 ? 0 : 5;
      const total = subtotal + shipping;

      const orderData = {
        user: user.id,
        total_price: total,
        status: 'paid', // Mark as paid since payment succeeded
        shipping_address: shippingInfo
      };

      const order = await pb.collection('orders').create(orderData);

      // Create order items
      const orderItemPromises = cart.map(item => 
        pb.collection('order_items').create({
          order: order.id,
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })
      );

      await Promise.all(orderItemPromises);

      // Update stock quantities for each product
      const stockUpdatePromises = cart.map(async (item) => {
        try {
          // Get current product data to get current stock
          const currentProduct = await pb.collection('products').getOne(item.id);
          const newStock = Math.max(0, (currentProduct.stock || 0) - item.quantity);
          
          // Update product stock (but keep product active)
          await pb.collection('products').update(item.id, {
            stock: newStock
            // Don't change in_stock - keep product visible even if stock is 0
          });
          
          console.log(`Updated ${item.name} stock: ${currentProduct.stock || 0} -> ${newStock}`);
        } catch (error) {
          console.error(`Failed to update stock for ${item.name}:`, error);
        }
      });

      await Promise.all(stockUpdatePromises);

      // Clear cart and redirect
      clearCart();
      toast.success('Order placed and payment processed successfully!');
      navigate('/order-confirmation', { state: { orderId: order.id } });

    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to create order after payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5; // Free shipping over 50 EUR
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center ${currentStep === 'shipping' ? 'text-blue-600' : 'text-green-600'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  currentStep === 'shipping' 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-green-600 bg-green-600 text-white'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Shipping</span>
              </div>
              <div className={`w-16 h-0.5 ${currentStep === 'payment' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  currentStep === 'payment'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-gray-100'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>

            {/* Shipping Information Form */}
            {currentStep === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      {loading ? 'Processing...' : 'Continue to Payment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            )}

            {/* Payment Form */}
            {currentStep === 'payment' && clientSecret && (
              <>
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('shipping')}
                    className="mb-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shipping
                  </Button>
                </div>
                
                <StripePaymentForm
                  clientSecret={clientSecret}
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × {item.price} EUR
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {(item.price * item.quantity).toFixed(2)} EUR
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? 'Free' : `${shipping.toFixed(2)} EUR`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} EUR</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-xs">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}

                {/* Payment Information */}
                {currentStep === 'shipping' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      💳 After shipping information, you'll complete your payment securely with Stripe.
                    </p>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      🔒 Your payment information is secure and encrypted by Stripe.
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};