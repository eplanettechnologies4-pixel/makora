'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { apiRequest } from '../../../../lib/api';
import styles from './admin-apps.module.css';

const STATUS_FILTERS = [
  { key: '', label: 'All Applications' },
  { key: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'NEEDS_MORE_INFORMATION', label: 'Needs More Info' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
];

export default function AdminApplicationsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [applications, setApplications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '10');
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await apiRequest(`/admin/brand-applications?${params.toString()}`);
      const data = res.data || res;

      setApplications(data.items || []);
      setTotal(data.meta?.total || 0);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to retrieve applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/admin/login');
      } else {
        fetchApplications();
      }
    }
  }, [user, authLoading, page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  if (authLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Authenticating administrative session...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Top Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Brand Onboarding Queue</h1>
            <p className={styles.pageSubtitle}>
              Review compliance, business documentation, and approve incoming cosmetic houses.
            </p>
          </div>

          <div className={styles.adminBadge}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{user?.firstName} {user?.lastName} (Admin)</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className={styles.controlsCard}>
          <form onSubmit={handleSearchSubmit} className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search by brand name, founder name, or email..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-search-input"
            />
            <button
              type="submit"
              className={styles.tabBtnActive}
              style={{ borderRadius: '8px', padding: '0 1.5rem', cursor: 'pointer', border: 'none' }}
            >
              Search
            </button>
          </form>

          {/* Status Tabs */}
          <div className={styles.tabList}>
            {STATUS_FILTERS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tabBtn} ${
                  statusFilter === tab.key ? styles.tabBtnActive : ''
                }`}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Applications */}
        <div className={styles.tableCard}>
          {isLoading ? (
            <div className={styles.emptyState}>Loading brand applications...</div>
          ) : errorMessage ? (
            <div className={styles.emptyState} style={{ color: 'var(--status-error-text)' }}>
              {errorMessage}
            </div>
          ) : applications.length === 0 ? (
            <div className={styles.emptyState}>
              No brand applications matching the selected criteria.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Brand</th>
                  <th className={styles.th}>Founder / Owner</th>
                  <th className={styles.th}>Location</th>
                  <th className={styles.th}>Submitted Date</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.brandNameCol}>{app.brand?.name}</div>
                      <div className={styles.brandSlug}>@{app.brand?.slug}</div>
                    </td>
                    <td className={styles.td}>
                      <div>{app.applicant?.firstName} {app.applicant?.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.applicant?.email}
                      </div>
                    </td>
                    <td className={styles.td}>
                      {app.brand?.city || 'Lahore'}, {app.brand?.country || 'Pakistan'}
                    </td>
                    <td className={styles.td}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${styles[`badge${app.status}`]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/brands/applications/${app.id}`}
                        className={styles.viewBtn}
                        id={`view-app-${app.id}`}
                      >
                        Review Application →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className={styles.pagination}>
            <span>
              Showing {applications.length} of {total} total applications
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
