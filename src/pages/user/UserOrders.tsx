import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';


const UserOrders = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Welcome, {user?.firstName || 'User'}!</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[rgba(226,226,226,1)] flex items-center justify-center gap-2 text-base text-black font-normal px-6 py-3 border-[rgba(209,209,209,1)] border hover:bg-[rgba(216,216,216,1)] transition-colors"
          >
            Start Shopping
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOrders;