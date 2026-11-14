'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getMyBrandAction, updateMyBrandProfileAction } from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from '../products/shopify-product.module.css';

const PRESET_BANNERS = [
  {
    name: 'Red Embroidered Pret',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Festive Velvet & Zari',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Summer Silk & Organza',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Artisanal Beauty & Skincare',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Botanical Hair & Scalp',
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Niche Perfumes & Attars',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1920&q=80',
  },
];

export default function BrandBannerPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [bannerUrl, setBannerUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [city, setCity] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      getMyBrandAction()
        .then((res) => {
          if (!res.ok) {
            router.push('/brand/application-status');
            return;
          }
          const b = res.data;
          setBrand(b);
          setBannerUrl(
            b.bannerUrl ||
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80'
          );
          setLogoUrl(
            b.logoUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          );
          setDescription(b.description || '');
          setStory(b.story || '');
          setCity(b.city || 'Lahore');
          setWebsiteUrl(b.websiteUrl || '');
          setInstagram(b.socialLinks?.instagram || '');
          setIsLoading(false);
        })
        .catch(() => router.push('/brand/application-status'));
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMessage(null);

    try {
      const res = await updateMyBrandProfileAction({
        bannerUrl,
        logoUrl,
        description,
        story,
        city,
        websiteUrl,
        socialLinks: { instagram },
      });

      if (!res.ok) {
        alert(res.error || 'Failed to update store banner');
        return;
      }

      setBrand((prev: any) => ({
        ...prev,
        bannerUrl,
        logoUrl,
        description,
        story,
        city,
      }));
      setToastMessage('Store banner and identity saved successfully');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating store banner');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
        Loading store banner settings...
      </div>
    );
  }

  const brandSlug = brand?.slug || user?.brand?.slug || '';

  return (
    <ShopifyShell brand={brand}>
      {toastMessage && (
        <div className={styles.toast}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Store Banner & Branding</h1>
          <p style={{ fontSize: '0.8125rem', color: '#6d7175', margin: '0.2rem 0 0 0' }}>
            Customize your hero banner image and brand avatar shown to customers on Makaura.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link
            href={`/brands/${brandSlug}`}
            target="_blank"
            className={styles.btnSecondary}
          >
            View live storefront ↗
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={styles.btnPrimary}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Two Column Grid */}
      <form onSubmit={handleSubmit} className={styles.productGrid}>
        {/* Left Column */}
        <div className={styles.columnMain}>
          {/* Banner Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Hero Banner Image</h2>
            <div style={{
              width: '100%',
              height: '240px',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#111213',
              position: 'relative',
              marginBottom: '1rem',
              border: '1px solid #e1e3e5',
            }}>
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Banner Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c9196' }}>
                  No banner set
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className={styles.label} style={{ margin: 0 }}>Banner / Cover Image</label>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#008060',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload from Device
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setBannerUrl(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="https://... or upload from your device"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
              />
              <p className={styles.helpText}>
                This image appears as your storefront hero banner and on the homepage Shop by Brand card. Recommended: 1920 x 600px or landscape.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#6d7175' }}>Quick Presets:</span>
              {PRESET_BANNERS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBannerUrl(preset.url)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    background: '#fff',
                    border: '1px solid #c9cccf',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Logo / Avatar Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Store Logo / Avatar</h2>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#f1f2f4',
                border: '1px solid #c9cccf',
                flexShrink: 0,
              }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {brand?.name?.charAt(0) || 'S'}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className={styles.label} style={{ margin: 0 }}>Logo / Avatar</label>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#008060',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload from Device
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setLogoUrl(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="https://... or upload from device"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tagline & Story */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Store Tagline & Story</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Store Tagline</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Luxury Embroidered Couture & Pret Collection"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Brand Story & Philosophy</label>
              <textarea
                className={styles.textarea}
                placeholder="Share your brand story, craftsmanship, and heritage..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.columnSidebar}>
          {/* Store Info */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Store Identity</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Store Name</label>
              <input
                type="text"
                disabled
                className={styles.input}
                value={brand?.name || user?.brand?.name || ''}
                style={{ background: '#f6f6f7', color: '#6d7175' }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>City of Origin</label>
              <input
                type="text"
                className={styles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lahore, Pakistan"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Official Website</label>
              <input
                type="url"
                className={styles.input}
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Instagram Profile</label>
              <input
                type="text"
                className={styles.input}
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>
      </form>
    </ShopifyShell>
  );
}
