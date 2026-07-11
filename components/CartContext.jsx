'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

const CartContext = createContext();

export function CartProvider({ children }) {
  const user = useSelector((state) => state.auth?.user);

  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('appliedCoupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('appliedCoupon');
      }
    } catch (error) {
      console.error('Failed to save coupon to localStorage:', error);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    if (!user) return;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setAppliedCoupon(null);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    setAppliedCoupon(null);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getDiscount = useCallback((subtotal) => {
    if (!appliedCoupon) return 0;
    const { discountType, discountValue, maxDiscountLimit } = appliedCoupon;
    if (discountType === 'percentage') {
      const discount = (subtotal * discountValue) / 100;
      const capped = maxDiscountLimit > 0 ? Math.min(discount, maxDiscountLimit) : discount;
      return Math.min(capped, subtotal);
    }
    if (discountType === 'fixed') {
      return Math.min(discountValue, subtotal);
    }
    return 0;
  }, [appliedCoupon]);

  const getDiscountedTotal = useCallback((subtotal) => {
    const discount = getDiscount(subtotal);
    return subtotal - discount;
  }, [getDiscount]);

  const applyCoupon = async (code, userId) => {
    setCouponLoading(true);
    setCouponError(null);
    try {
      const subtotal = getCartTotal();
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal, userId }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        return { success: true };
      } else {
        setCouponError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      setCouponError('Failed to validate coupon');
      return { success: false, error: 'Failed to validate coupon' };
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        appliedCoupon,
        couponError,
        couponLoading,
        applyCoupon,
        removeCoupon,
        getDiscount,
        getDiscountedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
