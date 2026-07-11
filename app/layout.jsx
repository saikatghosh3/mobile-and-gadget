import './globals.css';
import Providers from './providers';
import DynamicFavicon from '@/components/DynamicFavicon';
import CallIcons from '@/components/CallIcons';

export const metadata = {
  title: 'TechGadget - Mobiles & Gadgets Store',
  description: 'Premium mobiles and gadgets at best prices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <DynamicFavicon />
          {children}
          <CallIcons />
        </Providers>
      </body>
    </html>
  );
}
