'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../../components/admin/AdminShell';
import {
  getAdminMarketplaceStatsAction,
  listAdminBrandsAction,
  updateAdminBrandStatusAction,
  listAdminAllOrdersAction,
  updateAdminOrderStatusAction,
  AdminBrandItem,
  AdminStatsData,
  AdminPlatformOrder,
} from '../../../lib/supabase/actions';
import styles from './admin-dashboard.module.css';

const COURIER_OPTIONS = [
  'Trax Logistics',
  'TCS Express',
  'Leopards Courier',
  'Call Courier',
  'PostEx',
  'M&P Courier',
  'Swyft Logistics',
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [brands, setBrands] = useState<AdminBrandItem[]>([]);
  const [orders, setOrders] = useState<AdminPlatformOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBrandId, setUpdatingBrandId] = useState<string | null>(null);

  // Dispatch Modal state
  const [dispatchOrder, setDispatchOrder] = useState<AdminPlatformOrder | null>(null);
  const [selectedCourier, setSelectedCourier] = useState('Trax Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<any>('DISPATCHED');
  const [codStatus, setCodStatus] = useState<any>('PENDING');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, brandsRes, ordersRes] = await Promise.all([
        getAdminMarketplaceStatsAction(),
        listAdminBrandsAction(),
        listAdminAllOrdersAction(),
      ]);

      if (statsRes.ok) setStats(statsRes.data);
      if (brandsRes.ok) setBrands(brandsRes.data.items);
      if (ordersRes.ok) setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleBrandStatus = async (brandId: string, currentStatus: string) => {
    setUpdatingBrandId(brandId);
    try {
      const targetStatus = currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
      const res = await updateAdminBrandStatusAction(brandId, targetStatus);
      if (res.ok) {
        setBrands((prev) =>
          prev.map((b) => (b.id === brandId ? { ...b, status: targetStatus } : b))
        );
        const statsRes = await getAdminMarketplaceStatsAction();
        if (statsRes.ok) setStats(statsRes.data);
      } else {
        alert(res.error || 'Failed to update brand status.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating brand status.');
    } finally {
      setUpdatingBrandId(null);
    }
  };

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
        // refresh stats
        const statsRes = await getAdminMarketplaceStatsAction();
        if (statsRes.ok) setStats(statsRes.data);
      } else {
        alert(res.error || 'Failed to update order fulfillment.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving dispatch.');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  return (
    <AdminShell pendingCount={stats?.pendingApplications}>
      <div className={styles.container}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Master Marketplace Console</h1>
            <p className={styles.pageSubtitle}>
              Platform governance, central order fulfillment, brand directory, and payment management.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/admin/orders" className={styles.actionBtnGold}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Central Orders Ledger</span>
            </Link>
            <Link
              href="/admin/brands"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #c9cccf',
                color: '#202223',
                fontWeight: 600,
                fontSize: '0.8125rem',
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Manage Brands</span>
            </Link>
          </div>
        </div>

        {/* Pending Applications Alert Banner */}
        {stats && stats.pendingApplications > 0 && (
          <div className={styles.alertCard}>
            <div className={styles.alertContent}>
              <div className={styles.alertIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <p className={styles.alertTitle}>
                  {stats.pendingApplications} Brand Registration Application{stats.pendingApplications > 1 ? 's' : ''} Awaiting Review
                </p>
                <p className={styles.alertDesc}>
                  New cosmetic and fashion houses have submitted compliance documents for official marketplace registration.
                </p>
              </div>
            </div>
            <Link href="/admin/brands/applications" className={styles.alertLink}>
              Review Queue →
            </Link>
          </div>
        )}

        {/* KPIs Grid (5 Pillars) */}
        <div className={styles.kpiGrid}>
          {/* 1. Orders to Dispatch */}
          <div className={styles.kpiCard} style={{ borderColor: stats && stats.pendingDispatchCount > 0 ? '#008060' : undefined }}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Orders to Dispatch</span>
              <div className={styles.kpiIconBox} style={{ color: '#008060' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue} style={{ color: '#008060' }}>
              {stats ? stats.pendingDispatchCount : '—'}
            </h3>
            <span className={styles.kpiMeta}>
              <Link href="/admin/orders" style={{ color: '#202223', textDecoration: 'underline' }}>
                Needs courier booking
              </Link>
            </span>
          </div>

          {/* 2. Registered Brands */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Active Brands</span>
              <div className={styles.kpiIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 7v14M21 7v14M6 21V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue}>{stats ? stats.activeBrands : '—'}</h3>
            <span className={styles.kpiMeta}>
              <strong style={{ color: '#108043' }}>{stats?.totalBrands || 0} total</strong> registered
            </span>
          </div>

          {/* 3. Applications Queue */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Applications</span>
              <div className={styles.kpiIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue}>{stats ? stats.pendingApplications : '—'}</h3>
            <span className={styles.kpiMeta}>
              <Link href="/admin/brands/applications" style={{ color: '#202223', textDecoration: 'underline' }}>
                Awaiting approval
              </Link>
            </span>
          </div>

          {/* 4. Payment Gateways */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Payment Gateways</span>
              <div className={styles.kpiIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue}>{stats ? `${stats.paymentMethodsActive} Active` : '—'}</h3>
            <span className={styles.kpiMeta}>
              <Link href="/admin/payments" style={{ color: '#202223', textDecoration: 'underline' }}>
                COD, Raast, PayFast
              </Link>
            </span>
          </div>

          {/* 5. Gross Marketplace Volume */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Gross Sales</span>
              <div className={styles.kpiIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue}>
              Rs. {stats ? (stats.grossMarketplaceVolume || 0).toLocaleString() : '—'}
            </h3>
            <span className={styles.kpiMeta}>Across {orders.length} orders</span>
          </div>
        </div>

        {/* SECTION 1: INCOMING ORDERS AWAITING CENTRAL DISPATCH (Core Feature) */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📦 Incoming Orders for Central Dispatch</span>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#e4f8ec', color: '#108043', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                  Makaura Logistics Fulfillment
                </span>
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#6d7175' }}>
                Orders placed from all independent stores. Makaura Central Hub dispatches parcels directly to customers.
              </p>
            </div>
            <Link href="/admin/orders" className={styles.viewAllLink}>
              <span>View All Orders Ledger ({orders.length})</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
              Loading platform orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
              No orders placed yet. Orders will appear here in real-time as customers checkout.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Order Reference</th>
                  <th className={styles.th}>Origin Store & Store Owner</th>
                  <th className={styles.th}>Customer & City</th>
                  <th className={styles.th}>Total (PKR)</th>
                  <th className={styles.th}>Fulfillment Status</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Central Dispatch Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className={styles.tr}>
                    {/* Order Reference */}
                    <td className={styles.td}>
                      <span style={{ fontWeight: 600, color: '#111213' }}>{ord.orderNumber}</span>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#6d7175' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Store Name & Store Owner Name (Highlights origin) */}
                    <td className={styles.td}>
                      <div className={styles.storeBadgeCell}>
                        <div className={styles.storeBadge}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18M3 7v14M21 7v14M6 21V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
                          </svg>
                          <span>Store: {ord.brandName}</span>
                        </div>
                        <div className={styles.storeOwnerText}>
                          👤 Owner: <strong>{ord.storeOwnerName}</strong>
                        </div>
                        <div className={styles.ownerEmailMuted}>{ord.storeOwnerEmail}</div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className={styles.td}>
                      <p style={{ margin: 0, fontWeight: 500, color: '#111213' }}>{ord.customerName}</p>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#6d7175' }}>
                        📍 {ord.city}
                      </p>
                    </td>

                    {/* Total & Payment */}
                    <td className={styles.td}>
                      <span style={{ fontWeight: 700, color: '#111213' }}>
                        Rs. {ord.total.toLocaleString()}
                      </span>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#6d7175' }}>
                        {ord.paymentMethod}
                      </p>
                    </td>

                    {/* Status */}
                    <td className={styles.td}>
                      {ord.fulfillmentStatus === 'DELIVERED' || ord.fulfillmentStatus === 'FULFILLED' ? (
                        <span className={styles.badgeApproved}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#108043' }} />
                          Delivered
                        </span>
                      ) : ord.fulfillmentStatus === 'DISPATCHED' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, backgroundColor: '#e4f8ec', color: '#108043' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#108043' }} />
                          Dispatched ({ord.courierName?.split(' ')[0] || 'Courier'})
                        </span>
                      ) : ord.fulfillmentStatus === 'PROCESSING' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, backgroundColor: '#fff4e5', color: '#b95000' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b95000' }} />
                          Packing at Hub
                        </span>
                      ) : (
                        <span className={styles.badgePending}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b95000' }} />
                          Awaiting Dispatch
                        </span>
                      )}
                    </td>

                    {/* Action (Master Admin Full Control) */}
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openDispatchModal(ord)}
                        className={styles.btnDispatch}
                        title="Master Admin Fulfillment Controls"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

        {/* SECTION 2: REGISTERED BRANDS MANAGEMENT */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Marketplace Brand Directory</h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#8b949e' }}>
                All registered brands whose products are sold and dispatched on Makaura.
              </p>
            </div>
            <Link href="/admin/brands" className={styles.viewAllLink}>
              <span>View Full Directory ({brands.length})</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Brand Identity</th>
                <th className={styles.th}>Store Owner</th>
                <th className={styles.th}>Commission</th>
                <th className={styles.th}>Public Status</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Admin Governance</th>
              </tr>
            </thead>
            <tbody>
              {brands.slice(0, 5).map((brand) => (
                <tr key={brand.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.brandCell}>
                      <img
                        src={
                          brand.logoUrl ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
                        }
                        alt={brand.name}
                        className={styles.brandAvatar}
                      />
                      <div>
                        <p className={styles.brandName}>{brand.name}</p>
                        <p className={styles.brandSlug}>/brands/{brand.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className={styles.td}>
                    <p style={{ margin: 0, fontWeight: 500, color: '#111213', fontSize: '0.84rem' }}>
                      {brand.owner?.firstName} {brand.owner?.lastName || ''}
                    </p>
                    <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#6d7175' }}>
                      {brand.owner?.email || 'Registered Brand'}
                    </p>
                  </td>

                  <td className={styles.td}>
                    <span style={{ fontWeight: 600, color: '#111213' }}>
                      {brand.commissionRate}%
                    </span>
                  </td>

                  <td className={styles.td}>
                    {brand.status === 'APPROVED' ? (
                      <span className={styles.badgeApproved}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#108043' }} />
                        Active (Live)
                      </span>
                    ) : brand.status === 'SUSPENDED' ? (
                      <span className={styles.badgeSuspended}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d72c0d' }} />
                        Suspended
                      </span>
                    ) : (
                      <span className={styles.badgePending}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b95000' }} />
                        {brand.status}
                      </span>
                    )}
                  </td>

                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup} style={{ justifyContent: 'flex-end' }}>
                      {brand.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleToggleBrandStatus(brand.id, brand.status)}
                          disabled={updatingBrandId === brand.id}
                          className={styles.btnActionSuspend}
                          title="Temporarily remove this brand from public storefront"
                        >
                          {updatingBrandId === brand.id ? 'Updating...' : 'Suspend'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleBrandStatus(brand.id, brand.status)}
                          disabled={updatingBrandId === brand.id}
                          className={styles.btnActionKeep}
                          title="Keep/Activate brand live on marketplace"
                        >
                          {updatingBrandId === brand.id ? 'Updating...' : 'Keep (Activate)'}
                        </button>
                      )}

                      <Link
                        href={`/brands/${brand.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnActionOutline}
                      >
                        Storefront ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DISPATCH ORDER MODAL (Master Admin Full Control) */}
        {dispatchOrder && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <h3 className={styles.modalTitle}>Central Fulfillment & Dispatch</h3>
              <p className={styles.modalSubtitle}>
                Order <strong>{dispatchOrder.orderNumber}</strong> from Store: <strong>{dispatchOrder.brandName}</strong> (Owner: {dispatchOrder.storeOwnerName})
              </p>

              <div className={styles.modalSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#6d7175' }}>Recipient:</span>
                  <strong style={{ color: '#111213' }}>{dispatchOrder.customerName} ({dispatchOrder.customerPhone || 'N/A'})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#6d7175' }}>Delivery Address:</span>
                  <span style={{ color: '#111213', textAlign: 'right', maxWidth: 280 }}>
                    {dispatchOrder.shippingAddress || 'N/A'}, {dispatchOrder.city}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#6d7175' }}>Total Amount:</span>
                  <strong style={{ color: '#111213' }}>Rs. {dispatchOrder.total.toLocaleString()} ({dispatchOrder.paymentMethod})</strong>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Assigned Courier Partner</label>
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
                  <label className={styles.formLabel}>Courier Tracking / Airway Bill (AWB) #</label>
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
                  <label className={styles.formLabel}>Dispatch Status</label>
                  <select
                    className={styles.formSelect}
                    value={fulfillmentStatus}
                    onChange={(e: any) => setFulfillmentStatus(e.target.value)}
                  >
                    <option value="PENDING">Pending Dispatch</option>
                    <option value="PROCESSING">Processing / Packing at Hub</option>
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
