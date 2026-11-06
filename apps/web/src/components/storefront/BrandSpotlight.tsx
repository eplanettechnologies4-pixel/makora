import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BrandSpotlight.module.css';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  specialty: string;
  bio: string;
  bannerImage: string;
}

const SPOTLIGHT_BRANDS: BrandItem[] = [
  {
    id: 'b-maison',
    name: 'Maison de Rose',
    slug: 'maison-de-rose',
    city: 'Lahore, Punjab',
    specialty: 'Active Botanicals & Pure Hydrosols',
    bio: 'Pioneering organic cold-pressed rosehip and high-potency saffron serums crafted from high-altitude Kashmiri crops.',
    bannerImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'b-aura',
    name: 'Aura Scents House',
    slug: 'aura-scents',
    city: 'Karachi, Sindh',
    specialty: 'Artisanal Attars & Niche Perfumes',
    bio: 'Rare aged Cambodian agarwood, French accord extraits, and handcrafted ambergris creations made in limited micro-batches.',
    bannerImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'b-noor',
    name: 'Noor Artisanal Cosmetics',
    slug: 'noor-artisanal',
    city: 'Islamabad, ICT',
    specialty: 'Halal Silk Pigments & Mineral Makeup',
    bio: 'Weightless velvety lip lacquers, clean peptide skin tints, and natural mineral highlights designed for South Asian undertones.',
    bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'b-botanica',
    name: 'Botanica Raw Labs',
    slug: 'botanica-raw-labs',
    city: 'Gilgit-Baltistan',
    specialty: 'Wildcrafted Mountain Hair & Scalp Care',
    bio: 'Hand-harvested wild rosemary, organic amla, and cold-pressed walnut scalp infusions formulated with zero harsh sulfates.',
    bannerImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
  },
];

export default function BrandSpotlight() {
  return (
    <section className={styles.section} aria-label="Featured Indie Beauty Houses">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.kicker}>The Formulators Collective</div>
          <h2 className={styles.heading}>Featured Indie Beauty Houses</h2>
          <p className={styles.subheading}>
            Every brand on Makaura is independently owned and thoroughly vetted for purity,
            halal ingredient integrity, and ethical formulation standards.
          </p>
        </div>

        <div className={styles.grid}>
          {SPOTLIGHT_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands`}
              className={styles.brandCard}
              id={`brand-card-${brand.slug}`}
            >
              <div className={styles.bannerWrapper}>
                <Image
                  src={brand.bannerImage}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className={styles.bannerImage}
                />
                <div className={styles.bannerOverlay} />
                <span className={styles.originPill}>{brand.city}</span>
              </div>

              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <h3 className={styles.brandName}>{brand.name}</h3>
                  <span className={styles.verifiedBadge} title="Verified Makaura Partner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </span>
                </div>

                <div className={styles.specialty}>{brand.specialty}</div>
                <p className={styles.bio}>{brand.bio}</p>

                <div className={styles.cardFooter}>
                  <span>Explore Brand Storefront</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

