import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pb } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Package, Eye, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: string;
  total_price: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  created: string;
  updated: string;
  expand?: {
    'order_items(order)': Array<{
      id: string;
      quantity: number;
      price: number;
      expand?: {
        product: {
          id: string;
          name: string;
          image: string[];
        };
      };
    }>;
  };
}

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Status colors and icons
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'paid':
        return { color: 'bg-emerald-100 text-emerald-800', icon: CreditCard };
      case 'processing':
        return { color: 'bg-blue-100 text-blue-800', icon: Package };
      case 'shipped':
        return { color: 'bg-purple-100 text-purple-800', icon: Truck };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Package };
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const records = await pb.collection('orders').getFullList<Order>({
        filter: `user = "${user.id}"`,
        sort: '-created',
        expand: 'order_items(order).product'
      });
      setOrders(records);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Orders: <span className="font-medium">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const orderItems = order.expand?.['order_items(order)'] || [];

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        €{order.total_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    {orderItems.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Items:</h4>
                        <div className="space-y-2">
                          {orderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                              {item.expand?.product && (
                                <>
                                  <img
                                    src={item.expand.product.image?.[0] 
                                      ? pb.files.getURL(item.expand.product, item.expand.product.image[0])
                                      : 'https://via.placeholder.com/60x60?text=No+Image'
                                    }
                                    alt={item.expand.product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.expand.product.name}</p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity} × €{item.price.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="text-sm font-medium">
                                    €{(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shipping Address */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address:</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;