'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroCampaign.module.css';

interface CampaignSlide {
  id: string;
  title: string;
  src: string;
  href: string;
}

const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: 'slide-1',
    title: '11.11 Mega Billion Days Live Now - Upto 80% Off',
    src: '/banners/banner-11-11.jpg',
    href: '/shop',
  },
  {
    id: 'slide-2',
    title: 'Year End Grandeur 12.12 Festive Sale - Save 90% Off Exclusive',
    src: '/banners/banner-12-12.jpg',
    href: '/shop',
  },

];

export default function HeroCampaign() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance banner every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = CAMPAIGN_SLIDES[currentSlide];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? CAMPAIGN_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
  };

  return (
    <section
      className={styles.bannerSection}
      aria-label="Promotional Mega Campaign Banner Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className={styles.bannerCard}>
          {/* Entire Graphic Banner is a Direct Clickable Link (No Planted HTML Text or Buttons) */}
          <Link href={slide.href} className={styles.bannerLink} aria-label={slide.title}>
            <Image
              src={slide.src}
              alt={slide.title}
              width={1024}
              height={402}
              priority
              unoptimized
              className={styles.bannerImage}
            />
          </Link>

          {/* Interactive Navigation Chevrons */}
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.navChevronBtn} ${styles.prevBtn}`}
            aria-label="Previous campaign banner"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`${styles.navChevronBtn} ${styles.nextBtn}`}
            aria-label="Next campaign banner"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className={styles.dotIndicatorsRow}>
            {CAMPAIGN_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`${styles.dotBtn} ${currentSlide === idx ? styles.dotActive : ''}`}
                aria-label={`Jump to campaign slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
