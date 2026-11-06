import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryShowcase.module.css';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'skincare',
    name: 'Skincare & Active Serums',
    subtitle: 'Niacinamide, bakuchiol & cold-pressed Kashmiri rosehip',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    href: '/categories/skincare',
  },
  {
    id: 'makeup',
    name: 'Artisanal Cosmetics',
    subtitle: 'Velvet lip lacquers, luminous tints & halal pigments',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    href: '/categories/makeup',
  },
  {
    id: 'fragrance',
    name: 'Niche Fragrance & Attars',
    subtitle: 'Damascena rose, rare Cambodian oud & warm amber accords',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    href: '/categories/fragrance',
  },
  {
    id: 'haircare',
    name: 'Botanical Haircare',
    subtitle: 'Amla elixirs, rosemary scalp infusions & herbal washes',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    href: '/categories/haircare',
  },
  {
    id: 'bath-body',
    name: 'Bath & Body Rituals',
    subtitle: 'Sandalwood polishing salts, soufflés & botanical washes',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    href: '/categories/bath-body',
  },
];

export default function CategoryShowcase() {
  return (
    <section className={styles.section} aria-label="Curated Beauty Categories">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.kicker}>Hand-Vetted Formulations</div>
          <h2 className={styles.heading}>Shop by Curated Department</h2>
          <p className={styles.subheading}>
            Explore exceptional formulations from certified master formulators across Pakistan.
            Small-batch production, transparent ingredients, and pure performance.
          </p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={cat.href} className={styles.card} id={`category-card-${cat.id}`}>
              <div className={styles.imageContainer}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className={styles.image}
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.categoryTitle}>{cat.name}</h3>
                <p className={styles.categorySubtitle}>{cat.subtitle}</p>
                <span className={styles.viewLink}>
                  Explore Department
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

