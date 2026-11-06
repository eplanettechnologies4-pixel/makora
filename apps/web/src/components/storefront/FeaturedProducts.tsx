'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';
import styles from './FeaturedProducts.module.css';

const FEATURED_PRODUCTS_CATALOG: Product[] = [
  {
    id: 'prod-saffron-rose',
    name: 'Pure Saffron & Cold-Pressed Kashmiri Rosehip Cellular Elixir',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 4850,
    compareAtPrice: 5500,
    rating: 4.9,
    reviewCount: 84,
    badge: 'Bestseller',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-saffron-rose',
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
    href: '/product/prod-velvet-lip-rouge',
  },
  {
    id: 'prod-oud-damascena',
    name: 'Cambodian Oud & Damascena Attar Concentrée 12ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 8900,
    compareAtPrice: 10500,
    rating: 5.0,
    reviewCount: 19,
    badge: 'Artisanal Batch',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-oud-damascena',
  },
  {
    id: 'prod-amla-rosemary',
    name: 'Botanical Amla & Wild Rosemary Scalp Tonic 100ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    price: 3650,
    rating: 4.9,
    reviewCount: 116,
    badge: 'Clean Halal',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-amla-rosemary',
  },
  {
    id: 'prod-bakuchiol-balm',
    name: 'Bakuchiol 2% Cellular Night Smoothing Nectar 50ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 5400,
    compareAtPrice: 6200,
    rating: 4.9,
    reviewCount: 63,
    badge: 'Formulator Pick',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-bakuchiol-balm',
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
    href: '/product/prod-pearl-tint',
  },
  {
    id: 'prod-ambergris-extrait',
    name: 'Wild Ambergris & Cardamom Extrait de Parfum 50ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 11500,
    compareAtPrice: 13000,
    rating: 5.0,
    reviewCount: 28,
    badge: 'Limited',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-ambergris-extrait',
  },
  {
    id: 'prod-walnut-polish',
    name: 'Kashmiri Walnut & Jasmine Whipped Body Soufflé 200g',
    brandName: 'Indisense Rituals',
    brandSlug: 'indisense-rituals',
    price: 4200,
    rating: 4.7,
    reviewCount: 31,
    badge: 'Rich Moisture',
    category: 'bath-body',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-walnut-polish',
  },
  {
    id: 'prod-niacinamide-glow',
    name: 'Niacinamide 10% & Pure Licorice Root Skin Clarifying Concentrate 30ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 3450,
    compareAtPrice: 3950,
    rating: 4.9,
    reviewCount: 73,
    badge: 'Pore Refining',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-niacinamide-glow',
  },
  {
    id: 'prod-kohl-noir',
    name: 'Artisanal Almond Oil Kohl Kajal Noir Waterproof Gel Pencil',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 2150,
    compareAtPrice: 2600,
    rating: 4.8,
    reviewCount: 65,
    badge: 'Deepest Black',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-kohl-noir',
  },
  {
    id: 'prod-jasmine-sambac',
    name: 'Night-Blooming Motia & Jasmine Sambac Pure Attar Extrait 10ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 7200,
    compareAtPrice: 8500,
    rating: 5.0,
    reviewCount: 34,
    badge: 'Single-Harvest',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-jasmine-sambac',
  },
  {
    id: 'prod-bhringraj-oil',
    name: 'Cold-Pressed Ayurvedic Bhringraj & Black Seed Root Treatment 120ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    price: 3850,
    rating: 4.9,
    reviewCount: 92,
    badge: 'Hair Fall Care',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-bhringraj-oil',
  },
  {
    id: 'prod-ceramide-barrier',
    name: '5-Ceramide & Oat Milk Barrier Repair Whipped Moisturizer 60g',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 4100,
    compareAtPrice: 4700,
    rating: 4.9,
    reviewCount: 88,
    badge: 'Bestseller',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-ceramide-barrier',
  },
  {
    id: 'prod-rose-petal-blush',
    name: 'Velvet Crème-to-Powder Cheek & Lip Flush in "Gulab Glow"',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 2850,
    compareAtPrice: 3300,
    rating: 4.8,
    reviewCount: 54,
    badge: 'Multi-Use',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-rose-petal-blush',
  },
  {
    id: 'prod-saffron-oud-perfume',
    name: 'Royal Kashmiri Saffron & Smoked Oud Eau de Parfum 100ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 12800,
    compareAtPrice: 14500,
    rating: 5.0,
    reviewCount: 41,
    badge: 'Signature Scent',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-saffron-oud-perfume',
  },
  {
    id: 'prod-hibiscus-hair-mask',
    name: 'Raw Hibiscus & Organic Argan Butter Deep Moisture Hair Butter 200g',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    price: 3400,
    rating: 4.7,
    reviewCount: 69,
    badge: 'Frizz Defense',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-hibiscus-hair-mask',
  },
  {
    id: 'prod-sandalwood-glow-polish',
    name: 'Mysore Sandalwood & Raw Honey Clarifying Body Glow Polish 250g',
    brandName: 'Indisense Rituals',
    brandSlug: 'indisense-rituals',
    price: 3950,
    compareAtPrice: 4500,
    rating: 4.9,
    reviewCount: 48,
    badge: 'Artisanal Ritual',
    category: 'bath-body',
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-sandalwood-glow-polish',
  },
  {
    id: 'prod-peptide-eye-balm',
    name: 'Tri-Peptide & Green Tea Depuffing Eye Awakening Elixir 15ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 3600,
    compareAtPrice: 4200,
    rating: 4.8,
    reviewCount: 76,
    badge: 'Anti-Fatigue',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-peptide-eye-balm',
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All Formulations' },
  { key: 'bestseller', label: 'Bestsellers' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'fragrance', label: 'Fragrances' },
  { key: 'haircare', label: 'Haircare' },
];

export default function FeaturedProducts() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProducts = FEATURED_PRODUCTS_CATALOG.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'bestseller') {
      return item.badge?.toLowerCase().includes('bestseller') || (item.rating && item.rating >= 4.9);
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

        {/* Multi-Filter Buttons - e.l.f. Style */}
        <div className={styles.filterBar} role="tablist">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? FEATURED_PRODUCTS_CATALOG.length
                : tab.key === 'bestseller'
                ? FEATURED_PRODUCTS_CATALOG.filter(
                    (p) => p.badge?.toLowerCase().includes('bestseller') || (p.rating && p.rating >= 4.9),
                  ).length
                : FEATURED_PRODUCTS_CATALOG.filter((p) => p.category === tab.key).length;

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
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
