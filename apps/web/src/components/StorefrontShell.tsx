'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Only hide header/footer on internal dashboard routes (/brand/* and /admin/*)
  // Public storefront routes like /brands/[slug] and /brands must show the platform header and footer!
  const isDashboard =
    pathname?.startsWith('/brand/') ||
    pathname === '/brand' ||
    pathname?.startsWith('/admin/') ||
    pathname === '/admin';

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

