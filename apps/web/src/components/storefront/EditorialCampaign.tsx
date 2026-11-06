import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './EditorialCampaign.module.css';

export default function EditorialCampaign() {
  return (
    <section className={styles.section} aria-label="Editorial Beauty Campaign">
      <div className="container">
        <div className={styles.grid}>
          {/* Visual Column */}
          <div className={styles.imageFrame}>
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85"
              alt="Artisanal Mineral Drops and Skin Tints"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.campaignImage}
            />
          </div>

          {/* Editorial Column */}
          <div className={styles.content}>
            <span className={styles.kicker}>The Formulators Perspective</span>

            <h2 className={styles.title}>
              Tailored for Our Climate & Complexions.
            </h2>

            <p className={styles.bodyText}>
              Mass-market imported cosmetics rarely account for South Asian humidity, undertones,
              or indigenous botanical potency. Pakistan’s independent formulators work directly with
              cold-pressed Himalayan seed oils and weightless silk pigments to create high-performing,
              clean formulations that truly endure.
            </p>

            <blockquote className={styles.formulatorQuote}>
              &ldquo;True luxury in beauty is fresh, uncompromised ingredients harvested at peak potency —
              not synthetic fragrances stored on warehouse shelves for years.&rdquo;
            </blockquote>

            <Link href="/shop" className={styles.ctaLink} id="campaign-link-explore">
              <span>Explore Clean Formulations</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

