'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './ShopifyShell.module.css';

interface ShopifyShellProps {
  brand: {
    name?: string;
    slug?: string;
    status?: string;
    logoUrl?: string;
  } | null;
  children: React.ReactNode;
}

export default function ShopifyShell({ brand, children }: ShopifyShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const brandName = brand?.name || "Your Store";
  const brandSlug = brand?.slug || 'adans-libas';

  const navLinks = [
    {
      title: 'Home',
      href: '/brand/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      title: 'Orders',
      href: '/brand/orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Products',
      href: '/brand/products',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 00-.707.293l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414 0l7-7a1 1 0 000-1.414l-7-7A1 1 0 0010 2zm-4 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Categories',
      href: '/brand/categories',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Store Banner & Identity',
      href: '/brand/banner',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Settings',
      href: '/brand/settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.storeHeader}>
          <div className={styles.storeBadge}>
            <div className={styles.storeIcon}>
              {brand?.logoUrl ? (
                <img src={brand.logoUrl} alt={brandName} />
              ) : (
                brandName.charAt(0)
              )}
            </div>
            <div className={styles.storeTitleGroup}>
              <div className={styles.storeName} title={brandName}>{brandName}</div>
              <div className={styles.storePlan}>Makaura Seller</div>
            </div>
          </div>
          <Link
            href={`/brands/${brandSlug}`}
            target="_blank"
            className={styles.viewStoreIcon}
            title="View store on Makaura"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/brand/dashboard' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span className={styles.navItemIcon}>{link.icon}</span>
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userBadge}>
            <div className={styles.userAvatar}>
              {user?.firstName?.charAt(0) || 'S'}
            </div>
            <span className={styles.userName}>{user?.firstName || 'Store Owner'}</span>
          </div>
          <button
            onClick={() => logout().then(() => router.push('/brand/login'))}
            className={styles.logoutBtn}
            title="Log out"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className={styles.canvas}>
        {/* Top App Bar */}
        <header className={styles.topBar}>
          <div className={styles.searchBar}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" className={styles.searchIcon}>
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search products, orders..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.topBarRight}>
            <Link
              href={`/brands/${brandSlug}`}
              target="_blank"
              className={styles.onlineStorePill}
            >
              <span>View Online Store</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}

