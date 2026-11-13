'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminShell.module.css';

interface AdminShellProps {
  children: React.ReactNode;
  pendingCount?: number;
}

export default function AdminShell({ children, pendingCount }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/admin/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0d1117',
          color: '#e6edf3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <p>Loading Makaura Master Administration Console...</p>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const navLinks = [
    {
      title: 'Overview',
      href: '/admin/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      title: 'Brand Directory',
      href: '/admin/brands',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M3 7v14M21 7v14M6 21V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10M9 9V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
        </svg>
      ),
    },
    {
      title: 'Applications Queue',
      href: '/admin/brands/applications',
      badge: pendingCount && pendingCount > 0 ? pendingCount : undefined,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      title: 'Payment & Commissions',
      href: '/admin/payments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      title: 'Platform Orders',
      href: '/admin/orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
  ];

  // Dynamic breadcrumb computation
  const getBreadcrumbTitle = () => {
    if (pathname === '/admin/dashboard') return 'Overview';
    if (pathname === '/admin/brands') return 'Brand Directory';
    if (pathname?.startsWith('/admin/brands/applications/')) return 'Application Dossier';
    if (pathname === '/admin/brands/applications') return 'Applications Queue';
    if (pathname === '/admin/payments') return 'Payment Methods & Commissions';
    if (pathname === '/admin/orders') return 'Platform Orders';
    return 'Master Admin';
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.brandHeader}>
          <div className={styles.brandInfo}>
            <div className={styles.brandLogo}>M</div>
            <div>
              <p className={styles.brandTextTitle}>Makaura</p>
              <p className={styles.brandTextSubtitle}>Master Control</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className={styles.navSection}>
          <div className={styles.navCategoryTitle}>Marketplace Management</div>
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.title}</span>
                {item.badge && <span className={styles.badgePill}>{item.badge}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer with Logged in Admin Profile */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className={styles.userName}>
                {user.firstName} {user.lastName || ''}
              </p>
              <p className={styles.userRole}>Super Administrator</p>
            </div>
            <button
              onClick={() => logout().then(() => router.push('/admin/login'))}
              className={styles.logoutBtn}
              title="Sign Out of Master Admin"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Top App Bar */}
        <header className={styles.topBar}>
          <div className={styles.breadcrumbs}>
            <span>Makaura Admin</span>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{getBreadcrumbTitle()}</span>
          </div>

          <div className={styles.topBarRight}>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storefrontLink}
            >
              <span>Visit Makaura Store</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className={styles.pageContainer}>{children}</main>
      </div>
    </div>
  );
}

