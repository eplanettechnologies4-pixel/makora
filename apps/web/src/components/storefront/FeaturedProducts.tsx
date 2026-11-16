'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';
import {
  getMarketplaceProductsAction,
  type MarketplaceProductCard,
} from '../../lib/supabase/actions';
import { DUMMY_FEATURED_PRODUCTS } from '../../lib/dummyCatalog';
import styles from './FeaturedProducts.module.css';

const DEFAULT_FILTER_TABS = [
  { key: 'all', label: 'All Formulations' },
  { key: 'bestseller', label: 'Bestsellers' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'fragrance', label: 'Fragrances' },
  { key: 'haircare', label: 'Haircare' },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<MarketplaceProductCard[]>(DUMMY_FEATURED_PRODUCTS);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    getMarketplaceProductsAction({ limit: 12 })
      .then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.warn('Failed to load dynamic featured products:', err));
  }, []);

  // Filter products based on selected tab
  const filteredProducts = products.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'bestseller') {
      return (
        item.badge?.toLowerCase().includes('bestseller') ||
        (item.rating && item.rating >= 4.9) ||
        item.isReal
      );
    }
    return item.category === selectedFilter;
  });

  return (
    <section className={styles.section} aria-label="Featured Beauty Formulations">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div>
            <span className="section-kicker">Handpicked & Tested</span>
            <h2 className={styles.heading}>Featured Formulations</h2>
          </div>

          <Link href="/shop" className={styles.viewCatalogBtn} id="featured-btn-view-all">
            <span>Explore Full Catalog</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Multi-Filter Buttons */}
        <div className={styles.filterBar} role="tablist">
          {DEFAULT_FILTER_TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? products.length
                : tab.key === 'bestseller'
                ? products.filter(
                    (p) =>
                      p.badge?.toLowerCase().includes('bestseller') ||
                      (p.rating && p.rating >= 4.9) ||
                      p.isReal
                  ).length
                : products.filter((p) => p.category === tab.key).length;

            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={selectedFilter === tab.key}
                onClick={() => setSelectedFilter(tab.key)}
                className={`${styles.filterBtn} ${selectedFilter === tab.key ? styles.filterBtnActive : ''}`}
                id={`filter-tab-${tab.key}`}
              >
                <span>{tab.label}</span>
                <span className={styles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className={styles.grid}>
          {filteredProducts.map((product) => {
            if (!product || !product.id) return null;
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </section>
  );
}
