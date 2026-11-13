'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../../components/admin/AdminShell';
import { listAdminAllOrdersAction, AdminPlatformOrder } from '../../../lib/supabase/actions';
import styles from './admin-orders.module.css';

const STATUS_FILTERS = [
  { key: '', label: 'All Orders' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'DISPATCHED', label: 'Dispatched' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'PENDING', label: 'Pending' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminPlatformOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listAdminAllOrdersAction()
      .then((res) => {
        if (res.ok && res.data) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.error('Failed to load platform orders:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.fulfillmentStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.brandName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const paidCount = orders.filter((o) => o.paymentStatus === 'PAID').length;

  return (
    <AdminShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Platform Orders Ledger</h1>
            <p className={styles.pageSubtitle}>
              Multi-vendor transaction ledger monitoring orders placed across all independent brand storefronts.
            </p>
          </div>
          <Link
            href="/admin/payments"
            className={styles.tabBtnActive}
            style={{ borderRadius: '6px', padding: '0.65rem 1.25rem', textDecoration: 'none' }}
          >
            💳 Payment Methods & Gateway Settings →
          </Link>
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
            <p className={styles.kpiLabel}>Settled (Paid)</p>
            <p className={styles.kpiValue} style={{ color: '#3fb950' }}>
              {paidCount} Orders
            </p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>In Fulfillment</p>
            <p className={styles.kpiValue} style={{ color: '#58a6ff' }}>
              {orders.length - paidCount} Active
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.controlsCard}>
          <div className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search by Order ID, Brand Name, Customer, or City..."
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
                  <th className={styles.th}>Brand</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Location</th>
                  <th className={styles.th}>Payment Method</th>
                  <th className={styles.th}>Payment</th>
                  <th className={styles.th}>Fulfillment</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Total (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{ord.orderNumber}</span>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#8b949e' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className={styles.td}>
                      <Link
                        href={`/brands/${ord.brandSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {ord.brandName} ↗
                      </Link>
                    </td>

                    <td className={styles.td}>
                      <p style={{ margin: 0, fontWeight: 500, color: '#ffffff' }}>{ord.customerName}</p>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#8b949e' }}>
                        {ord.customerEmail}
                      </p>
                    </td>

                    <td className={styles.td}>{ord.city}</td>

                    <td className={styles.td}>
                      <span style={{ fontSize: '0.82rem', color: '#c9d1d9' }}>
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className={styles.td}>
                      {ord.paymentStatus === 'PAID' ? (
                        <span className={styles.badgePaid}>PAID</span>
                      ) : (
                        <span className={styles.badgePending}>PENDING</span>
                      )}
                    </td>

                    <td className={styles.td}>
                      {ord.fulfillmentStatus === 'DELIVERED' || ord.fulfillmentStatus === 'FULFILLED' ? (
                        <span className={styles.badgePaid}>DELIVERED</span>
                      ) : ord.fulfillmentStatus === 'DISPATCHED' ? (
                        <span className={styles.badgeFulfilled}>DISPATCHED</span>
                      ) : ord.fulfillmentStatus === 'PROCESSING' ? (
                        <span className={styles.badgeProcessing}>PROCESSING</span>
                      ) : (
                        <span className={styles.badgePending}>UNFULFILLED</span>
                      )}
                    </td>

                    <td className={styles.td} style={{ textAlign: 'right', fontWeight: 700, color: '#ffffff' }}>
                      Rs. {ord.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

