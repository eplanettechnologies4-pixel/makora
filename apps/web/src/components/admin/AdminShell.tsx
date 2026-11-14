'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
          backgroundColor: '#f1f2f4',
          color: '#111213',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      title: 'Platform Orders',
      href: '/admin/orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Brand Directory',
      href: '/admin/brands',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2zm-6 4h6v2H7v-2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Applications Queue',
      href: '/admin/brands/applications',
      badge: pendingCount && pendingCount > 0 ? pendingCount : undefined,
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Payment & Commissions',
      href: '/admin/payments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
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
        {/* Official Makaura Site Logo on Top Left */}
        <div className={styles.brandHeader}>
          <Link href="/admin/dashboard" className={styles.brandLogoLink} title="Makaura Master Administration">
            <Image
              src="/images/logo-white.png"
              alt="Makaura"
              width={130}
              height={42}
              priority
              className={styles.brandLogoImg}
            />
          </Link>
          <span className={styles.adminBadge}>Admin</span>
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
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
            <span className={styles.breadcrumbPrefix}>Makaura</span>
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
              <span>View Online Store</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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

