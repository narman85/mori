import React, { useState, useEffect } from 'react';
import { pb } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  Mail, 
  Calendar,
  Search,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  ShoppingCart,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
  verified: boolean;
  emailVisibility: boolean;
  collectionId: string;
  collectionName: string;
}

interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  recentUsers: number;
}

interface Order {
  id: string;
  user: string;
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
}

interface UserWithOrders extends User {
  orders?: Order[];
  totalOrders?: number;
  totalSpent?: number;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithOrders[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    recentUsers: 0
  });
  const [selectedUser, setSelectedUser] = useState<UserWithOrders | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching users...');
      
      const records = await pb.collection('users').getFullList<User>({
        sort: '-created'
      });
      
      console.log('✅ Users fetched:', records.length);

      // Fetch orders for each user to get order count and total spent
      console.log('🔄 Fetching orders for each user...');
      const usersWithOrders = await Promise.all(
        records.map(async (user) => {
          try {
            const orders = await pb.collection('orders').getFullList<Order>({
              filter: `user = "${user.id}"`,
              sort: '-created'
            });
            
            const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0);
            
            console.log(`📊 User ${user.username}: ${orders.length} orders, €${totalSpent.toFixed(2)}`);
            
            return {
              ...user,
              orders,
              totalOrders: orders.length,
              totalSpent
            };
          } catch (error) {
            console.error(`❌ Error fetching orders for user ${user.id}:`, error);
            return {
              ...user,
              orders: [],
              totalOrders: 0,
              totalSpent: 0
            };
          }
        })
      );

      setUsers(usersWithOrders);
      
      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const stats = {
        totalUsers: records.length,
        verifiedUsers: records.filter(user => user.verified).length,
        recentUsers: records.filter(user => new Date(user.created) > oneWeekAgo).length
      };
      
      setStats(stats);
      console.log('✅ Users management loaded successfully');
      
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast.error('Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await pb.collection('users').delete(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
      setShowUserDetails(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleViewUser = (user: UserWithOrders) => {
    setSelectedUser(user);
    setUserOrders(user.orders || []);
    setShowUserDetails(true);
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: ShoppingCart };
      case 'paid':
        return { color: 'bg-emerald-100 text-emerald-800', icon: UserCheck };
      case 'processing':
        return { color: 'bg-blue-100 text-blue-800', icon: Package };
      case 'shipped':
        return { color: 'bg-indigo-100 text-indigo-800', icon: Package };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: UserCheck };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: UserX };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Package };
    }
  };

  const handleViewOrderDetails = async (order: Order) => {
    try {
      // Fetch order with detailed order items and product information
      const detailedOrder = await pb.collection('orders').getOne(order.id, {
        expand: 'order_items_via_order.product'
      });
      
      setSelectedOrder(detailedOrder);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Failed to load order details: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage registered users and view their information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentUsers}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by username, email, or name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600">
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(user.name || user.username || user.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || user.username || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verified ? (
                          <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <ShoppingCart className="h-4 w-4 text-gray-400 mr-1" />
                        {user.totalOrders || 0} orders
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">
                        €{(user.totalSpent || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">User Details & Orders</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserDetails(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">User Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-sm text-gray-900">{selectedUser.username}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                
                {selectedUser.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className={`text-sm ${selectedUser.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedUser.verified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Orders</label>
                  <p className="text-sm text-gray-900">{selectedUser.totalOrders || 0}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                  <p className="text-sm text-gray-900 font-medium">€{(selectedUser.totalSpent || 0).toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.created)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.updated)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-xs text-gray-500 font-mono break-all">{selectedUser.id}</p>
                </div>
              </div>

              {/* Orders & Shipping Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">Orders & Shipping Info</h4>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userOrders.map((order, index) => (
                      <div 
                        key={order.id} 
                        className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-sm">Order #{index + 1}</p>
                            <p className="text-xs text-gray-500">ID: {order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.created)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{order.total_price.toFixed(2)}</p>
                            {(() => {
                              const statusConfig = getStatusConfig(order.status);
                              const StatusIcon = statusConfig.icon;
                              return (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                        
                        {/* Shipping Address */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="font-medium text-sm mb-2">Shipping Address:</p>
                          <div className="text-xs space-y-1 text-gray-700">
                            <p><span className="font-medium">Name:</span> {order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                            <p><span className="font-medium">Email:</span> {order.shipping_address?.email}</p>
                            <p><span className="font-medium">Phone:</span> {order.shipping_address?.phone}</p>
                            <p><span className="font-medium">Address:</span> {order.shipping_address?.address}</p>
                            <p><span className="font-medium">City:</span> {order.shipping_address?.city}, {order.shipping_address?.postalCode}</p>
                            <p><span className="font-medium">Country:</span> {order.shipping_address?.country}</p>
                          </div>
                        </div>
                        
                        {/* Click indicator */}
                        <div className="mt-2 text-center">
                          <p className="text-xs text-blue-600 opacity-75">Click to view order details</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowUserDetails(false)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="text-red-600 hover:text-red-900 border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Order Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrderDetails(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">Order Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-sm text-gray-900 font-mono">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-900">{selectedOrder.expand?.user?.email || selectedOrder.shipping_address?.email || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const statusConfig = getStatusConfig(selectedOrder.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-lg font-bold text-green-600">€{selectedOrder.total_price.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedOrder.created)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedOrder.updated)}</p>
                </div>

                {/* Shipping Address */}
                <div className="mt-6">
                  <h4 className="font-medium text-lg border-b pb-2 mb-4">Shipping Address</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-medium">{selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shipping_address?.address}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.postalCode}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shipping_address?.country}</p>
                    <div className="pt-2 border-t mt-3">
                      <p className="text-sm text-gray-600">📧 {selectedOrder.shipping_address?.email}</p>
                      <p className="text-sm text-gray-600">📞 {selectedOrder.shipping_address?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">Order Items</h4>
                
                {selectedOrder.expand?.order_items_via_order ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedOrder.expand.order_items_via_order.map((item: any, index: number) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.expand?.product?.name || `Product ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.expand?.product?.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span>Quantity: {item.quantity}</span>
                              <span>Unit Price: €{item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        {/* Product Image */}
                        {item.expand?.product?.image && (
                          <div className="mt-3 flex justify-center">
                            <img
                              src={pb.files.getURL(item.expand.product, item.expand.product.image[0])}
                              alt={item.expand?.product?.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">No order items found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowOrderDetails(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;