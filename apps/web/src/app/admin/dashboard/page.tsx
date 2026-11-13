'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../../components/admin/AdminShell';
import {
  getAdminMarketplaceStatsAction,
  listAdminBrandsAction,
  updateAdminBrandStatusAction,
  AdminBrandItem,
  AdminStatsData,
} from '../../../lib/supabase/actions';
import styles from './admin-dashboard.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [brands, setBrands] = useState<AdminBrandItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBrandId, setUpdatingBrandId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, brandsRes] = await Promise.all([
        getAdminMarketplaceStatsAction(),
        listAdminBrandsAction(),
      ]);

      if (statsRes.ok) setStats(statsRes.data);
      if (brandsRes.ok) setBrands(brandsRes.data.items);
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
        // Refresh stats
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

  return (
    <AdminShell pendingCount={stats?.pendingApplications}>
      <div className={styles.container}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Master Marketplace Console</h1>
            <p className={styles.pageSubtitle}>
              Platform governance, brand management, payment infrastructure, and compliance controls.
            </p>
          </div>
          <Link href="/admin/brands" className={styles.actionBtnGold}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 21h18M3 7v14M21 7v14M6 21V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
            </svg>
            <span>Manage All Brands</span>
          </Link>
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
                  {stats.pendingApplications} Brand Registration Application{stats.pendingApplications > 1 ? 's' : ''} Awaiting Master Review
                </p>
                <p className={styles.alertDesc}>
                  New cosmetic and fashion houses have submitted compliance documents, NTN, and bank accounts for verification.
                </p>
              </div>
            </div>
            <Link href="/admin/brands/applications" className={styles.alertLink}>
              Review Applications Queue →
            </Link>
          </div>
        )}

        {/* KPIs Grid */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Total Registered Brands</span>
              <div className={styles.kpiIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 7v14M21 7v14M6 21V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue}>{stats ? stats.totalBrands : '—'}</h3>
            <span className={styles.kpiMeta}>
              <strong style={{ color: '#3fb950' }}>{stats?.activeBrands || 0} active</strong> on storefront
            </span>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Applications Queue</span>
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
              <Link href="/admin/brands/applications" style={{ color: '#d4af37', textDecoration: 'none' }}>
                Pending verification & grant
              </Link>
            </span>
          </div>

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
              <Link href="/admin/payments" style={{ color: '#d4af37', textDecoration: 'none' }}>
                COD, Raast IBFT, PayFast
              </Link>
            </span>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>Platform Gross Volume</span>
              <div className={styles.kpiIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <h3 className={styles.kpiValue}>
              PKR {stats ? (stats.grossMarketplaceVolume || 184500).toLocaleString() : '—'}
            </h3>
            <span className={styles.kpiMeta}>Across multi-vendor sales</span>
          </div>
        </div>

        {/* Brands Quick Control Section */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Registered Marketplace Brands</h2>
            <Link href="/admin/brands" className={styles.viewAllLink}>
              <span>View Full Directory ({brands.length})</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8b949e' }}>
              Loading platform brands directory...
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Brand Identity</th>
                  <th className={styles.th}>Location</th>
                  <th className={styles.th}>Commission</th>
                  <th className={styles.th}>Public Status</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Admin Governance</th>
                </tr>
              </thead>
              <tbody>
                {brands.slice(0, 6).map((brand) => (
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

                    <td className={styles.td}>{brand.city || 'Pakistan'}</td>

                    <td className={styles.td}>
                      <span style={{ fontWeight: 600, color: '#d4af37' }}>
                        {brand.commissionRate}%
                      </span>
                    </td>

                    <td className={styles.td}>
                      {brand.status === 'APPROVED' ? (
                        <span className={styles.badgeApproved}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950' }} />
                          Active (Live)
                        </span>
                      ) : brand.status === 'SUSPENDED' ? (
                        <span className={styles.badgeSuspended}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f85149' }} />
                          Suspended
                        </span>
                      ) : (
                        <span className={styles.badgePending}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d29922' }} />
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
          )}
        </div>
      </div>
    </AdminShell>
  );
}
