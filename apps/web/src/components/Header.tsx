'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`${styles.headerRoot} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Top Slim Announcement Bar - e.l.f. Style Midnight & Electric Blue */}
      <div className={styles.announcementBar}>
        <div className="container">
          <div className={styles.announcementContent}>

            <span className={styles.announcementText}>
              100% NATIONWIDE <span className={styles.announcementHighlight}>CASH ON DELIVERY (COD)</span>
            </span>

          </div>
        </div>
      </div>

      {/* Single Main Header Bar */}
      <div className={styles.mainBar}>
        <div className="container">
          <div className={styles.mainRow}>
            {/* Official Makora Logo */}
            <Link href="/" className={styles.brandLogo} id="nav-brand-logo" aria-label="Makora Home">
              <Image
                src="/images/logo.png"
                alt="MAKORA - Discover Beauty. Explore Brands."
                width={160}
                height={102}
                className={styles.logoImg}
                priority
              />
            </Link>

            {/* Central Capsule Search Bar */}
            <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
              <svg
                className={styles.searchIcon}
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search viral serums, lipsticks, perfumes, brand houses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="header-search-input"
                aria-label="Search beauty products and brands"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={styles.searchClearBtn}
                  aria-label="Clear search"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>

            {/* Right Action Icons & Single Login */}
            <div className={styles.rightActions}>
              {/* Sell on Makaura Partner Pill */}
              <Link href="/brand/register" className={styles.partnerBtn} id="nav-sell-btn">
                <span>Sell With Us</span>
              </Link>

              {/* Single Login Button / Account State */}
              {isAuthenticated ? (
                <div className={styles.userDropdownGroup}>
                  {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                    <Link href="/admin/brands/applications" className={styles.roleLink}>
                      <span className={styles.roleBadge}>Admin</span>
                    </Link>
                  ) : user?.role === 'BRAND_OWNER' ? (
                    <Link
                      href={user.brand?.status === 'APPROVED' ? '/brand/dashboard' : '/brand/application-status'}
                      className={styles.roleLink}
                    >
                      <span className={styles.roleBadge}>Brand Portal</span>
                    </Link>
                  ) : null}

                  <span className={styles.userGreeting}>
                    Hi, {user?.firstName || 'Customer'}
                  </span>

                  <button
                    onClick={() => logout()}
                    className={styles.signOutBtn}
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" className={styles.loginBtn} id="nav-login-btn">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Sign In</span>
                </Link>
              )}

              {/* Shopping Bag */}
              <Link href="/cart" className={styles.cartButton} id="nav-cart-link" aria-label="Shopping Bag">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className={styles.cartLabel}>Bag</span>
                <span className={styles.cartBadge}>{totalCount}</span>
              </Link>

              {/* Mobile Drawer Hamburger */}
              <button
                className={styles.mobileHamburger}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuInner}>
            <div className={styles.mobileMenuHeader}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="Makora Home">
                <Image
                  src="/images/logo.png"
                  alt="MAKORA - Discover Beauty. Explore Brands."
                  width={150}
                  height={95}
                  className={styles.mobileLogoImg}
                />
              </Link>
            </div>
            <form onSubmit={handleSearchSubmit} className={styles.mobileSearch}>
              <input
                type="text"
                placeholder="Search beauty products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.mobileSearchInput}
              />
              <button type="submit" className={styles.mobileSearchBtn}>
                Search
              </button>
            </form>

            <div className={styles.mobileNavLinks}>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                All Formulations
              </Link>
              <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)}>
                Brand Houses Directory
              </Link>
              <Link href="/categories/skincare" onClick={() => setIsMobileMenuOpen(false)}>
                Skincare
              </Link>
              <Link href="/categories/makeup" onClick={() => setIsMobileMenuOpen(false)}>
                Artisanal Makeup
              </Link>
              <Link href="/categories/fragrance" onClick={() => setIsMobileMenuOpen(false)}>
                Niche Fragrances
              </Link>
              <Link href="/categories/haircare" onClick={() => setIsMobileMenuOpen(false)}>
                Botanical Haircare
              </Link>
              <Link href="/brand/register" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--luxe-wine)', fontWeight: 800 }}>
                + Open Your Storefront on Makaura
              </Link>
            </div>

            <div className={styles.mobileFooterActions}>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={styles.mobileAuthBtn}
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className={styles.mobileAuthBtn}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In to Makaura
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
