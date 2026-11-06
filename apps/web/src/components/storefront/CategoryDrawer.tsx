'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './CategoryDrawer.module.css';

interface CategoryGroup {
  id: string;
  name: string;
  href: string;
  subcategories: { name: string; href: string }[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'skincare',
    name: 'Skincare & Active Serums',
    href: '/categories/skincare',
    subcategories: [
      { name: 'Active Saffron & Rose Serums', href: '/shop?category=skincare&type=serum' },
      { name: 'Bakuchiol & Retinol Renewal', href: '/shop?category=skincare&type=night' },
      { name: 'Cold-Pressed Botanical Facial Oils', href: '/shop?category=skincare&type=oil' },
      { name: 'Artisanal Hydrosols & Toners', href: '/shop?category=skincare&type=toner' },
      { name: 'Mineral Sun & Barrier Balms', href: '/shop?category=skincare&type=sun' },
    ],
  },
  {
    id: 'makeup',
    name: 'Artisanal Cosmetics & Pigments',
    href: '/categories/makeup',
    subcategories: [
      { name: 'Velvet Matte Lip Rouges', href: '/shop?category=makeup&type=lips' },
      { name: 'Peptide Skin Tints & Drops', href: '/shop?category=makeup&type=foundation' },
      { name: 'Halal Mineral Blushes', href: '/shop?category=makeup&type=blush' },
      { name: 'Traditional Kohl & Eye Accords', href: '/shop?category=makeup&type=eyes' },
      { name: 'Setting Powders & Luminous Veil', href: '/shop?category=makeup&type=powder' },
    ],
  },
  {
    id: 'fragrance',
    name: 'Niche Fragrance & Rare Attars',
    href: '/categories/fragrance',
    subcategories: [
      { name: 'Aged Cambodian Agarwood (Oud)', href: '/shop?category=fragrance&type=oud' },
      { name: 'Pure Damascena Rose Attar', href: '/shop?category=fragrance&type=rose' },
      { name: 'French Extraits de Parfum', href: '/shop?category=fragrance&type=extrait' },
      { name: 'Wild Ambergris & Cardamom', href: '/shop?category=fragrance&type=amber' },
      { name: 'Subcontinental Sandalwood Distillates', href: '/shop?category=fragrance&type=sandal' },
    ],
  },
  {
    id: 'haircare',
    name: 'Botanical Hair & Scalp Care',
    href: '/categories/haircare',
    subcategories: [
      { name: 'Wild Rosemary Scalp Infusions', href: '/shop?category=haircare&type=rosemary' },
      { name: 'Himalayan Cold-Pressed Amla Oils', href: '/shop?category=haircare&type=amla' },
      { name: 'Sulfate-Free Herbal Washes', href: '/shop?category=haircare&type=cleanser' },
      { name: 'Restorative Ayurvedic Hair Masks', href: '/shop?category=haircare&type=mask' },
    ],
  },
  {
    id: 'bath-body',
    name: 'Bath & Body Rituals',
    href: '/categories/bath-body',
    subcategories: [
      { name: 'Kashmiri Walnut Body Polishes', href: '/shop?category=bath-body&type=polish' },
      { name: 'Whipped Shea & Jasmine Soufflés', href: '/shop?category=bath-body&type=butter' },
      { name: 'Himalayan Pink Salt Soaks', href: '/shop?category=bath-body&type=bath' },
      { name: 'Artisanal Hand & Cuticle Balms', href: '/shop?category=bath-body&type=hands' },
    ],
  },
];

const FEATURED_BRANDS = [
  { name: 'Maison de Rose', slug: 'maison-de-rose' },
  { name: 'Aura Scents House', slug: 'aura-scents' },
  { name: 'Noor Artisanal', slug: 'noor-artisanal' },
  { name: 'Botanica Raw Labs', slug: 'botanica-raw-labs' },
  { name: 'Indisense Rituals', slug: 'indisense-rituals' },
];

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryDrawer({ isOpen, onClose }: CategoryDrawerProps) {
  const [openGroup, setOpenGroup] = useState<string | null>('skincare');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleGroup = (id: string) => {
    setOpenGroup(openGroup === id ? null : id);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.drawerOverlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`${styles.drawerPanel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Marketplace Category Navigation"
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div>
            <span className={styles.drawerSubtitle}>Explore Marketplace</span>
            <h2 className={styles.drawerTitle}>
              <span>All Departments</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close Category Navigation"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>
          {/* Category Groups Accordion */}
          {CATEGORY_GROUPS.map((group) => {
            const isExpanded = openGroup === group.id;
            return (
              <div key={group.id} className={styles.departmentGroup}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={styles.groupToggle}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.groupName}>{group.name}</span>
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className={`${styles.groupIcon} ${isExpanded ? styles.groupIconRotated : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <ul className={styles.subcategoriesList}>
                    {group.subcategories.map((sub) => (
                      <li key={sub.name}>
                        <Link href={sub.href} className={styles.subLink} onClick={onClose}>
                          <span>{sub.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={group.href} className={styles.viewAllSub} onClick={onClose}>
                        View All {group.name} →
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            );
          })}

          {/* Featured Formulator Houses Strip */}
          <div className={styles.brandsStrip}>
            <div className={styles.brandsStripTitle}>Verified Formulator Houses</div>
            <div className={styles.brandsChips}>
              {FEATURED_BRANDS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/shop?brand=${b.slug}`}
                  className={styles.brandChip}
                  onClick={onClose}
                >
                  {b.name}
                </Link>
              ))}
              <Link href="/brands" className={styles.brandChip} onClick={onClose} style={{ fontWeight: 600 }}>
                View All Houses →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.drawerFooter}>
          <div className={styles.codNoticeStrip}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
            </svg>
            <span>Nationwide Cash on Delivery (COD) Available</span>
          </div>
          <Link href="/brand/register" className={styles.sellerCtaBtn} onClick={onClose}>
            Sell on Makaura • Register Brand
          </Link>
        </div>
      </aside>
    </>
  );
}

