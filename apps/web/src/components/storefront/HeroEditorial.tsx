import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroEditorial.module.css';

export default function HeroEditorial() {
  return (
    <section className={styles.hero} aria-label="Autumn / Winter 2026 Collection">
      <div className={styles.heroBackgroundPattern} />
      <div className="container">
        <div className={styles.grid}>
          {/* Editorial Narrative */}
          <div className={styles.content}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              <span>Haute Beauté Collective • Curated Indies</span>
            </div>

            <h1 className={styles.title}>
              Curated Luxury Beauty, <br />
              <span className={styles.titleItalic}>All Under One Unified Roof.</span>
            </h1>

            <p className={styles.description}>
              Immerse yourself in Pakistan’s definitive collective of independent cosmetics,
              cold-pressed botanical skincare, and artisanal niche perfumery. Hand-vetted formulations,
              seamless unified basket, and nationwide <strong>Cash on Delivery (COD)</strong>.
            </p>

            <div className={styles.actions}>
              <Link href="/shop" className={styles.btnPrimary} id="hero-cta-explore">
                <span>Explore Marketplace</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/brand/register" className={styles.btnSecondary} id="hero-cta-brand">
                <span>Sell Your Brand</span>
              </Link>
            </div>

            {/* Proof metrics */}
            <div className={styles.proofBar}>
              <div className={styles.proofItem}>
                <span className={styles.proofValue}>100%</span>
                <span className={styles.proofLabel}>Formulator Verified</span>
              </div>
              <div className={styles.proofItem}>
                <span className={styles.proofValue}>Pure COD</span>
                <span className={styles.proofLabel}>Pay at Doorstep</span>
              </div>
              <div className={styles.proofItem}>
                <span className={styles.proofValue}>Unified</span>
                <span className={styles.proofLabel}>Multi-Brand Delivery</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className={styles.visualWrapper}>
            <div className={styles.imageFrame}>
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85"
                alt="Makaura Luxury Beauty Collective & Artisanal Cosmetics"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className={styles.heroImage}
              />
            </div>

            {/* Floating Curation Card */}
            <div className={styles.floatingCard}>
              <div className={styles.floatingIcon}>
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className={styles.floatingTitle}>Clean Luxury Assurance</h4>
                <p className={styles.floatingSub}>Zero harsh parabens, 100% ethical halal formulations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

