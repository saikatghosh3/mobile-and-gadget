'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { CartProvider } from '@/components/CartContext';
import { WishlistProvider } from '@/components/WishlistContext';
import { AuthProvider } from '@/components/AuthContext';
import { SettingsProvider } from '@/components/SettingsContext';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Provider>
  );
}
