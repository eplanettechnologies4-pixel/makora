'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../../components/admin/AdminShell';
import {
  listAdminBrandsAction,
  updateAdminBrandStatusAction,
  updateAdminBrandCommissionAction,
  deleteAdminBrandAction,
  AdminBrandItem,
} from '../../../lib/supabase/actions';
import styles from './admin-brands.module.css';

const STATUS_FILTERS = [
  { key: '', label: 'All Brands' },
  { key: 'APPROVED', label: 'Active (Approved)' },
  { key: 'SUSPENDED', label: 'Suspended (Offline)' },
  { key: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
];

export default function AdminBrandsManagementPage() {
  const [brands, setBrands] = useState<AdminBrandItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyBrandId, setBusyBrandId] = useState<string | null>(null);

  // Edit Commission Modal State
  const [commissionModalBrand, setCommissionModalBrand] = useState<AdminBrandItem | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(15);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await listAdminBrandsAction({
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });

      if (res.ok) {
        setBrands(res.data.items);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBrands();
  };

  // Keep (Activate) or Suspend
  const handleToggleStatus = async (brand: AdminBrandItem) => {
    setBusyBrandId(brand.id);
    try {
      const targetStatus = brand.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
      const res = await updateAdminBrandStatusAction(brand.id, targetStatus);
      if (res.ok) {
        setBrands((prev) =>
          prev.map((b) => (b.id === brand.id ? { ...b, status: targetStatus } : b))
        );
      } else {
        alert(res.error || 'Failed to update brand status.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating brand status.');
    } finally {
      setBusyBrandId(null);
    }
  };

  // Remove Brand
  const handleDeleteBrand = async (brand: AdminBrandItem) => {
    if (
      !confirm(
        `Are you sure you want to remove and deactivate "${brand.name}"? It will be suspended from the marketplace.`
      )
    ) {
      return;
    }

    setBusyBrandId(brand.id);
    try {
      const res = await deleteAdminBrandAction(brand.id);
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== brand.id));
      } else {
        alert(res.error || 'Failed to remove brand.');
      }
    } catch (err: any) {
      alert(err.message || 'Error removing brand.');
    } finally {
      setBusyBrandId(null);
    }
  };

  // Commission Modal
  const openCommissionModal = (brand: AdminBrandItem) => {
    setCommissionModalBrand(brand);
    setNewCommissionRate(brand.commissionRate || 15);
  };

  const handleSaveCommission = async () => {
    if (!commissionModalBrand) return;
    setBusyBrandId(commissionModalBrand.id);
    try {
      const res = await updateAdminBrandCommissionAction(
        commissionModalBrand.id,
        Number(newCommissionRate)
      );
      if (res.ok) {
        setBrands((prev) =>
          prev.map((b) =>
            b.id === commissionModalBrand.id
              ? { ...b, commissionRate: Number(newCommissionRate) }
              : b
          )
        );
        setCommissionModalBrand(null);
      } else {
        alert(res.error || 'Failed to update commission.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating commission.');
    } finally {
      setBusyBrandId(null);
    }
  };

  return (
    <AdminShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Brand Management Directory</h1>
            <p className={styles.pageSubtitle}>
              Oversee all registered brands, keep or suspend storefront visibility, set commission rates, and review compliance.
            </p>
          </div>
          <Link href="/admin/brands/applications" className={styles.tabBtnActive} style={{ padding: '0.65rem 1.25rem', textDecoration: 'none', borderRadius: '6px' }}>
            📥 View Application Requests →
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className={styles.controlsCard}>
          <form onSubmit={handleSearchSubmit} className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search by brand name, slug, city, or owner email..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className={styles.tabBtnActive}
              style={{ borderRadius: '6px', padding: '0 1.25rem', cursor: 'pointer', border: 'none' }}
            >
              Search
            </button>
          </form>

          {/* Status Tabs */}
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

        {/* Table of Brands */}
        <div className={styles.tableCard}>
          {isLoading ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8b949e' }}>
              Loading registered marketplace brands...
            </div>
          ) : brands.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8b949e' }}>
              No brands match the selected filter criteria.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Brand Identity</th>
                  <th className={styles.th}>Owner / Contact</th>
                  <th className={styles.th}>City</th>
                  <th className={styles.th}>Products</th>
                  <th className={styles.th}>Commission</th>
                  <th className={styles.th}>Storefront Status</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Admin Governance</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className={styles.tr}>
                    {/* Brand */}
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

                    {/* Owner */}
                    <td className={styles.td}>
                      <p style={{ margin: 0, fontWeight: 500, color: '#111213', fontSize: '0.84rem' }}>
                        {brand.owner?.firstName} {brand.owner?.lastName || ''}
                      </p>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.74rem', color: '#6d7175' }}>
                        {brand.owner?.email || 'Registered Vendor'}
                      </p>
                    </td>

                    {/* City */}
                    <td className={styles.td}>
                      <span style={{ fontSize: '0.84rem' }}>{brand.city || 'Pakistan'}</span>
                    </td>

                    {/* Products */}
                    <td className={styles.td}>
                      <span style={{ fontWeight: 600, color: '#111213' }}>
                        {brand.productCount} items
                      </span>
                    </td>

                    {/* Commission */}
                    <td className={styles.td}>
                      <button
                        onClick={() => openCommissionModal(brand)}
                        className={styles.commissionTag}
                        title="Click to change commission rate"
                      >
                        <span>{brand.commissionRate}%</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                    </td>

                    {/* Status */}
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

                    {/* Actions */}
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.actionGroup}>
                        {brand.status === 'APPROVED' ? (
                          <button
                            onClick={() => handleToggleStatus(brand)}
                            disabled={busyBrandId === brand.id}
                            className={styles.btnSuspend}
                            title="Suspend: hide brand from public buyer catalog"
                          >
                            {busyBrandId === brand.id ? 'Updating...' : 'Suspend'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(brand)}
                            disabled={busyBrandId === brand.id}
                            className={styles.btnKeep}
                            title="Keep: activate brand live on public storefront"
                          >
                            {busyBrandId === brand.id ? 'Updating...' : 'Keep (Activate)'}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBrand(brand)}
                          disabled={busyBrandId === brand.id}
                          className={styles.btnDelete}
                          title="Remove brand"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>

                        <Link
                          href={`/brands/${brand.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.btnOutline}
                          title="Preview public storefront"
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

        {/* Edit Commission Modal */}
        {commissionModalBrand && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <h3 className={styles.modalTitle}>Set Marketplace Commission</h3>
              <p className={styles.modalDesc}>
                Update platform commission rate for <strong>{commissionModalBrand.name}</strong>. This percentage will be deducted from fulfilled orders.
              </p>

              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.4rem' }}>
                Commission Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                className={styles.modalInput}
                value={newCommissionRate}
                onChange={(e) => setNewCommissionRate(Number(e.target.value))}
              />

              <div className={styles.modalActions}>
                <button
                  onClick={() => setCommissionModalBrand(null)}
                  className={styles.modalBtnCancel}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCommission}
                  disabled={busyBrandId === commissionModalBrand.id}
                  className={styles.modalBtnSave}
                >
                  {busyBrandId === commissionModalBrand.id ? 'Saving...' : 'Update Commission'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

