'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getMarketplaceCategoriesAction,
  type MarketplaceCategoryCircle,
} from '../../lib/supabase/actions';
import { DUMMY_CATEGORY_CIRCLES } from '../../lib/dummyCatalog';
import styles from './CategoryDiscovery.module.css';

const FALLBACK_CATEGORY_IMG =
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=95';

export default function CategoryDiscovery() {
  const [categories, setCategories] = useState<MarketplaceCategoryCircle[]>(DUMMY_CATEGORY_CIRCLES);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getMarketplaceCategoriesAction(14)
      .then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.warn('Failed to load dynamic categories for CategoryDiscovery:', err));
  }, []);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className={styles.section} aria-label="Shop by Categories">
      <div className="container">
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 className={styles.heading}>
              Shop by Category<span className={styles.blueDot}>.</span>
            </h2>
            <span className={styles.subHeading}>Curated formulator departments & daily rituals</span>
          </div>
        </div>

        {/* 14 Categories Responsive Grid (Clean Grid, No Carousel Cutoffs) */}
        <div className={styles.categoriesGrid}>
          {categories.map((cat) => {
            const imgSrc = failedImages[cat.id] ? FALLBACK_CATEGORY_IMG : cat.image;
            return (
              <Link 
                key={cat.id} 
                href={cat.href} 
                className={styles.categoryItem}
                id={`cat-circle-${cat.id}`}
              >
                <div className={styles.circleAvatar}>
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    width={150}
                    height={150}
                    quality={95}
                    className={styles.avatarImg}
                    onError={() => handleImageError(cat.id)}
                  />
                </div>
                <span className={styles.categoryLabel}>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
