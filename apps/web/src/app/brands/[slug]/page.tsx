'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getPublicBrandStorefrontAction } from '../../../lib/supabase/actions';
import ProductCard from '../../../components/storefront/ProductCard';
import styles from './storefront.module.css';

export default function BrandStorefrontPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'adans-libas';
  const { user } = useAuth();

  const [brand, setBrand] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    getPublicBrandStorefrontAction(slug)
      .then((res) => {
        if (res.ok && res.data) {
          setBrand(res.data.brand);
          setCategories(res.data.categories || []);
          setProducts(res.data.products || []);
        }
      })
      .catch((err) => console.error('Failed to load brand storefront:', err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading brand storefront...</p>
      </div>
    );
  }

  const brandName = brand?.name || (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Brand');
  const bannerImage =
    brand?.bannerUrl ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80';
  const logoImage =
    brand?.logoUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  // Filter & sort
  let displayedProducts = products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  if (sortBy === 'price-low') {
    displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    displayedProducts = [...displayedProducts].sort((a, b) => {
      const discA = a.compareAtPrice ? a.compareAtPrice - a.price : 0;
      const discB = b.compareAtPrice ? b.compareAtPrice - b.price : 0;
      return discB - discA;
    });
  }

  const isOwner = user?.brand?.slug === slug || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (brand?.status === 'SUSPENDED' && !isAdmin) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#856404" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
          {brandName} is Currently Paused
        </h2>
        <p style={{ maxWidth: 480, color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          This brand store is temporarily offline for seasonal restocking or administrative review. Explore our full directory of verified Pakistani couture and artisanal beauty houses.
        </p>
        <Link
          href="/brands"
          style={{
            padding: '0.75rem 1.75rem',
            backgroundColor: '#111827',
            color: '#ffffff',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Explore Verified Brands →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Platform Trust & Verification Strip */}
      <div className={styles.platformTrustBar}>
        <div className={styles.platformTrustInner}>
          <span>Verified Brand Atelier running on <strong>Makaura Marketplace</strong></span>
          <span className={styles.trustDivider}>•</span>
          <span>100% Authentic Guaranteed</span>
          <span className={styles.trustDivider}>•</span>
          <span>Nationwide Cash on Delivery (COD)</span>
        </div>
      </div>

      {brand?.status === 'SUSPENDED' && isAdmin && (
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, borderBottom: '1px solid #fde68a' }}>
          ⚠️ Master Admin Preview: This brand is currently <strong>SUSPENDED</strong> from the public marketplace catalog. Buyers will see an unavailable notice.
        </div>
      )}
      {/* Hero Banner Section (Matches LAAM Layout) */}
      <section className={styles.heroBannerSection}>
        <img
          src={bannerImage}
          alt={`${brandName} Collection Banner`}
          className={styles.heroBannerImage}
        />

        <div className={styles.heroOverlay}>
          <div className={styles.brandIdentityBar}>
            <div className={styles.brandIdentityLeft}>
              <img
                src={logoImage}
                alt={brandName}
                className={styles.brandAvatar}
              />
              <div className={styles.brandDetails}>
                <h1 className={styles.brandTitle}>
                  <span>{brandName}</span>
                  <span className={styles.verifiedBadge} title="Verified Marketplace Partner">
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                </h1>
                <div className={styles.brandMeta}>
                  <span className={styles.metaItem}>★ 4.9 (420+ Reviews)</span>
                  <span>•</span>
                  <span className={styles.metaItem}>24.8k followers</span>
                  <span>•</span>
                  <span className={styles.metaItem}>{brand?.city || 'Lahore, Pakistan'}</span>
                </div>
                {brand?.description && (
                  <p className={styles.heroBrandBio}>{brand.description}</p>
                )}
              </div>
            </div>

            <div className={styles.brandActionsRight}>
              {isOwner && (
                <Link href="/brand/dashboard" className={styles.ownerEditBtn}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Store Owner Portal</span>
                </Link>
              )}
              <button
                type="button"
                className={styles.followBtn}
                onClick={() => alert(`You are now following ${brandName}!`)}
              >
                + Follow Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Category Filter Navigation Sub-Bar (Fixed Spacing & No Overlap) */}
      <div className={styles.subNavBar}>
        <div className={styles.subNavBarInner}>
          <div className={styles.pillsScrollWrapper}>
            <div className={styles.categoryPills}>
              <button
                className={`${styles.categoryPill} ${selectedCategory === 'ALL' ? styles.categoryPillActive : ''}`}
                onClick={() => setSelectedCategory('ALL')}
              >
                <span>All Products</span>
                <span className={styles.pillCount}>{products.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  className={`${styles.categoryPill} ${selectedCategory === c.slug ? styles.categoryPillActive : ''}`}
                  onClick={() => setSelectedCategory(c.slug)}
                >
                  <span>{c.name}</span>
                  <span className={styles.pillCount}>{c.productCount || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Area */}
      <main className={styles.catalogContainer}>
        <div className={styles.catalogHeader}>
          <div className={styles.itemCountText}>
            Showing <strong>{displayedProducts.length}</strong> creations from {brandName}
          </div>
        </div>

        {/* 4-Column Product Grid Matching Homepage ProductCard */}
        <div className={styles.productGrid}>
          {displayedProducts.map((p) => {
            const discountPercent =
              p.compareAtPrice && p.compareAtPrice > p.price
                ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                : null;

            const badgeText = discountPercent
              ? `${discountPercent}% OFF`
              : (p.isFeatured ? 'CLEAN HALAL' : 'CLEAN HALAL');

            return (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.title,
                  brandName: brandName,
                  brandSlug: slug,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  rating: p.rating || 4.9,
                  reviewCount: p.reviewCount || 42,
                  image: p.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                  badge: badgeText,
                  category: p.category,
                  href: `/product/${p.id}`,
                }}
              />
            );
          })}
        </div>

        {/* Brand Heritage & Atelier Story Section */}
        {(brand?.description || brand?.story) && (
          <section className={styles.atelierStorySection} aria-label="Brand Atelier Heritage">
            <div className={styles.atelierStoryCard}>
              <div className={styles.atelierHeader}>
                <span className={styles.atelierKicker}>Verified Artisan Atelier</span>
                <h2 className={styles.atelierTitle}>The Craftsmanship Behind {brandName}</h2>
              </div>
              {brand?.description && (
                <p className={styles.atelierDescription}>
                  {brand.description}
                </p>
              )}
              {brand?.story && brand.story !== brand.description && (
                <p className={styles.atelierStoryText}>
                  {brand.story}
                </p>
              )}
              <div className={styles.atelierTrustTags}>
                <div className={styles.trustTagItem}>
                  <span className={styles.trustTagIcon}>🛡️</span>
                  <div>
                    <strong>100% Authentic Creations</strong>
                    <small>Directly curated from verified workshop</small>
                  </div>
                </div>
                <div className={styles.trustTagItem}>
                  <span className={styles.trustTagIcon}>✨</span>
                  <div>
                    <strong>Handcrafted & Small-Batch</strong>
                    <small>Formulated with premium artisanal grade ingredients</small>
                  </div>
                </div>
                <div className={styles.trustTagItem}>
                  <span className={styles.trustTagIcon}>📦</span>
                  <div>
                    <strong>Nationwide Cash on Delivery</strong>
                    <small>Dispatched safely with tracked delivery</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom Platform Discovery Banner */}
        <div className={styles.bottomPlatformCard}>
          <h3>Discover More Independent Creators on Makaura</h3>
          <p>Explore verified Pakistani haute couture, festive pret, and botanical beauty formulation houses.</p>
          <Link href="/brands" className={styles.exploreMarketplaceBtn}>
            Explore All Brands →
          </Link>
        </div>
      </main>
    </div>
  );
}
