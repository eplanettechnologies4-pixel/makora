import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  title: 'Makora | Luxury Multi-Vendor Beauty Marketplace',
  description:
    'Discover Pakistan’s premier curated luxury beauty collective. Shop authentic skincare, cosmetics, niche perfumes, and haircare from independent beauty brands with nationwide Cash on Delivery.',
  keywords: [
    'beauty marketplace',
    'luxury cosmetics',
    'skincare Pakistan',
    'LAAM beauty',
    'fragrance',
    'makeup brands',
    'cash on delivery beauty',
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/images/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

