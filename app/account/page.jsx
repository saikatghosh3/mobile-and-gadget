'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { Package, MapPin, ShoppingBag, Clock, ArrowRight } from 'lucide-react';

export default function AccountDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, recentOrders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          totalOrders: data.data.length,
          recentOrders: data.data.slice(0, 3),
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Welcome, {user?.fullName}!</h1>
        <p className="text-neutral-500 mt-1">Here&apos;s your account overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
              <p className="text-xs text-neutral-500">Total Orders</p>
            </div>
          </div>
        </div>

        <Link href="/account/orders" className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">View Orders</p>
                <p className="text-xs text-neutral-500">Order history</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </Link>

        <Link href="/account/addresses" className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">My Addresses</p>
                <p className="text-xs text-neutral-500">Manage addresses</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
          </div>
          <Link href="/account/orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium">View All</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-neutral-500 text-sm">Loading orders...</div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No orders yet</p>
            <Link href="/shop" className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{order.orderNumber}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()} | {order.items?.length || 0} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(order.status)}
                  <span className="text-sm font-semibold text-neutral-900">৳{order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
