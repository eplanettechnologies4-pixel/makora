'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import styles from '../dashboard/dashboard.module.css';

export default function BrandProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    story: '',
    websiteUrl: '',
    city: '',
    businessAddress: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      apiRequest('/brands/me')
        .then((res) => {
          const b = res.data || res;
          setBrand(b);
          setFormData({
            description: b.description || '',
            story: b.story || '',
            websiteUrl: b.websiteUrl || '',
            city: b.city || '',
            businessAddress: b.businessAddress || '',
          });
          setIsLoading(false);
        })
        .catch(() => {
          router.push('/brand/application-status');
        });
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await apiRequest('/brands/me', {
        method: 'PATCH',
        data: formData,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update brand profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading brand profile...</div>;
  }

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
          <Link href="/brand/profile" className={`${styles.navItem} ${styles.navItemActive}`}>
            Brand Profile
          </Link>
          <Link href="/brand/settings" className={styles.navItem}>
            Settings & Banking
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Brand Profile</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Customize your public brand identity, company bio, and contact details.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ background: '#F6FFED', border: '1px solid #B7EB8F', color: '#389E0D', padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Brand profile updated successfully!</span>
          </div>
        )}

        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                Brand Tagline & Description
              </label>
              <textarea
                style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px', fontFamily: 'var(--font-sans)' }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                Brand Story & Philosophy
              </label>
              <textarea
                style={{ width: '100%', minHeight: '120px', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px', fontFamily: 'var(--font-sans)' }}
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                  City of Origin
                </label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                Business Address
              </label>
              <input
                type="text"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                alignSelf: 'flex-start',
                padding: '0.875rem 2rem',
                background: 'var(--text-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
