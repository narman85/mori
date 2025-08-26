import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { pb } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  user?: string;
  total_price: number;
  status: string;
  created: string;
  shipping_address?: any;
  expand?: {
    user?: {
      name?: string;
      email?: string;
    };
    'order_items(order)'?: any[];
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products count and stock info
      const products = await pb.collection('products').getFullList({
        fields: 'id,stock'
        // Show all products, even those with 0 stock
      });

      // Fetch orders data with expanded user info and order items
      const orders = await pb.collection('orders').getFullList<RecentOrder>({
        sort: '-created',
        expand: 'user,order_items(order)'
      });
      
      console.log('Orders data:', orders);
      if (orders.length > 0) {
        console.log('First order structure:', orders[0]);
        console.log('Order keys:', Object.keys(orders[0]));
      }

      // Fetch users count
      const users = await pb.collection('users').getFullList({
        fields: 'id'
      });

      // Calculate total revenue using total_price field
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.total_price || 0);
      }, 0);

      // Get recent orders (last 10)
      const recentOrdersList = orders.slice(0, 10);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue
      });

      setRecentOrders(recentOrdersList);
      
      // Get low stock products (stock <= 5 and stock > 0)
      const lowStockProducts = products.filter(p => 
        p.stock !== undefined && p.stock > 0 && p.stock <= 5
      );
      
      console.log('Low stock products:', lowStockProducts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your e-commerce store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products in store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No orders yet</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDate(order.created)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.expand?.user?.email || order.expand?.user?.name || 'Guest User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.expand?.['order_items(order)']?.length || 0} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(order.total_price || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              No products with low stock
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;