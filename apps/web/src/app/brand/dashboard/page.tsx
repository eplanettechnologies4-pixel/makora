'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyBrandAction,
  getMyBrandProductsAction,
  getMyBrandOrdersAction,
} from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from '../products/shopify-product.module.css';

export default function BrandDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      if (user.role !== 'BRAND_OWNER' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/brand/register');
        return;
      }

      Promise.all([
        getMyBrandAction(),
        getMyBrandProductsAction(),
        getMyBrandOrdersAction(),
      ])
        .then(([bRes, pRes, oRes]) => {
          if (!bRes.ok) {
            router.push('/brand/application-status');
            return;
          }
          const brandData = bRes.data;
          if (brandData.status !== 'APPROVED') {
            router.push('/brand/application-status');
            return;
          }
          setBrand(brandData);
          if (pRes.ok) setProducts(pRes.data || []);
          if (oRes.ok) setOrders(oRes.data || []);
          setIsLoading(false);
        })
        .catch(() => router.push('/brand/application-status'));
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
        Loading dashboard...
      </div>
    );
  }

  const brandSlug = brand?.slug || user?.brand?.slug || '';
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const unfulfilledOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'PENDING' || o.fulfillmentStatus === 'PROCESSING'
  ).length;

  return (
    <ShopifyShell brand={brand}>
      {/* Top Banner / Welcome */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
          Welcome back, {user?.firstName}
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#6d7175', margin: 0 }}>
          Manage your products, banner, categories, and orders for {brand?.name}.
        </p>
      </div>

      {/* Metric Cards (Shopify KPI style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.card}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6d7175', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Total Sales
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111213' }}>
            Rs. {totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className={styles.card}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6d7175', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Orders to Fulfill
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: unfulfilledOrders > 0 ? '#b95000' : '#111213' }}>
            {unfulfilledOrders}
          </div>
        </div>

        <div className={styles.card}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6d7175', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Products in Catalog
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111213' }}>
            {products.length}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={styles.productGrid}>
        {/* Left: Quick Actions & Recent Orders */}
        <div className={styles.columnMain}>
          {/* Quick Actions (Shopify Setup Checklist) */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Quick Setup & Management</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href="/brand/banner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e1e3e5',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#111213',
                  background: '#fafbfb',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Update Store Banner & Logo</div>
                  <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>Customize the top banner shown on your Makaura brand page</div>
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#008060', fontWeight: 600 }}>Edit banner →</span>
              </Link>

              <Link
                href="/brand/products/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e1e3e5',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#111213',
                  background: '#fafbfb',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Add a New Product</div>
                  <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>Set title, description, price, and upload gallery images</div>
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#008060', fontWeight: 600 }}>Add product →</span>
              </Link>

              <Link
                href="/brand/categories"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e1e3e5',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#111213',
                  background: '#fafbfb',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Manage Categories</div>
                  <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>Organize products into collections for customers to filter</div>
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#008060', fontWeight: 600 }}>Categories →</span>
              </Link>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e1e3e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Recent Orders</h2>
              <Link href="/brand/orders" style={{ fontSize: '0.8125rem', color: '#008060', textDecoration: 'none', fontWeight: 600 }}>
                View all ({orders.length}) →
              </Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5', color: '#6d7175' }}>
                  <th style={{ padding: '0.65rem 1rem' }}>Order</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => {
                  const isFulfilled =
                    order.fulfillmentStatus === 'DISPATCHED' || order.fulfillmentStatus === 'DELIVERED';
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f2f4' }}>
                      <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>
                        <Link href="/brand/orders" style={{ color: '#111213', textDecoration: 'none' }}>
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td style={{ padding: '0.65rem 1rem' }}>{order.customerName}</td>
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
                      <td style={{ padding: '0.65rem 1rem', fontWeight: 600, textAlign: 'right' }}>
                        Rs. {order.total?.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Store summary */}
        <div className={styles.columnSidebar}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Online Store</h2>
            <div style={{
              width: '100%',
              height: '120px',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              border: '1px solid #e1e3e5',
            }}>
              {brand?.bannerUrl ? (
                <img src={brand.bannerUrl} alt="Store Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '100%', background: '#222' }} />
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{brand?.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#6d7175', marginBottom: '1rem' }}>
              makaura.pk/brands/{brandSlug}
            </div>
            <Link
              href={`/brands/${brandSlug}`}
              target="_blank"
              className={styles.btnSecondary}
              style={{ width: '100%', textAlign: 'center', display: 'block' }}
            >
              View Online Store ↗
            </Link>
          </div>
        </div>
      </div>
    </ShopifyShell>
  );
}
