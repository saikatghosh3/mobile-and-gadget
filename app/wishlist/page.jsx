'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/components/WishlistContext';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push('/login?redirect=/wishlist');
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-neutral-500">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-neutral-900 font-medium">Wishlist</li>
            </ol>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <span>My Wishlist</span>
            </h1>
            <p className="text-neutral-600 mt-1">
              Keep track of items you love and want to purchase later
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 py-16 px-4 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
                Discover the latest technology and add products you love to your wishlist.
              </p>
              <Link href="/shop">
                <Button className="bg-orange-500 hover:bg-orange-600 font-medium px-6 py-2.5 rounded-xl transition-all inline-flex items-center gap-2">
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
