'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/components/SettingsContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Star,
  Megaphone,
  ShoppingCart,
  Users,
  Menu,
  X,
  Store,
  TicketPercent,
  Settings,
  RotateCcw,
  BarChart3,
  ImageIcon,
  LogOut,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Coupons', href: '/admin/coupons', icon: TicketPercent },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Advertisements', href: '/admin/advertisements', icon: Megaphone },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Returns', href: '/admin/returns', icon: RotateCcw },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();

  const checkAuth = useCallback(async () => {
    if (pathname === '/admin/login') {
      setAuthLoading(false);
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      const res = await fetch('/api/admin/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success || data.data?.role !== 'admin') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.replace('/admin/login');
        return;
      }

      setAdminUser(data.data);
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      router.replace('/admin/login');
    } finally {
      setAuthLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.replace('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-neutral-900">{settings?.websiteName || 'Admin'}</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-neutral-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-neutral-200 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-neutral-200">
          <Link href="/" className="flex items-center gap-3">
            {settings?.websiteLogo ? (
              <img src={settings.websiteLogo} alt={settings.websiteName} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Store className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg text-neutral-900">{settings?.websiteName || 'TechGadget'}</h1>
              <p className="text-xs text-neutral-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-200px)]">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all"
          >
            <Store className="w-5 h-5" />
            <span>View Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
