'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMarketplaceBrandsAction, type MarketplaceBrandCard } from '../../lib/supabase/actions';
import { DUMMY_STORE_BRANDS } from '../../lib/dummyCatalog';
import styles from './BrandRail.module.css';

const BRAND_COVER_FALLBACKS = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
];

function getBrandFallbackCover(slug?: string): string {
  if (!slug || typeof slug !== 'string') return BRAND_COVER_FALLBACKS[0];
  const code = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return BRAND_COVER_FALLBACKS[code % BRAND_COVER_FALLBACKS.length];
}

export default function BrandRail() {
  const [brands, setBrands] = useState<MarketplaceBrandCard[]>(DUMMY_STORE_BRANDS.slice(0, 4));
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getMarketplaceBrandsAction(4)
      .then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setBrands(res.data);
        }
      })
      .catch((err) => console.warn('Failed to load dynamic brands for BrandRail:', err));
  }, []);

  return (
    <section className={styles.section} aria-label="Shop by Brands">
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <span className="section-kicker">Verified Formulators & Stores</span>
            <h2 className={styles.heading}>Shop by Brand</h2>
          </div>

          <div className={styles.headerActions}>
            <Link href="/brand/register" className={styles.sellerCtaBtn}>
              + Open Your Storefront
            </Link>
            <Link href="/brands" className={styles.viewAllBtn} id="link-view-all-brands">
              <span>View All Brands</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className={styles.brandsGrid}>
          {brands.map((b) => {
            if (!b) return null;
            const brandSlug = b.slug || b.name?.toLowerCase().replace(/\s+/g, '-') || 'brand';
            const cardImage = b.bannerUrl || b.image;
            const imgSrc = failedImages[brandSlug] || !cardImage
              ? getBrandFallbackCover(brandSlug)
              : cardImage;

            return (
              <div key={brandSlug} className={styles.brandCard} id={`brand-card-${brandSlug}`}>
                {/* Store Cover Image */}
                <div className={styles.bannerFrame}>
                  <Image
                    src={imgSrc}
                    alt={`${b.name || 'Brand'} Storefront`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={styles.bannerImage}
                    onError={() => setFailedImages((prev) => ({ ...prev, [brandSlug]: true }))}
                  />
                  <div className={styles.bannerOverlay} />
                  <span className={styles.productCountBadge}>
                    {typeof b.productCount === 'number' && b.productCount > 0
                      ? `${b.productCount} Creations`
                      : 'Featured Partner'}
                  </span>
                </div>

                {/* Brand Info */}
                <div className={styles.brandDetails}>
                  <div className={styles.metaRow}>
                    <span className={styles.brandCategory}>{b.category || 'Verified Brand'}</span>
                    <span className={styles.brandOrigin}>{b.origin || 'Pakistan'}</span>
                  </div>

                  <h3 className={styles.brandTitle}>{b.name}</h3>
                  <p className={styles.brandFocus}>{b.focus}</p>

                  <div className={styles.actionRow}>
                    <Link href={`/brands/${brandSlug}`} className={styles.visitStoreBtn}>
                      Visit Storefront
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
