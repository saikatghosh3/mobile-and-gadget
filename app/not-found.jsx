'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home, Search, ArrowLeft, ShoppingBag, HelpCircle, Mail } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/30 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-b from-neutral-200 to-neutral-100 bg-clip-text text-transparent select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25 rotate-12 hover:rotate-0 transition-transform duration-500">
                <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to shopping.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-md mx-auto">
            <Search className="w-5 h-5 text-neutral-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm text-neutral-900 placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="px-5 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 mb-4 uppercase tracking-wider font-medium">Quick Links</p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-orange-600 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Shop
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-orange-600 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </Link>
            <Link
              href="/shipping"
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-orange-600 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
