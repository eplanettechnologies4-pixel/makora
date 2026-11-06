'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import styles from './checkout.module.css';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Mirpur (AJK)',
  'Other City',
];

interface OrderConfirmationData {
  orderId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  total: number;
  itemsCount: number;
  deliveryMethod: string;
}

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, totalCount, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmed order state
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);

    const generatedId = `MAK-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData: OrderConfirmationData = {
      orderId: generatedId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'Not specified',
      address: address.trim(),
      city,
      total,
      itemsCount: totalCount,
      deliveryMethod: '100% Cash on Delivery (COD)',
    };

    setTimeout(() => {
      setConfirmedOrder(orderData);
      clearCart();
      setIsSubmitting(false);
    }, 800);
  };

  // 1. If an order was placed, display the confirmed order screen
  if (confirmedOrder) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.confirmCard}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Link href="/" aria-label="Makora Home">
                <Image
                  src="/images/logo.png"
                  alt="MAKORA - Discover Beauty. Explore Brands."
                  width={150}
                  height={95}
                  style={{ height: '56px', width: 'auto', margin: '0 auto', display: 'block' }}
                  priority
                />
              </Link>
            </div>

            <div className={styles.confirmIconBox}>
              <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className={styles.confirmHeading}>Order Confirmed!</h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '16px' }}>
              Your order has been forwarded to our verified independent beauty formulators.
            </p>

            <div className={styles.orderRefPill}>
              ORDER REFERENCE: {confirmedOrder.orderId}
            </div>

            <div className={styles.confirmDetailsBox}>
              <div className={styles.confirmDetailRow}>
                <span>Recipient:</span>
                <strong>{confirmedOrder.fullName}</strong>
              </div>
              <div className={styles.confirmDetailRow}>
                <span>Phone (Delivery SMS/Call):</span>
                <strong>{confirmedOrder.phone}</strong>
              </div>
              <div className={styles.confirmDetailRow}>
                <span>Delivery Address:</span>
                <strong>{confirmedOrder.address}, {confirmedOrder.city}</strong>
              </div>
              <div className={styles.confirmDetailRow}>
                <span>Payment Mode:</span>
                <strong style={{ color: '#059669' }}>Cash on Delivery (COD)</strong>
              </div>
              <div className={styles.confirmDetailRow}>
                <span>Total Amount to Pay:</span>
                <strong style={{ color: '#6B1D3D', fontSize: '1.05rem' }}>
                  PKR {confirmedOrder.total.toLocaleString()}
                </strong>
              </div>
              <div className={styles.confirmDetailRow}>
                <span>Estimated Delivery:</span>
                <strong>2–4 Business Days via TCS / Leopard Express</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/"
                className="btn btn-primary"
                style={{
                  backgroundColor: '#6B1D3D',
                  color: '#FFFFFF',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                }}
              >
                Return to Storefront
              </Link>
              <Link
                href="/shop"
                className="btn"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid var(--border-light)',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                }}
              >
                Explore More Formulations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. If Cart is Empty
  if (items.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.formCard} style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '580px', margin: '40px auto' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FAF6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#6B1D3D' }}>
              <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>
              Your Bag is Empty
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: '24px' }}>
              Please add your desired beauty formulations to your bag before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="btn btn-primary"
              style={{
                backgroundColor: '#6B1D3D',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 800,
              }}
            >
              Discover Formulations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Normal Checkout Flow
  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb Navigation">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/cart">Bag</Link>
          <span>/</span>
          <span>Checkout</span>
        </nav>

        <h1 className={styles.title}>Secure Checkout</h1>

        <form onSubmit={handlePlaceOrder} className={styles.layout}>
          {/* Left Column: Delivery Form & Payment Method */}
          <div className={styles.formCard}>
            {/* Step 1: Delivery Information */}
            <div className={styles.sectionHeader}>
              <span className={styles.stepNumber}>1</span>
              <h2 className={styles.sectionTitle}>Delivery Information</h2>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maryam Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.fieldInput}
                  id="checkout-input-name"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.fieldInput}
                  id="checkout-input-phone"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email Address (For Order Tracking)</label>
                <input
                  type="email"
                  placeholder="maryam@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.fieldInput}
                  id="checkout-input-email"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.fieldSelect}
                  id="checkout-select-city"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>Complete Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House/Apartment #, Street, Block, Sector, Colony"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.fieldInput}
                  id="checkout-input-address"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Postal / Zip Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 54000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={styles.fieldInput}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Delivery Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Special instructions for courier"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className={styles.sectionHeader}>
              <span className={styles.stepNumber}>2</span>
              <h2 className={styles.sectionTitle}>Payment Method</h2>
            </div>

            <div className={styles.paymentCard}>
              <div className={styles.paymentHeader}>
                <div className={styles.paymentRadioGroup}>
                  <input
                    type="radio"
                    id="payment-cod"
                    name="paymentMethod"
                    checked
                    readOnly
                    className={styles.paymentRadio}
                  />
                  <label htmlFor="payment-cod" className={styles.paymentName}>
                    Cash on Delivery (COD)
                  </label>
                </div>
                <span className={styles.paymentBadge}>100% Guaranteed</span>
              </div>
              <p className={styles.paymentDesc}>
                Pay in cash directly to the courier rider upon parcel delivery. You may inspect the package exterior prior to hand-off. Zero advance deposit required.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryHeading}>Your Bag ({totalCount})</h2>

            <div className={styles.itemsList}>
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.volume || idx}`} className={styles.summaryItem}>
                  <div className={styles.itemThumbFrame}>
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80'}
                      alt={item.name}
                      fill
                      sizes="52px"
                      className={styles.itemThumb}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemBrand}>{item.brandName}</div>
                    <div className={styles.itemTitle}>{item.name}</div>
                    <div className={styles.itemQtyPrice}>
                      {item.volume ? `${item.volume} • ` : ''}Qty: {item.quantity} × PKR {item.price.toLocaleString()}
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.calcRow}>
              <span>Subtotal</span>
              <strong>PKR {subtotal.toLocaleString()}</strong>
            </div>

            <div className={styles.calcRow}>
              <span>Nationwide Shipping</span>
              <strong style={{ color: deliveryFee === 0 ? '#059669' : '#0F172A' }}>
                {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
              </strong>
            </div>

            <div className={styles.calcTotal}>
              <span>Total Payable</span>
              <span style={{ color: '#6B1D3D' }}>PKR {total.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.placeOrderBtn}
              id="btn-place-order"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>CONFIRM CASH ON DELIVERY ORDER</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748B' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>256-bit encrypted checkout with courier COD guarantee</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

