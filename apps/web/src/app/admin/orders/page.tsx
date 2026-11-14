'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../../components/admin/AdminShell';
import {
  listAdminAllOrdersAction,
  updateAdminOrderStatusAction,
  placeCustomerOrderAction,
  AdminPlatformOrder,
} from '../../../lib/supabase/actions';
import styles from './admin-orders.module.css';

const STATUS_FILTERS = [
  { key: '', label: 'All Orders' },
  { key: 'PENDING', label: 'Awaiting Dispatch' },
  { key: 'PROCESSING', label: 'Processing at Hub' },
  { key: 'DISPATCHED', label: 'Dispatched with Courier' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const COURIER_OPTIONS = [
  'Trax Logistics',
  'TCS Express',
  'Leopards Courier',
  'Call Courier',
  'PostEx',
  'M&P Courier',
  'Swyft Logistics',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminPlatformOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Dispatch modal
  const [dispatchOrder, setDispatchOrder] = useState<AdminPlatformOrder | null>(null);
  const [selectedCourier, setSelectedCourier] = useState('Trax Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<any>('DISPATCHED');
  const [codStatus, setCodStatus] = useState<any>('PENDING');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await listAdminAllOrdersAction();
      if (res.ok && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load platform orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDispatchModal = (order: AdminPlatformOrder) => {
    setDispatchOrder(order);
    setSelectedCourier(order.courierName || 'Trax Logistics');
    setTrackingNumber(
      order.trackingNumber || `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`
    );
    setFulfillmentStatus(order.fulfillmentStatus === 'PENDING' ? 'DISPATCHED' : order.fulfillmentStatus);
    setCodStatus(order.paymentStatus === 'PAID' ? 'COLLECTED' : 'PENDING');
  };

  const handleSaveDispatch = async () => {
    if (!dispatchOrder) return;
    setIsUpdatingOrder(true);
    try {
      const res = await updateAdminOrderStatusAction(dispatchOrder.id, {
        fulfillmentStatus,
        codStatus,
        courierName: selectedCourier,
        trackingNumber: trackingNumber.trim(),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === dispatchOrder.id
              ? {
                  ...o,
                  fulfillmentStatus,
                  paymentStatus: codStatus === 'COLLECTED' ? 'PAID' : 'PENDING',
                  courierName: selectedCourier,
                  trackingNumber: trackingNumber.trim(),
                }
              : o
          )
        );
        setDispatchOrder(null);
      } else {
        alert(res.error || 'Failed to update order fulfillment.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving dispatch.');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleSimulateOrder = async () => {
    setIsSimulating(true);
    try {
      const demoStores = [
        { slug: 'adans-libas', name: "Adan's Libas", owner: 'Adan Khan', email: 'store@adanslibas.com', item: 'Scarlet Raw Silk Embroidered Kurta', price: 14850 },
        { slug: 'maison-de-rose', name: 'Maison de Rose', owner: 'Zainab Qureshi', email: 'store@maisonderose.com', item: 'Kashmiri Organic Rose Saffron Serum', price: 8400 },
        { slug: 'aura-scents', name: 'Aura Scents House', owner: 'Bilal Ahmed', email: 'store@aurascents.pk', item: 'Artisanal Cambodian Oud Extrait', price: 24500 },
        { slug: 'noor-artisanal', name: 'Noor Artisanal Cosmetics', owner: 'Noor Fatima', email: 'store@noorcosmetics.com', item: 'Halal Velvet Lip Lacquer Suite', price: 6200 },
      ];
      const selected = demoStores[Math.floor(Math.random() * demoStores.length)];
      const cities = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Rawalpindi', 'Multan'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      const res = await placeCustomerOrderAction({
        brandSlug: selected.slug,
        brandName: selected.name,
        storeOwnerName: selected.owner,
        storeOwnerEmail: selected.email,
        customerName: `Customer ${Math.floor(100 + Math.random() * 900)}`,
        customerEmail: `customer${Math.floor(100 + Math.random() * 900)}@gmail.com`,
        customerPhone: `+92 300 ${Math.floor(1000000 + Math.random() * 9000000)}`,
        shippingAddress: `House ${Math.floor(1 + Math.random() * 99)}, Street ${Math.floor(1 + Math.random() * 20)}, Phase ${Math.floor(1 + Math.random() * 8)}`,
        city: randomCity,
        items: [
          {
            productId: `prod-sim-${Date.now()}`,
            title: selected.item,
            image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
            price: selected.price,
            quantity: 1,
          },
        ],
        subtotal: selected.price,
        shippingFee: 250,
        total: selected.price + 250,
        paymentMethod: 'COD',
      });

      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.fulfillmentStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.brandName.toLowerCase().includes(q) ||
        o.storeOwnerName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const paidCount = orders.filter((o) => o.paymentStatus === 'PAID').length;
  const pendingDispatch = orders.filter(
    (o) => o.fulfillmentStatus === 'PENDING' || o.fulfillmentStatus === 'PROCESSING'
  ).length;

  return (
    <AdminShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Platform Orders Ledger</h1>
            <p className={styles.pageSubtitle}>
              Makaura Central Logistics Console: All orders arrive here with the store owner details for centralized dispatch and delivery.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleSimulateOrder}
              disabled={isSimulating}
              className={styles.btnTestOrder}
              title="Place a simulated order to verify real-time arrival in Master Admin and Store Owner portal"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#008060' }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>{isSimulating ? 'Simulating...' : 'Place Test Order'}</span>
            </button>
            <Link
              href="/admin/payments"
              className={styles.tabBtnActive}
              style={{ borderRadius: '6px', padding: '0.65rem 1.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Payment Settings →</span>
            </Link>
          </div>
        </div>

        {/* KPI Summary */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Total Orders</p>
            <p className={styles.kpiValue}>{orders.length}</p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Gross Sales Volume</p>
            <p className={styles.kpiValue} style={{ color: '#d4af37' }}>
              PKR {totalGMV.toLocaleString()}
            </p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Awaiting Dispatch</p>
            <p className={styles.kpiValue} style={{ color: '#58a6ff' }}>
              {pendingDispatch} Orders
            </p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Settled (Paid)</p>
            <p className={styles.kpiValue} style={{ color: '#3fb950' }}>
              {paidCount} Orders
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.controlsCard}>
          <div className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search by Order ID, Store Name, Store Owner, Customer, or City..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.tabList}>
            {STATUS_FILTERS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tabBtn} ${statusFilter === tab.key ? styles.tabBtnActive : ''}`}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.tableCard}>
          {isLoading ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8b949e' }}>
              Loading platform order ledger...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8b949e' }}>
              No orders found matching the filter criteria.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Order</th>
                  <th className={styles.th}>Origin Store & Store Owner</th>
                  <th className={styles.th}>Customer & Address</th>
                  <th className={styles.th}>Payment</th>
                  <th className={styles.th}>Courier & Tracking</th>
                  <th className={styles.th}>Fulfillment</th>
                  <th className={styles.th}>Total (PKR)</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Admin Control</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className={styles.tr}>
                    {/* Order Reference */}
                    <td className={styles.td}>
                      <span style={{ fontWeight: 600, color: '#111213' }}>{ord.orderNumber}</span>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#6d7175' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Store Name & Store Owner Name (The Core Requirement) */}
                    <td className={styles.td}>
                      <div className={styles.storeBadgeCell}>
                        <Link
                          href={`/brands/${ord.brandSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.storeBadge}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18M3 7v14M21 7v14M6 21V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
                          </svg>
                          <span>Store: {ord.brandName}</span>
                        </Link>
                        <div className={styles.storeOwnerText} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Owner: <strong>{ord.storeOwnerName}</strong></span>
                        </div>
                        <div className={styles.ownerEmailMuted}>{ord.storeOwnerEmail}</div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className={styles.td}>
                      <p style={{ margin: 0, fontWeight: 500, color: '#111213' }}>{ord.customerName}</p>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#6d7175', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{ord.city}</span>
                      </p>
                      {ord.customerPhone && (
                        <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.7rem', color: '#6d7175', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span>{ord.customerPhone}</span>
                        </p>
                      )}
                    </td>

                    {/* Payment */}
                    <td className={styles.td}>
                      <span style={{ fontSize: '0.8rem', color: '#111213', display: 'block', marginBottom: '0.2rem' }}>
                        {ord.paymentMethod}
                      </span>
                      {ord.paymentStatus === 'PAID' ? (
                        <span className={styles.badgePaid}>PAID</span>
                      ) : (
                        <span className={styles.badgePending}>PENDING</span>
                      )}
                    </td>

                    {/* Courier & Tracking */}
                    <td className={styles.td}>
                      {ord.trackingNumber ? (
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111213', display: 'block' }}>
                            {ord.courierName || 'Courier Assigned'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#6d7175', fontFamily: 'monospace' }}>
                            AWB: {ord.trackingNumber}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#8c9196' }}>
                          Not Assigned
                        </span>
                      )}
                    </td>

                    {/* Fulfillment */}
                    <td className={styles.td}>
                      {ord.fulfillmentStatus === 'DELIVERED' || ord.fulfillmentStatus === 'FULFILLED' ? (
                        <span className={styles.badgeApproved}>DELIVERED</span>
                      ) : ord.fulfillmentStatus === 'DISPATCHED' ? (
                        <span className={styles.badgeApproved}>DISPATCHED</span>
                      ) : ord.fulfillmentStatus === 'PROCESSING' ? (
                        <span className={styles.badgePending}>PROCESSING</span>
                      ) : (
                        <span className={styles.badgePending}>AWAITING DISPATCH</span>
                      )}
                    </td>

                    {/* Total */}
                    <td className={styles.td} style={{ fontWeight: 700, color: '#111213' }}>
                      Rs. {ord.total.toLocaleString()}
                    </td>

                    {/* Action: Full Control in Master Admin's Hand */}
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openDispatchModal(ord)}
                        className={styles.btnDispatchAction}
                        title="Manage courier, tracking and dispatch"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="16 16 12 12 8 16" />
                          <line x1="12" y1="12" x2="12" y2="21" />
                          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                        </svg>
                        <span>Dispatch Order</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FULL DISPATCH MODAL */}
        {dispatchOrder && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <h3 className={styles.modalTitle}>Makaura Central Fulfillment Hub</h3>
              <p className={styles.modalSubtitle}>
                Managing dispatch for Order <strong>{dispatchOrder.orderNumber}</strong> from Store: <strong>{dispatchOrder.brandName}</strong> (Owner: {dispatchOrder.storeOwnerName})
              </p>

              <div className={styles.modalSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#6d7175' }}>Recipient:</span>
                  <strong style={{ color: '#111213' }}>{dispatchOrder.customerName} ({dispatchOrder.customerPhone || 'N/A'})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#6d7175' }}>Delivery Address:</span>
                  <span style={{ color: '#111213', textAlign: 'right', maxWidth: 300 }}>
                    {dispatchOrder.shippingAddress || 'N/A'}, {dispatchOrder.city}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#6d7175' }}>Order Total:</span>
                  <strong style={{ color: '#111213' }}>Rs. {dispatchOrder.total.toLocaleString()} ({dispatchOrder.paymentMethod})</strong>
                </div>
              </div>

              {/* Items Preview */}
              {dispatchOrder.items && dispatchOrder.items.length > 0 && (
                <div style={{ marginBottom: '1.25rem', backgroundColor: '#f6f6f7', border: '1px solid #e1e3e5', borderRadius: 8, padding: '0.75rem 1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6d7175', textTransform: 'uppercase' }}>
                    Parcels / Items Ordered:
                  </p>
                  {dispatchOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: idx !== dispatchOrder.items.length - 1 ? '0.5rem' : 0 }}>
                      <img src={it.image} alt={it.title} style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid #e1e3e5' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#111213', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {it.title}
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#6d7175' }}>Qty: {it.quantity} • Rs. {it.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Logistics Courier</label>
                <select
                  className={styles.formSelect}
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.formLabel}>Airway Bill / Tracking Code</label>
                  <button
                    type="button"
                    onClick={() => setTrackingNumber(`TRX-${Math.floor(10000000 + Math.random() * 90000000)}`)}
                    style={{ background: 'none', border: 'none', color: '#008060', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                  >
                    Generate AWB
                  </button>
                </div>
                <input
                  type="text"
                  className={styles.formInput}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. TRX-94810294"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Fulfillment Status</label>
                  <select
                    className={styles.formSelect}
                    value={fulfillmentStatus}
                    onChange={(e: any) => setFulfillmentStatus(e.target.value)}
                  >
                    <option value="PENDING">Pending Dispatch</option>
                    <option value="PROCESSING">Processing at Central Hub</option>
                    <option value="DISPATCHED">Dispatched with Courier</option>
                    <option value="DELIVERED">Delivered to Customer</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>COD Payment Collection</label>
                  <select
                    className={styles.formSelect}
                    value={codStatus}
                    onChange={(e: any) => setCodStatus(e.target.value)}
                  >
                    <option value="PENDING">Cash Collection Pending</option>
                    <option value="COLLECTED">Cash Collected by Courier</option>
                    <option value="REMITTED">Remitted to Store Owner</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setDispatchOrder(null)}
                  className={styles.btnCancel}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDispatch}
                  disabled={isUpdatingOrder}
                  className={styles.btnSubmit}
                >
                  {isUpdatingOrder ? 'Updating...' : 'Save & Dispatch Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
