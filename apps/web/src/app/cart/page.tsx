'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryFee, total, totalCount } = useCart();

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Shopping Bag</span>
        </nav>

        <h1 className={styles.title}>Your Luxury Beauty Bag</h1>

        {items.length === 0 ? (
          <div className={styles.itemsCard}>
            <div className={styles.emptyState}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FAF6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#6B1D3D' }}>
                <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>Your Bag is Currently Empty</h2>
              <p className={styles.emptyText}>
                Discover Pakistan&rsquo;s finest independent formulations, artisanal cosmetics, and niche perfumery.
              </p>
              <Link href="/shop" className="btn btn-primary" style={{ backgroundColor: '#6B1D3D', color: '#FFFFFF', padding: '14px 28px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                Explore The Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Items List */}
            <div className={styles.itemsCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Bag Items ({totalCount})
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                  100% Formulator Direct
                </span>
              </div>

              {items.map((item, idx) => (
                <div key={`${item.id}-${item.volume || idx}`} className={styles.itemRow}>
                  <div className={styles.itemImageFrame}>
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80'}
                      alt={item.name}
                      fill
                      sizes="90px"
                      className={styles.itemImg}
                    />
                  </div>

                  <div>
                    <div className={styles.itemBrand}>{item.brandName}</div>
                    <div className={styles.itemName} style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.35 }}>
                      {item.name}
                    </div>
                    {item.volume && (
                      <span style={{ display: 'inline-block', fontSize: '0.74rem', background: '#F1EFEA', color: '#52525B', padding: '2px 8px', borderRadius: '9999px', margin: '4px 0 8px', fontWeight: 700 }}>
                        Size: {item.volume}
                      </span>
                    )}
                    <div className={styles.itemPrice}>
                      PKR {item.price.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px' }}>
                    {/* Quantity Selector */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '9999px', background: '#F8FAFC', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.volume)}
                        style={{ width: '30px', height: '30px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ width: '28px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800 }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.volume)}
                        style={{ width: '30px', height: '30px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.volume)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.06em' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                    >
                      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal ({totalCount} items)</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>PKR {subtotal.toLocaleString()}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Nationwide Shipping</span>
                <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#059669' : '#0F172A' }}>
                  {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                </span>
              </div>

              {subtotal < 3500 && (
                <div style={{ fontSize: '0.76rem', color: '#6B1D3D', background: '#FBF0F4', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', fontWeight: 600 }}>
                  Add PKR {(3500 - subtotal).toLocaleString()} more for Free Express Delivery.
                </div>
              )}

              <div className={styles.totalRow}>
                <span>Estimated Total</span>
                <span style={{ color: '#6B1D3D' }}>PKR {total.toLocaleString()}</span>
              </div>

              <div className={styles.codBadge}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#C5A880' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>
                  <strong>Cash on Delivery (COD)</strong> nationwide. Inspect parcel before payment.
                </span>
              </div>

              <Link
                href="/checkout"
                className={styles.checkoutBtn}
                id="btn-cart-proceed-checkout"
                style={{ background: '#060911', borderRadius: '9999px', padding: '16px 24px', fontWeight: 800 }}
              >
                <span>PROCEED TO CHECKOUT</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
