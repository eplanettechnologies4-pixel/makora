import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './brands.module.css';

interface BrandProfile {
  name: string;
  slug: string;
  city: string;
  specialty: string;
  bio: string;
  bannerImage: string;
  formulationCount: number;
}

const VERIFIED_BRANDS: BrandProfile[] = [
  {
    name: 'Maison de Rose',
    slug: 'maison-de-rose',
    city: 'Lahore, Punjab',
    specialty: 'Active Botanicals & Pure Hydrosols',
    bio: 'Pioneering organic cold-pressed rosehip and high-potency saffron serums crafted from high-altitude Kashmiri crops.',
    bannerImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80',
    formulationCount: 14,
  },
  {
    name: 'Aura Scents House',
    slug: 'aura-scents',
    city: 'Karachi, Sindh',
    specialty: 'Artisanal Attars & Niche Perfumes',
    bio: 'Rare aged Cambodian agarwood, French accord extraits, and handcrafted ambergris creations made in limited micro-batches.',
    bannerImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
    formulationCount: 18,
  },
  {
    name: 'Noor Artisanal Cosmetics',
    slug: 'noor-artisanal',
    city: 'Islamabad, ICT',
    specialty: 'Halal Silk Pigments & Mineral Makeup',
    bio: 'Weightless velvety lip lacquers, clean peptide skin tints, and natural mineral highlights designed for South Asian undertones.',
    bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    formulationCount: 22,
  },
  {
    name: 'Botanica Raw Labs',
    slug: 'botanica-raw-labs',
    city: 'Gilgit-Baltistan',
    specialty: 'Wildcrafted Mountain Hair & Scalp Care',
    bio: 'Hand-harvested wild rosemary, organic amla, and cold-pressed walnut scalp infusions formulated with zero harsh sulfates.',
    bannerImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
    formulationCount: 9,
  },
  {
    name: 'Indisense Rituals',
    slug: 'indisense-rituals',
    city: 'Peshawar, KP',
    specialty: 'Artisanal Bath & Body Elixirs',
    bio: 'Restorative body scrubs, Kashmiri walnut polishes, and soothing night butters honoring ancient subcontinental bathing rituals.',
    bannerImage: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',
    formulationCount: 12,
  },
  {
    name: 'Amber & Silk Apothecary',
    slug: 'amber-silk',
    city: 'Faisalabad, Punjab',
    specialty: 'Pure Essential Distillates & Hydrosols',
    bio: 'Small-batch steam distilled neroli, vetiver, and steam-extracted mogra waters preserved without synthetic parabens.',
    bannerImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    formulationCount: 7,
  },
];

export default function BrandsDirectoryPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Verified Brand Directory</span>
        </nav>

        <div className={styles.header}>
          <div className={styles.kicker}>The Collective of Formulators</div>
          <h1 className={styles.title}>Verified Beauty Houses</h1>
          <p className={styles.subtitle}>
            Explore our curated collective of certified Pakistani independent cosmetics,
            skincare, and perfumery houses. Every brand is independently vetted for ingredient integrity,
            purity, and ethical manufacturing.
          </p>
        </div>

        <div className={styles.grid}>
          {VERIFIED_BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/shop?brand=${brand.slug}`}
              className={styles.card}
              id={`dir-brand-${brand.slug}`}
            >
              <div className={styles.bannerFrame}>
                <Image
                  src={brand.bannerImage}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.bannerImg}
                />
                <span className={styles.originPill}>{brand.city}</span>
              </div>

              <div className={styles.body}>
                <h2 className={styles.brandName}>{brand.name}</h2>
                <div className={styles.specialty}>{brand.specialty}</div>
                <p className={styles.bio}>{brand.bio}</p>

                <div className={styles.footer}>
                  <span>{brand.formulationCount} Formulations</span>
                  <span style={{ color: 'var(--accent-gold-hover)' }}>View Catalog →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Onboarding Banner for Aspiring Brands */}
        <div className={styles.onboardingCta}>
          <h3 className={styles.ctaTitle}>Are You an Independent Beauty Formulator?</h3>
          <p className={styles.ctaText}>
            Join Makaura’s exclusive multi-vendor luxury platform. Enjoy automated weekly COD settlements,
            dedicated seller portals, nationwide logistics, and direct access to beauty connoisseurs.
          </p>
          <Link href="/brand/register" className="btn btn-primary" id="cta-brand-onboard">
            Submit Your Brand Application
          </Link>
        </div>
      </div>
    </div>
  );
}

