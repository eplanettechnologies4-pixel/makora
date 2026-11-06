'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import styles from './dashboard.module.css';

export default function BrandDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      // Check user role
      if (user.role !== 'BRAND_OWNER' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/brand/register');
        return;
      }

      // Load brand profile
      apiRequest('/brands/me')
        .then((res) => {
          const brandData = res.data || res;
          // Status gating: If not approved, redirect to application-status
          if (brandData.status !== 'APPROVED') {
            router.push('/brand/application-status');
          } else {
            setBrand(brandData);
            setIsLoading(false);
          }
        })
        .catch(() => {
          router.push('/brand/application-status');
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your brand workspace...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brandBadge}>
          <div className={styles.brandBadgeName}>{brand?.name || 'Your Brand'}</div>
          <span className={styles.statusPill}>
            {brand?.status || 'APPROVED'}
          </span>
        </div>

        <nav className={styles.navLinks}>
          <Link href="/brand/dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>
            Overview
          </Link>
          <Link href="/brand/profile" className={styles.navItem}>
            Brand Profile
          </Link>
          <Link href="/brand/settings" className={styles.navItem}>
            Settings & Banking
          </Link>
          <Link href="/brand/application-status" className={styles.navItem}>
            Compliance Record
          </Link>
        </nav>

        <button
          onClick={() => logout().then(() => router.push('/'))}
          className={styles.navItem}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Seller Workspace</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Manage your storefront catalog and view store health on Makaura.
            </p>
          </div>

          <div className={styles.userProfileSnippet}>
            <div className={styles.userAvatar}>
              {user?.firstName?.[0] || 'B'}
            </div>
            <div>
              <div className={styles.userName}>
                {user?.firstName} {user?.lastName}
              </div>
              <div className={styles.userRole}>Brand Owner • @{brand?.slug}</div>
            </div>
          </div>
        </div>

        {/* Phase 2 Operational Shell Metrics */}
        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Marketplace Status</div>
            <div className={styles.metricValue} style={{ color: '#237804', fontSize: '1.75rem' }}>
              Active Seller
            </div>
            <div className={styles.metricSubtext}>Verified & Approved</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Agreed Commission</div>
            <div className={styles.metricValue}>
              {brand?.commissionRate ? `${brand.commissionRate}%` : '10.00%'}
            </div>
            <div className={styles.metricSubtext}>Standard Beauty Tier</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Payout Schedule</div>
            <div className={styles.metricValue}>COD Weekly</div>
            <div className={styles.metricSubtext}>Reconciled Post-Delivery</div>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className={styles.phaseNotice}>
          <span className={styles.phaseTag}>Phase 2 Milestone Complete</span>
          <h2 className={styles.noticeTitle}>Storefront Activation & Authentication Verified</h2>
          <p className={styles.noticeDesc}>
            Your brand is officially authorized on the Makaura Beauty Multi-Vendor platform.
            Product catalog management, inventory SKU tracking, and multi-vendor order routing will be enabled in Phase 3.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem' }}>
            <Link
              href="/brand/profile"
              style={{
                padding: '0.625rem 1.25rem',
                background: 'var(--text-primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Update Brand Profile →
            </Link>
            <Link
              href="/brand/settings"
              style={{
                padding: '0.625rem 1.25rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            >
              View Masked Banking →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
