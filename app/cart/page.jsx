'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { formatTk } from '@/lib/utils';

function CartPageContent() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, appliedCoupon, couponError, couponLoading, applyCoupon, removeCoupon, getDiscount, getDiscountedTotal } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/cart');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;
  }
  if (!isAuthenticated) return null;

  const formatPrice = (price) => formatTk(price);

  const [couponInput, setCouponInput] = useState('');
  const subtotal = getCartTotal();
  const discount = getDiscount(subtotal);
  const isFreeShippingCoupon = appliedCoupon?.discountType === 'free_shipping';
  const shipping = isFreeShippingCoupon ? 0 : (subtotal > 50 ? 0 : 9.99);
  const total = getDiscountedTotal(subtotal) + shipping;

  const handleApplyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;
    const result = await applyCoupon(couponInput.trim(), user?._id);
    if (result.success) {
      setCouponInput('');
    }
  }, [couponInput, applyCoupon, user]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link href="/shop">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 flex gap-3 sm:gap-4"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden"
                  >
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-semibold text-neutral-900 hover:text-orange-500 transition-colors text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-neutral-500">{item.brand}</p>
                    <p className="text-base sm:text-lg font-semibold text-neutral-900 mt-1 sm:mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-2 hover:bg-neutral-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-neutral-900 mb-4">
                  Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  {appliedCoupon ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-orange-500" />
                          <span className="font-mono font-bold text-sm text-orange-600">{appliedCoupon.code}</span>
                        </div>
                        <button onClick={removeCoupon} className="p-1 hover:bg-neutral-200 rounded">
                          <X className="w-4 h-4 text-neutral-500" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {appliedCoupon.discountType === 'percentage' && `${appliedCoupon.discountValue}% discount applied`}
                        {appliedCoupon.discountType === 'fixed' && `${formatPrice(appliedCoupon.discountValue)} discount applied`}
                        {appliedCoupon.discountType === 'free_shipping' && 'Free shipping applied'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="text-sm h-9"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-orange-500 hover:bg-orange-600 h-9 px-4 text-sm"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-500 mt-1">{couponError}</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      Subtotal ({getCartCount()} items)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping !== 0 && !isFreeShippingCoupon && (
                    <p className="text-xs text-orange-600">
                      Add {(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-neutral-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Payment: Cash on Delivery
                  </p>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-sm text-orange-500 hover:text-orange-600 mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CartPage() {
  return <CartPageContent />;
}
