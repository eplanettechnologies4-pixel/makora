'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard, { Product } from '../../components/storefront/ProductCard';
import styles from './shop.module.css';

const ALL_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'prod-saffron-rose',
    name: 'Pure Saffron & Cold-Pressed Kashmiri Rosehip Elixir',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 4850,
    compareAtPrice: 5500,
    rating: 4.9,
    reviewCount: 84,
    badge: 'Bestseller',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-velvet-lip-rouge',
    name: 'Velvet Matte Silk Lip Rouge in "Lahore Dahlia"',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 3200,
    compareAtPrice: 3800,
    rating: 4.8,
    reviewCount: 42,
    badge: 'New Shade',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-oud-damascena',
    name: 'Cambodian Oud & Damascena Attar Concentrée',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 8900,
    compareAtPrice: 10500,
    rating: 5.0,
    reviewCount: 19,
    badge: 'Artisanal Batch',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-amla-rosemary',
    name: 'Botanical Amla & Rosemary Scalp Elixir 100ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    price: 3650,
    rating: 4.9,
    reviewCount: 116,
    badge: 'Clean Halal',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-bakuchiol-balm',
    name: 'Bakuchiol 2% Cellular Night Smoothing Nectar',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 5400,
    compareAtPrice: 6200,
    rating: 4.9,
    reviewCount: 63,
    badge: 'Formulator Pick',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-pearl-tint',
    name: 'Luminous Pearl Peptide Mineral Foundation Drops',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 4500,
    rating: 4.8,
    reviewCount: 57,
    badge: 'Weightless',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-ambergris-extrait',
    name: 'Wild Ambergris & Cardamom Extrait de Parfum',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 11500,
    compareAtPrice: 13000,
    rating: 5.0,
    reviewCount: 28,
    badge: 'Limited Edition',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'prod-walnut-polish',
    name: 'Kashmiri Walnut & Jasmine Whipped Body Soufflé',
    brandName: 'Indisense Rituals',
    brandSlug: 'indisense-rituals',
    price: 4200,
    rating: 4.7,
    reviewCount: 31,
    category: 'bath-body',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',
  },
];

function ShopCatalog() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = ALL_CATALOG_PRODUCTS.filter((product) => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (selectedBrand !== 'all' && product.brandSlug !== selectedBrand) {
      return false;
    }
    if (initialQuery) {
      const q = initialQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brandName.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className={styles.shopPage}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Catalog</span>
          {initialQuery && (
            <>
              <span>/</span>
              <span>Search: &ldquo;{initialQuery}&rdquo;</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {initialQuery ? `Search Results for &ldquo;${initialQuery}&rdquo;` : 'Curated Luxury Beauty'}
          </h1>
          <p className={styles.subtitle}>
            Explore authentic artisanal formulations, rare perfumes, and pure botanical skincare
            crafted by independent Pakistani beauty formulators. Cash on Delivery available nationwide.
          </p>
        </div>

        {/* Catalog Layout */}
        <div className={styles.layout}>
          {/* Filters Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Department</h3>
              <ul className={styles.filterList}>
                {[
                  { id: 'all', label: 'All Departments' },
                  { id: 'skincare', label: 'Skincare & Serums' },
                  { id: 'makeup', label: 'Artisanal Cosmetics' },
                  { id: 'fragrance', label: 'Niche Fragrance' },
                  { id: 'haircare', label: 'Botanical Haircare' },
                  { id: 'bath-body', label: 'Bath & Body' },
                ].map((item) => (
                  <li key={item.id}>
                    <label className={styles.filterItem}>
                      <input
                        type="radio"
                        name="department"
                        checked={selectedCategory === item.id}
                        onChange={() => setSelectedCategory(item.id)}
                        className={styles.filterRadio}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Formulator House</h3>
              <ul className={styles.filterList}>
                {[
                  { id: 'all', label: 'All Houses' },
                  { id: 'maison-de-rose', label: 'Maison de Rose' },
                  { id: 'noor-artisanal', label: 'Noor Artisanal' },
                  { id: 'aura-scents', label: 'Aura Scents House' },
                  { id: 'botanica-raw-labs', label: 'Botanica Raw Labs' },
                  { id: 'indisense-rituals', label: 'Indisense Rituals' },
                ].map((brand) => (
                  <li key={brand.id}>
                    <label className={styles.filterItem}>
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand.id}
                        onChange={() => setSelectedBrand(brand.id)}
                        className={styles.filterRadio}
                      />
                      <span>{brand.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid Area */}
          <div className={styles.gridArea}>
            <div className={styles.toolbar}>
              <div className={styles.countText}>
                Showing <strong>{filteredProducts.length}</strong> verified formulations
              </div>

              <div>
                <label style={{ marginRight: '8px' }}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="featured">Editorial Curation</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={styles.productGrid}>
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  No formulations found matching your filter selections.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Makaura Catalog...</div>}>
      <ShopCatalog />
    </Suspense>
  );
}

