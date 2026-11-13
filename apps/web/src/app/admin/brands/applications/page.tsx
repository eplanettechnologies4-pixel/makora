'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import {
  listAdminBrandApplicationsAction,
  updateAdminBrandApplicationStatusAction,
} from '../../../../lib/supabase/actions';
import AdminShell from '../../../../components/admin/AdminShell';
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
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await listAdminBrandApplicationsAction({
        page,
        limit: 10,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });

      if (!res.ok) {
        setErrorMessage(res.error || 'Failed to retrieve applications.');
        return;
      }

      setApplications(res.data.items || []);
      setTotal(res.data.meta?.total || 0);
      setTotalPages(res.data.meta?.totalPages || 1);
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

  const handleQuickApprove = async (id: string, brandName: string) => {
    if (!confirm(`Are you sure you want to approve "${brandName}"? This will officially register the brand and activate its store on Makaura.`)) {
      return;
    }

    setApprovingId(id);
    try {
      const res = await updateAdminBrandApplicationStatusAction(id, { status: 'APPROVED' });
      if (res.ok) {
        await fetchApplications();
      } else {
        alert(res.error || 'Failed to approve application.');
      }
    } catch (err: any) {
      alert(err.message || 'Error approving application.');
    } finally {
      setApprovingId(null);
    }
  };

  if (authLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#e6edf3' }}>Authenticating administrative session...</div>;
  }

  return (
    <AdminShell pendingCount={total}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Top Header */}
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.pageTitle}>Brand Onboarding Queue</h1>
              <p className={styles.pageSubtitle}>
                Review incoming brand owner requests, verify SECP/NTN credentials, and approve official registration on Makaura.
              </p>
            </div>

            <Link
              href="/admin/brands"
              className={styles.tabBtnActive}
              style={{ borderRadius: '6px', padding: '0.65rem 1.25rem', textDecoration: 'none' }}
            >
              🏢 Manage Active Brands ({total}) →
            </Link>
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
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleQuickApprove(app.id, app.brand?.name || 'this brand')}
                            disabled={approvingId === app.id}
                            style={{
                              backgroundColor: 'rgba(35, 134, 54, 0.2)',
                              border: '1px solid #3fb950',
                              color: '#3fb950',
                              padding: '0.4rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {approvingId === app.id ? 'Approving...' : '✓ Approve Brand'}
                          </button>
                        )}
                        <Link
                          href={`/admin/brands/applications/${app.id}`}
                          className={styles.viewBtn}
                          id={`view-app-${app.id}`}
                        >
                          Review Dossier →
                        </Link>
                      </div>
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
    </AdminShell>
  );
}
