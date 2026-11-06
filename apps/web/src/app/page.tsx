import React from 'react';
import HeroCampaign from '../components/storefront/HeroCampaign';
import CategoryDiscovery from '../components/storefront/CategoryDiscovery';
import BrandRail from '../components/storefront/BrandRail';
import FeaturedProducts from '../components/storefront/FeaturedProducts';
import TrustStrip from '../components/storefront/TrustStrip';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.mainStorefront}>
      {/* 1. High-Impact Editorial Hero Campaign */}
      <HeroCampaign />

      {/* 2. Visual Shop by Categories (Under Hero/Header) */}
      <CategoryDiscovery />

      {/* 3. Shop by Brands (Verified Store Owners & Formulators) */}
      <BrandRail />

      {/* 4. Featured Formulations with Multi-Category Filters */}
      <FeaturedProducts />

      {/* 5. Minimalist Marketplace Trust Strip */}
      <TrustStrip />
    </div>
  );
}
