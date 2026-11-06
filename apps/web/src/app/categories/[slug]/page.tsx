'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductCard, { Product } from '../../../components/storefront/ProductCard';
import styles from '../../shop/shop.module.css';

const CATEGORY_DATA: Record<string, { title: string; desc: string; categoryKey: string }> = {
  skincare: {
    title: 'Active Skincare & Cold-Pressed Serums',
    desc: 'High-altitude Kashmiri rosehip, niacinamide, bakuchiol, and organic face nectars from verified indie formulators.',
    categoryKey: 'skincare',
  },
  makeup: {
    title: 'Artisanal Cosmetics & Halal Pigments',
    desc: 'Silk-touch velvet lip rouges, weightless peptide foundations, and radiant mineral blushes tailored for South Asian complexions.',
    categoryKey: 'makeup',
  },
  fragrance: {
    title: 'Niche Fragrance & Rare Attars',
    desc: 'Cambodian oud, Damascena rose attar, French accords, and ambergris creations produced in limited batches.',
    categoryKey: 'fragrance',
  },
  haircare: {
    title: 'Botanical Haircare & Scalp Elixirs',
    desc: 'Wildcrafted mountain rosemary, pure amla extracts, cold-pressed walnut oils, and clean herbal scalp remedies.',
    categoryKey: 'haircare',
  },
  'bath-body': {
    title: 'Bath & Body Rituals',
    desc: 'Sandalwood polishing salts, whipped shea soufflés, and soothing botanical body elixirs for restorative self-care.',
    categoryKey: 'bath-body',
  },
};

const ALL_PRODUCTS: Product[] = [
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

export default function CategoryDynamicPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'skincare';
  const info = CATEGORY_DATA[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Department`,
    desc: 'Verified artisanal luxury formulations available with nationwide Cash on Delivery.',
    categoryKey: slug,
  };

  const products = ALL_PRODUCTS.filter((p) => p.category === info.categoryKey || slug === 'all');

  return (
    <div className={styles.shopPage}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Catalog</Link>
          <span>/</span>
          <span>{info.title}</span>
        </nav>

        <div className={styles.header}>
          <h1 className={styles.title}>{info.title}</h1>
          <p className={styles.subtitle}>{info.desc}</p>
        </div>

        <div className={styles.gridArea}>
          <div className={styles.toolbar}>
            <div className={styles.countText}>
              Showing <strong>{products.length}</strong> items in this department
            </div>
            <Link href="/shop" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              View All Departments →
            </Link>
          </div>

          <div className={styles.productGrid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

