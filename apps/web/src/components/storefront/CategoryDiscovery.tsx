'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryDiscovery.module.css';

interface CategoryCircle {
  id: string;
  name: string;
  image: string;
  href: string;
}

// 14 Curated Beauty Categories with Verified 800px High-Resolution Images
const CATEGORY_ITEMS: CategoryCircle[] = [
  // Row 1 (7 items)
  {
    id: 'serums',
    name: 'Active Serums',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=95',
    href: '/categories/skincare',
  },
  {
    id: 'lip-tints',
    name: 'Lip Tints',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=95',
    href: '/categories/makeup',
  },
  {
    id: 'niche-perfumes',
    name: 'Niche Perfumes',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=95',
    href: '/categories/fragrance',
  },
  {
    id: 'haircare',
    name: 'Hair & Scalp',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=95',
    href: '/categories/haircare',
  },
  {
    id: 'face-creams',
    name: 'Face Creams',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=95',
    href: '/categories/skincare',
  },
  {
    id: 'cleansers',
    name: 'Cleansers',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=95',
    href: '/categories/skincare',
  },
  {
    id: 'eye-makeup',
    name: 'Eye Makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=95',
    href: '/categories/makeup',
  },

  // Row 2 (7 items)
  {
    id: 'sunscreen',
    name: 'Sun Care SPF',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=95',
    href: '/categories/skincare',
  },
  {
    id: 'blush-glow',
    name: 'Blush & Glow',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=95',
    href: '/categories/makeup',
  },
  {
    id: 'artisanal-attar',
    name: 'Artisanal Attar',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=95',
    href: '/categories/fragrance',
  },
  {
    id: 'body-rituals',
    name: 'Body Rituals',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=95',
    href: '/categories/bath-body',
  },
  {
    id: 'face-masks',
    name: 'Face Masks',
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=95',
    href: '/categories/skincare',
  },
  {
    id: 'foundations',
    name: 'Foundations',
    image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=95',
    href: '/categories/makeup',
  },
  {
    id: 'tools',
    name: 'Beauty Tools',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=95',
    href: '/shop?q=tools',
  },
];

const FALLBACK_CATEGORY_IMG = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=95';

export default function CategoryDiscovery() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

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
          {CATEGORY_ITEMS.map((cat) => {
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
