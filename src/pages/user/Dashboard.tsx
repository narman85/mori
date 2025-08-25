import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pb } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Package, 
  CreditCard, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Truck,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderStats {
  total: number;
  pending: number;
  delivered: number;
  totalSpent: number;
}

interface RecentOrder {
  id: string;
  total_price: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created: string;
  expand?: {
    'order_items(order)': Array<{
      quantity: number;
    }>;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    delivered: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch all orders for statistics
      const allOrders = await pb.collection('orders').getFullList<RecentOrder>({
        filter: `user = "${user.id}"`,
        expand: 'order_items(order)'
      });

      // Calculate statistics
      const stats = allOrders.reduce((acc, order) => {
        acc.total += 1;
        acc.totalSpent += order.total_price;
        
        if (order.status === 'pending' || order.status === 'paid' || order.status === 'processing') {
          acc.pending += 1;
        }
        if (order.status === 'delivered') {
          acc.delivered += 1;
        }
        
        return acc;
      }, { total: 0, pending: 0, delivered: 0, totalSpent: 0 });

      setOrderStats(stats);

      // Get recent orders (last 3)
      const recent = await pb.collection('orders').getList<RecentOrder>(1, 3, {
        filter: `user = "${user.id}"`,
        sort: '-created',
        expand: 'order_items(order)'
      });

      setRecentOrders(recent.items);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const getStatusConfig = (status: RecentOrder['status']) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'shipped':
        return { color: 'bg-purple-100 text-purple-800', icon: Truck };
      default:
        return { color: 'bg-blue-100 text-blue-800', icon: Package };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your account activity</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.delivered}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{orderStats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </div>
            <Link to="/account/orders">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
              <Button className="mt-4" onClick={() => window.location.href = '/'}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const itemCount = order.expand?.['order_items(order)']?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                return (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {itemCount} item{itemCount !== 1 ? 's' : ''} • {new Date(order.created).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <div className="text-sm font-medium">
                        €{order.total_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/account/orders" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Package className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
            </Link>
            <Link to="/account/settings" className="block">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/'}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;