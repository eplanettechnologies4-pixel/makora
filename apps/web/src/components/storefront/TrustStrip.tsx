import React from 'react';
import styles from './TrustStrip.module.css';

export default function TrustStrip() {
  const trustPoints = [
    {
      title: 'Nationwide Cash on Delivery',
      desc: 'Inspect and pay at your doorstep across all cities in Pakistan.',
      tag: '100% SECURE',
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: '100% Formulator Authentic',
      desc: 'Sourced directly from verified independent beauty formulators.',
      tag: 'VERIFIED',
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Complimentary Shipping',
      desc: 'Free express dispatch on all beauty orders above Rs. 3,500.',
      tag: 'FAST DISPATCH',
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Unified Multi-Store Bag',
      desc: 'Shop from multiple distinct beauty houses in one single checkout.',
      tag: 'ONE CHECKOUT',
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.section} aria-label="Marketplace Guarantees">
      <div className="container">
        <div className={styles.cardsGrid}>
          {trustPoints.map((tp) => (
            <div key={tp.title} className={styles.card}>
              <div className={styles.topRow}>
                <div className={styles.iconCircle}>
                  {tp.icon}
                </div>
                <span className={styles.tag}>{tp.tag}</span>
              </div>
              <h3 className={styles.title}>{tp.title}</h3>
              <p className={styles.desc}>{tp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
