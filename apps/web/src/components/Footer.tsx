'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSent(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSent(false), 5000);
    }
  };

  return (
    <footer className={styles.footerRoot} aria-label="Storefront Footer">
      {/* 1. VIP Club / Newsletter Hero Strip (Haute Beauté Velvet Noir & Royal Bordeaux Wine) */}
      <div className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterCard}>
            <div className={styles.newsletterTextCol}>
              <span className={styles.newsletterBadge}>
                <span className={styles.pulsingDot} />
                JOIN THE MAKAURA BEAUTY CLUB
              </span>
              <h2 className={styles.newsletterHeading}>
                BE THE FIRST TO KNOW<span className={styles.goldPeriod}>.</span>
              </h2>
              <p className={styles.newsletterSubtitle}>
                Unlock <strong>10% off your first order</strong>, secret small-batch drops, and exclusive early access to formulation releases.
              </p>
            </div>

            <div className={styles.newsletterFormCol}>
              {newsletterSent ? (
                <div className={styles.newsletterSuccessNotice}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You are on the VIP list! Welcome to Makaura Collective.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className={styles.newsletterCapsuleForm}>
                  <svg
                    className={styles.mailIcon}
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className={styles.newsletterInput}
                    required
                    aria-label="Email address for beauty newsletter"
                  />
                  <button type="submit" className={styles.newsletterSubmitBtn}>
                    <span>GET 10% OFF</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main High-Fashion Midnight Navigation Grid */}
      <div className={styles.mainFooterSection}>
        <div className="container">
          <div className={styles.grid}>
            {/* Column 1: Brand Manifesto & Official Logo */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.footerLogoLink} aria-label="Makora Home">
                <Image
                  src="/images/logo-white.png"
                  alt="MAKORA - Discover Beauty. Explore Brands."
                  width={180}
                  height={114}
                  className={styles.footerLogoImg}
                />
              </Link>
              <p className={styles.brandMission}>
                Pakistan’s premier curated multi-vendor beauty collective. Connecting certified cosmetic formulators, 
                artisanal perfume houses, and clean skincare creators with beauty connoisseurs nationwide.
              </p>
              
              {/* Social Media Circular Icons (Not Pills) */}
              <div className={styles.socialIconsRow}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Follow Makaura on Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Follow Makaura on TikTok"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 6.33 6.32 6.34 6.34 0 0 0 6.33-6.32V9.08a8.27 8.27 0 0 0 4.93 1.61V7.27a4.91 4.91 0 0 1-1-.58z"/>
                  </svg>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Follow Makaura on Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Follow Makaura on YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Follow Makaura on Pinterest"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Customer Care */}
            <div className={styles.navCol}>
              <h4 className={styles.colTitle}>CUSTOMER CARE</h4>
              <ul className={styles.linkList}>
                <li><Link href="/shop">Track Your Order</Link></li>
                <li><Link href="/shop">Shipping & Delivery Rates</Link></li>
                <li><Link href="/shop">Returns & Exchange Policy</Link></li>
                <li><Link href="/shop">Batch Verification & Authenticity</Link></li>
                <li><Link href="/shop">Frequently Asked Questions</Link></li>
                <li><Link href="/login">Customer Account Login</Link></li>
              </ul>
            </div>

            {/* Column 3: Curated Departments */}
            <div className={styles.navCol}>
              <h4 className={styles.colTitle}>DEPARTMENTS</h4>
              <ul className={styles.linkList}>
                <li><Link href="/categories/skincare">Active Skincare & Serums</Link></li>
                <li><Link href="/categories/makeup">Artisanal Velvet Makeup</Link></li>
                <li><Link href="/categories/fragrance">Niche Perfumery & Attar</Link></li>
                <li><Link href="/categories/haircare">Botanical Scalp & Hair</Link></li>
                <li><Link href="/categories/bath-body">Bath & Body Rituals</Link></li>
                <li><Link href="/brands">Verified Brand Houses</Link></li>
              </ul>
            </div>

            {/* Column 4: Store Owners & Formulators */}
            <div className={styles.navCol}>
              <h4 className={styles.colTitle}>FOR STORE OWNERS</h4>
              <div className={styles.sellerHighlightBox}>
                <Link href="/brand/register" className={styles.sellerHighlightBtn}>
                  + Open Your Storefront →
                </Link>
              </div>
              <ul className={styles.linkList}>
                <li><Link href="/brand/login">Store Owner Portal Sign In</Link></li>
                <li><Link href="/brand/application-status">Check Application Status</Link></li>
                <li><Link href="/brand/register">Seller Guidelines & Payouts</Link></li>
                <li><Link href="/brands">Explore All Verified Stores</Link></li>
                <li><Link href="/admin/login">Marketplace Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Payment Trust Strip (100% Cash on Delivery Nationwide) */}
          <div className={styles.paymentTrustRow}>
            <div className={styles.paymentCardsGroup}>
              <span className={styles.payLabel}>ACCEPTED PAYMENT METHOD:</span>

              <div className={styles.cardsContainer}>
                {/* Cash on Delivery (COD) Badge */}
                <div className={`${styles.paymentCard} ${styles.cardCod}`} title="100% Cash on Delivery Nationwide">
                  <div className={styles.codIconBox}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className={styles.codText}>100% Cash on Delivery (COD) Nationwide</span>
                </div>
              </div>
            </div>

            <div className={styles.countryBadge}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '14px', background: '#01411C', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                PK
              </span>
              <span>Pakistan (PKR) • Nationwide Inspection Before Payment</span>
            </div>
          </div>

          {/* 4. Bottom Legal & Copyright Bar */}
          <div className={styles.bottomBar}>
            <div className={styles.copyright}>
              © 2026 MAKAURA BEAUTY COLLECTIVE (PVT) LTD. ALL RIGHTS RESERVED.
            </div>
            <div className={styles.legalLinks}>
              <Link href="/shop">Privacy Policy</Link>
              <span>•</span>
              <Link href="/shop">Terms of Service</Link>
              <span>•</span>
              <Link href="/brand/register">Storefront Agreement</Link>
              <span>•</span>
              <Link href="/shop">Formulation Code of Ethics</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
