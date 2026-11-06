'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';
import styles from './ProductRail.module.css';

interface ProductRailProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductRail({
  kicker = 'Curated Formulations',
  title,
  subtitle,
  products,
  viewAllHref = '/shop',
}: ProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section} aria-label={title}>
      <div className="container">
        {/* Header Row with Left/Right Scroll Arrows */}
        <div className={styles.headerRow}>
          <div>
            <div className={styles.kicker}>{kicker}</div>
            <h2 className={styles.heading}>{title}</h2>
            {subtitle && <p className={styles.subheading}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            <button
              onClick={scrollLeft}
              className={styles.arrowBtn}
              aria-label="Scroll products left"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className={styles.arrowBtn}
              aria-label="Scroll products right"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Link href={viewAllHref} className={styles.viewAllLink}>
              View All →
            </Link>
          </div>
        </div>

        {/* Scrollable Horizontal Rail */}
        <div ref={scrollRef} className={styles.railContainer}>
          {products.map((product) => (
            <div key={product.id} className={styles.railItem}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

