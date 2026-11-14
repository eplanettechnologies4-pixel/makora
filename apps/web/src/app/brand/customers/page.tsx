'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyBrandAction,
  getMyBrandCustomersAction,
} from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from './customers.module.css';

export default function BrandCustomersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      Promise.all([getMyBrandAction(), getMyBrandCustomersAction()])
        .then(([bRes, cRes]) => {
          if (!bRes.ok) {
            router.push('/brand/application-status');
            return;
          }
          setBrand(bRes.data);
          if (cRes.ok) setCustomers(cRes.data || []);
          setIsLoading(false);
        })
        .catch(() => {
          router.push('/brand/application-status');
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading customer directory...</p>
      </div>
    );
  }

  const totalCustomers = customers.length;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
  const vipCount = customers.filter((c) => c.tier === 'VIP').length;
  const avgOrderValue =
    totalCustomers > 0 ? Math.round(totalCustomerSpend / customers.reduce((s, c) => s + c.totalOrders, 0)) : 0;

  return (
    <ShopifyShell brand={brand}>
      <div>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Customers Directory</h1>
            <p className={styles.pageSubtitle}>
              View customer profiles, order history, contact info, and lifetime purchase value for your store.
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Total Store Buyers</div>
            <div className={styles.metricValue}>{totalCustomers}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>VIP & Frequent Shoppers</div>
            <div className={styles.metricValue} style={{ color: '#237804' }}>
              {vipCount}
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Total Lifetime Spend</div>
            <div className={styles.metricValue}>
              Rs. {totalCustomerSpend.toLocaleString()}
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Average Basket Value</div>
            <div className={styles.metricValue}>
              Rs. {avgOrderValue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>City</th>
                <th>Total Orders</th>
                <th>Lifetime Value (PKR)</th>
                <th>Customer Tier</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const tierClass =
                  c.tier === 'VIP'
                    ? styles.vipTier
                    : c.tier === 'Regular'
                    ? styles.regularTier
                    : styles.newTier;

                return (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.customerCell}>
                        <div className={styles.customerAvatar}>
                          {c.name.charAt(0)}
                        </div>
                        <div className={styles.customerName}>{c.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.customerContact}>{c.email}</div>
                      <div className={styles.customerContact}>{c.phone}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{c.city}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{c.totalOrders} orders</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        Rs. {c.totalSpend.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.tierPill} ${tierClass}`}>
                        {c.tier} Member
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {c.lastOrderDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ShopifyShell>
  );
}

