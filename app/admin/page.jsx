'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  Star,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Tag,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const STATUS_STYLES = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    mainCategories: 0,
    subCategories: 0,
    orders: 0,
    reviews: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes, reviewsRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/categories?tree=true'),   // use tree to separate main/sub
        fetch('/api/orders?admin=true'),
        fetch('/api/reviews'),
      ]);

      const productsData   = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const ordersData     = await ordersRes.json();
      const reviewsData    = await reviewsRes.json();

      const orders    = ordersData.data || [];
      const treeData  = categoriesData.data || [];
      const totalSubs = treeData.reduce((a, c) => a + (c.subcategories?.length || 0), 0);
      const revenue   = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pending   = orders.filter((o) => o.status === 'pending').length;

      setStats({
        products:       productsData.data?.length || 0,
        mainCategories: treeData.length,
        subCategories:  totalSubs,
        orders:         orders.length,
        reviews:        reviewsData.data?.length || 0,
        revenue,
        pendingOrders:  pending,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (price) =>
    new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(price);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/products',
    },
    {
      label: 'Main Categories',
      value: stats.mainCategories,
      icon: FolderTree,
      color: 'from-green-500 to-green-600',
      link: '/admin/categories',
    },
    {
      label: 'Subcategories',
      value: stats.subCategories,
      icon: Tag,
      color: 'from-teal-500 to-teal-600',
      link: '/admin/categories',
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/orders',
    },
    {
      label: 'Reviews',
      value: stats.reviews,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      link: '/admin/reviews',
    },
    {
      label: 'Total Revenue',
      value: fmt(stats.revenue),
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      link: '/admin/orders',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/orders',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-1 text-sm">Welcome back! Here's what's happening.</p>
        </div>
        <div className="text-right text-sm text-neutral-400">
          <Clock className="w-4 h-4 inline mr-1" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="group bg-white rounded-2xl p-5 border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {loading ? (
                    <span className="inline-block w-16 h-7 bg-neutral-100 rounded animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ml-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-neutral-400 group-hover:text-orange-500 transition-colors">
              <ArrowRight className="w-3 h-3" />
              <span>View all</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-400 text-sm">
                    <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-400 text-sm">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-neutral-900 text-sm">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-neutral-900 font-medium">{order.customerName}</p>
                      <p className="text-xs text-neutral-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm text-neutral-900">
                      {fmt(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-neutral-100 text-neutral-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Add Product',    href: '/admin/products',      icon: Package,   color: 'bg-blue-50 text-blue-600 border-blue-200' },
          { label: 'Add Category',   href: '/admin/categories',    icon: FolderTree, color: 'bg-green-50 text-green-600 border-green-200' },
          { label: 'Manage Orders',  href: '/admin/orders',        icon: ShoppingCart, color: 'bg-purple-50 text-purple-600 border-purple-200' },
          { label: 'Add Review',     href: '/admin/reviews',       icon: Star,      color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
        ].map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className={`flex items-center gap-3 p-4 rounded-xl border ${q.color} hover:shadow-md transition-all font-medium text-sm`}
          >
            <q.icon className="w-5 h-5 flex-shrink-0" />
            {q.label}
          </Link>
        ))}
      </div> */}
    </div>
  );
}
