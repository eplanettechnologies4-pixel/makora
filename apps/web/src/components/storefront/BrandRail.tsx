'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BrandRail.module.css';

interface BrandStore {
  name: string;
  slug: string;
  origin: string;
  category: string;
  focus: string;
  productCount: number;
  image: string;
}

const BRAND_STORES: BrandStore[] = [
  {
    name: 'Maison de Rose',
    slug: 'maison-de-rose',
    origin: 'Lahore, PK',
    category: 'Botanical Skincare',
    focus: 'Cold-pressed Kashmiri rosehip & pure saffron cellular elixirs.',
    productCount: 18,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Noor Artisanal Cosmetics',
    slug: 'noor-artisanal',
    origin: 'Islamabad, PK',
    category: 'Velvet Color Cosmetics',
    focus: 'Halal silk lip rouges, mineral foundation drops & soft blushes.',
    productCount: 24,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Aura Scents House',
    slug: 'aura-scents',
    origin: 'Karachi, PK',
    category: 'Niche Perfumery',
    focus: 'Hand-distilled Cambodian oud, ambergris & Damascena attars.',
    productCount: 14,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Botanica Raw Labs',
    slug: 'botanica-raw-labs',
    origin: 'Gilgit-Baltistan',
    category: 'Scalp & Hair Rituals',
    focus: 'High-altitude rosemary scalp oils & cold-extracted wild amla.',
    productCount: 16,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
  },
];

export default function BrandRail() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

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
          {BRAND_STORES.map((b) => {
            const imgSrc = failedImages[b.slug]
              ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80'
              : b.image;

            return (
              <div key={b.slug} className={styles.brandCard} id={`brand-card-${b.slug}`}>
                {/* Store Cover Image */}
                <div className={styles.bannerFrame}>
                  <Image
                    src={imgSrc}
                    alt={`${b.name} Storefront`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={styles.bannerImage}
                    onError={() => setFailedImages((prev) => ({ ...prev, [b.slug]: true }))}
                  />
                  <div className={styles.bannerOverlay} />
                  <span className={styles.productCountBadge}>{b.productCount} Formulations</span>
                </div>

                {/* Brand Info */}
                <div className={styles.brandDetails}>
                  <div className={styles.metaRow}>
                    <span className={styles.brandCategory}>{b.category}</span>
                    <span className={styles.brandOrigin}>{b.origin}</span>
                  </div>

                  <h3 className={styles.brandTitle}>{b.name}</h3>
                  <p className={styles.brandFocus}>{b.focus}</p>

                  <div className={styles.actionRow}>
                    <Link href={`/shop?brand=${b.slug}`} className={styles.visitStoreBtn}>
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
