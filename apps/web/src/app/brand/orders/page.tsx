'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyBrandAction,
  getMyBrandOrdersAction,
  updateSellerOrderStatusAction,
} from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from '../products/shopify-product.module.css';

export default function BrandOrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNFULFILLED' | 'FULFILLED'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fulfillment dialog
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [courierName, setCourierName] = useState('Trax Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');

  const loadData = async () => {
    try {
      const [bRes, oRes] = await Promise.all([
        getMyBrandAction(),
        getMyBrandOrdersAction(),
      ]);

      if (!bRes.ok) {
        router.push('/brand/application-status');
        return;
      }
      setBrand(bRes.data);
      if (oRes.ok) setOrders(oRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }
      loadData();
    }
  }, [user, authLoading, router]);

  const handleOpenFulfill = (order: any) => {
    setSelectedOrder(order);
    setTrackingNumber(`TRX-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setIsFulfilling(true);
  };

  const handleConfirmFulfill = async () => {
    if (!selectedOrder) return;

    const res = await updateSellerOrderStatusAction(selectedOrder.id, {
      fulfillmentStatus: 'DISPATCHED',
      courierName,
      trackingNumber,
    });

    if (res.ok) {
      setIsFulfilling(false);
      await loadData();
      // Update selected order view
      setSelectedOrder((prev: any) => ({
        ...prev,
        fulfillmentStatus: 'DISPATCHED',
        courierName,
        trackingNumber,
      }));
    } else {
      alert(res.error || 'Failed to fulfill order');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
        Loading orders...
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UNFULFILLED') return o.fulfillmentStatus === 'PENDING' || o.fulfillmentStatus === 'PROCESSING';
    return o.fulfillmentStatus === 'DISPATCHED' || o.fulfillmentStatus === 'DELIVERED';
  });

  return (
    <ShopifyShell brand={brand}>
      {/* If an order detail is open, show Shopify Order Detail view! */}
      {selectedOrder ? (
        <div>
          <button
            onClick={() => setSelectedOrder(null)}
            className={styles.backLink}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Orders</span>
          </button>

          <div className={styles.pageHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 className={styles.pageTitle}>{selectedOrder.orderNumber}</h1>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: selectedOrder.fulfillmentStatus === 'DELIVERED' || selectedOrder.fulfillmentStatus === 'DISPATCHED' ? '#e4f8ec' : '#fff4e5',
                color: selectedOrder.fulfillmentStatus === 'DELIVERED' || selectedOrder.fulfillmentStatus === 'DISPATCHED' ? '#108043' : '#b95000',
              }}>
                {selectedOrder.fulfillmentStatus === 'DISPATCHED' || selectedOrder.fulfillmentStatus === 'DELIVERED' ? 'Fulfilled' : 'Unfulfilled'}
              </span>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#f1f2f4',
                color: '#202223',
              }}>
                Cash on Delivery (COD)
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#6d7175' }}>
              Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Two Column Order Grid */}
          <div className={styles.productGrid}>
            {/* Left Column: Items & Payment */}
            <div className={styles.columnMain}>
              {/* Items Card */}
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className={styles.cardTitle} style={{ margin: 0 }}>
                    Items to Fulfill ({selectedOrder.items?.length || 0})
                  </h2>
                  {selectedOrder.fulfillmentStatus === 'PENDING' || selectedOrder.fulfillmentStatus === 'PROCESSING' ? (
                    <button
                      onClick={() => handleOpenFulfill(selectedOrder)}
                      className={styles.btnPrimary}
                    >
                      Fulfill items
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8125rem', color: '#108043', fontWeight: 600 }}>
                      ✓ Dispatched via {selectedOrder.courierName} ({selectedOrder.trackingNumber})
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0',
                        borderBottom: idx !== selectedOrder.items.length - 1 ? '1px solid #f1f2f4' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '48px', height: '56px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #e1e3e5' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>
                            Qty: {item.quantity} • Rs. {item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary Card */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Payment Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6d7175' }}>Subtotal</span>
                    <span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6d7175' }}>Shipping Fee</span>
                    <span>Rs. {selectedOrder.shippingFee || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', paddingTop: '0.5rem', borderTop: '1px solid #e1e3e5' }}>
                    <span>Total to collect at delivery (COD)</span>
                    <span>Rs. {selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Customer Info */}
            <div className={styles.columnSidebar}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Customer</h2>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {selectedOrder.customerName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6d7175', marginBottom: '0.75rem' }}>
                  {selectedOrder.customerEmail}
                </div>

                <div style={{ borderTop: '1px solid #e1e3e5', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <label className={styles.label}>Contact Information</label>
                  <div style={{ fontSize: '0.8125rem' }}>{selectedOrder.customerPhone}</div>
                </div>

                <div style={{ borderTop: '1px solid #e1e3e5', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <label className={styles.label}>Shipping Address</label>
                  <div style={{ fontSize: '0.8125rem', lineHeight: '1.4' }}>
                    {selectedOrder.shippingAddress}
                    <br />
                    <strong>{selectedOrder.city}, Pakistan</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Orders List Table */
        <div>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Orders</h1>
          </div>

          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              padding: '0.5rem 1rem',
              borderBottom: '1px solid #e1e3e5',
              background: '#ffffff',
              gap: '0.5rem',
            }}>
              {(['ALL', 'UNFULFILLED', 'FULFILLED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    border: 'none',
                    background: activeTab === tab ? '#f1f2f4' : 'transparent',
                    color: activeTab === tab ? '#111213' : '#6d7175',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: activeTab === tab ? 600 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5', color: '#6d7175' }}>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Order</th>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Payment</th>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Fulfillment</th>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Items</th>
                  <th style={{ padding: '0.65rem 1rem', fontWeight: 600, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isFulfilled =
                      order.fulfillmentStatus === 'DISPATCHED' || order.fulfillmentStatus === 'DELIVERED';

                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        style={{ borderBottom: '1px solid #f1f2f4', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfb')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: '#111213' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', color: '#6d7175' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 500 }}>
                          {order.customerName}
                          <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>{order.city}</div>
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: '#f1f2f4',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                          }}>
                            COD ({order.codStatus})
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: isFulfilled ? '#e4f8ec' : '#fff4e5',
                            color: isFulfilled ? '#108043' : '#b95000',
                          }}>
                            {isFulfilled ? 'Fulfilled' : 'Unfulfilled'}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem', color: '#6d7175' }}>
                          {order.items?.length || 1} item(s)
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, textAlign: 'right' }}>
                          Rs. {order.total?.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fulfill Modal */}
      {isFulfilling && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '460px',
            padding: '1.5rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              Fulfill items for {selectedOrder?.orderNumber}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#6d7175', margin: '0 0 1rem 0' }}>
              Assign courier and tracking number for Cash on Delivery.
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Shipping Carrier</label>
              <select
                className={styles.select}
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
              >
                <option value="Trax Logistics">Trax Logistics</option>
                <option value="Leopards Courier">Leopards Courier</option>
                <option value="TCS Express">TCS Express</option>
                <option value="PostEx">PostEx</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tracking / Airway Bill Number</label>
              <input
                type="text"
                className={styles.input}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setIsFulfilling(false)}
                className={styles.btnSecondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFulfill}
                className={styles.btnPrimary}
              >
                Fulfill items
              </button>
            </div>
          </div>
        </div>
      )}
    </ShopifyShell>
  );
}
