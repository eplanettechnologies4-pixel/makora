'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import styles from '../dashboard/dashboard.module.css';

export default function BrandSettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      apiRequest('/brands/me')
        .then((res) => {
          setBrand(res.data || res);
          setIsLoading(false);
        })
        .catch(() => {
          router.push('/brand/application-status');
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading settings...</div>;
  }

  const bankAccount = brand?.bankAccounts?.[0];

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBadge}>
          <div className={styles.brandBadgeName}>{brand?.name}</div>
          <span className={styles.statusPill}>{brand?.status}</span>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/brand/dashboard" className={styles.navItem}>
            Overview
          </Link>
          <Link href="/brand/profile" className={styles.navItem}>
            Brand Profile
          </Link>
          <Link href="/brand/settings" className={`${styles.navItem} ${styles.navItemActive}`}>
            Settings & Banking
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Brand Settings & Banking</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Review your payout settlement account and platform configuration.
            </p>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Registered Settlement Bank Account
          </h2>
          <div style={{ background: '#FAF8F5', borderLeft: '3px solid var(--accent-gold)', padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span><strong>Protected Data:</strong> In compliance with financial security standards, banking credentials are fully encrypted at rest using AES-256-GCM. Below are the masked identifiers for your records.</span>
          </div>

          {bankAccount ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9375rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bank Name</span>
                <div style={{ fontWeight: 600 }}>{bankAccount.bankName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Account Holder Title</span>
                <div style={{ fontWeight: 600 }}>{bankAccount.accountHolderName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Masked Account Number</span>
                <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {bankAccount.accountNumberMasked || '****'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Masked IBAN</span>
                <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {bankAccount.ibanMasked || 'Not provided'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Verification Status</span>
                <div style={{ color: bankAccount.isVerified ? '#389E0D' : '#D48806', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {bankAccount.isVerified && (
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span>{bankAccount.isVerified ? 'Verified by Admin' : 'Pending Verification'}</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No bank account registered.</p>
          )}
        </div>
      </main>
    </div>
  );
}
