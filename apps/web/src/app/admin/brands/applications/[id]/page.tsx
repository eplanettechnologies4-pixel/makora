'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext';
import { apiRequest } from '../../../../../lib/api';
import styles from './admin-app-detail.module.css';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const id = params?.id as string;
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State
  const [modalType, setModalType] = useState<
    'APPROVE' | 'REJECT' | 'NEEDS_MORE_INFORMATION' | 'UNDER_REVIEW' | null
  >(null);
  const [modalInput, setModalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApplication = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiRequest(`/admin/brand-applications/${id}`);
      setApp(res.data || res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load application details.');
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
      } else if (id) {
        fetchApplication();
      }
    }
  }, [user, authLoading, id]);

  const handleAction = async () => {
    if (!modalType) return;

    if (modalType === 'REJECT' && !modalInput.trim()) {
      alert('A rejection reason is required.');
      return;
    }

    if (modalType === 'NEEDS_MORE_INFORMATION' && !modalInput.trim()) {
      alert('Please specify the information requested from the brand owner.');
      return;
    }

    setIsProcessing(true);

    try {
      const payload: any = { status: modalType };
      if (modalType === 'REJECT') {
        payload.rejectionReason = modalInput.trim();
      } else if (modalType === 'NEEDS_MORE_INFORMATION') {
        payload.additionalInfoRequest = modalInput.trim();
      }

      await apiRequest(`/admin/brand-applications/${id}/status`, {
        method: 'PATCH',
        data: payload,
      });

      setModalType(null);
      setModalInput('');
      await fetchApplication();
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading application details...</div>;
  }

  if (errorMessage || !app) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p style={{ color: 'var(--status-error-text)', marginBottom: '1rem' }}>
            {errorMessage || 'Application not found.'}
          </p>
          <Link href="/admin/brands/applications" className={styles.backLink}>
            ← Back to Applications Queue
          </Link>
        </div>
      </div>
    );
  }

  const { brand, applicant, auditLogs, status } = app;
  const bankAccount = brand?.bankAccounts?.[0];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/admin/brands/applications" className={styles.backLink}>
          ← Back to Applications Queue
        </Link>

        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>{brand?.name}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Application Ref: MAK-{app.id.substring(0, 8).toUpperCase()} • Submitted on {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Controls Card */}
        <div className={styles.actionBar}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusLabel}>Current State:</span>
            <span
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.875rem',
                background:
                  status === 'APPROVED'
                    ? '#F6FFED'
                    : status === 'REJECTED'
                    ? '#FFF1F0'
                    : '#FFFBE6',
                color:
                  status === 'APPROVED'
                    ? '#389E0D'
                    : status === 'REJECTED'
                    ? '#CF1322'
                    : '#D48806',
                border: '1px solid currentColor',
              }}
              id="admin-current-status-badge"
            >
              {status}
            </span>
          </div>

          <div className={styles.actionButtons}>
            {status !== 'UNDER_REVIEW' && status !== 'APPROVED' && (
              <button
                className={styles.btnUnderReview}
                onClick={() => {
                  setModalType('UNDER_REVIEW');
                  setModalInput('');
                }}
                id="btn-move-under-review"
              >
                Mark Under Review
              </button>
            )}

            {status !== 'APPROVED' && (
              <button
                className={styles.btnApprove}
                onClick={() => {
                  setModalType('APPROVE');
                  setModalInput('');
                }}
                id="btn-approve-brand"
              >
                Approve Brand
              </button>
            )}

            {status !== 'NEEDS_MORE_INFORMATION' && status !== 'APPROVED' && (
              <button
                className={styles.btnRequestInfo}
                onClick={() => {
                  setModalType('NEEDS_MORE_INFORMATION');
                  setModalInput('');
                }}
                id="btn-request-more-info"
              >
                Request More Info
              </button>
            )}

            {status !== 'REJECTED' && (
              <button
                className={styles.btnReject}
                onClick={() => {
                  setModalType('REJECT');
                  setModalInput('');
                }}
                id="btn-reject-brand"
              >
                Reject Application
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className={styles.detailGrid}>
          <div>
            {/* Brand Profile Information */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Brand Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Brand Name</span>
                  <span className={styles.infoVal}>{brand?.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Handle Slug</span>
                  <span className={styles.infoVal}>@{brand?.slug}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Business Type</span>
                  <span className={styles.infoVal}>{brand?.businessType}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Operating City</span>
                  <span className={styles.infoVal}>{brand?.city}, {brand?.country}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Website</span>
                  <span className={styles.infoVal}>
                    {brand?.websiteUrl ? (
                      <a href={brand.websiteUrl} target="_blank" rel="noreferrer">
                        {brand.websiteUrl}
                      </a>
                    ) : (
                      'None'
                    )}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>SECP / Registration No</span>
                  <span className={styles.infoVal}>{brand?.businessRegNumber || 'Not provided'}</span>
                </div>
              </div>

              {brand?.description && (
                <div style={{ marginTop: '1.25rem' }}>
                  <span className={styles.infoLabel}>Brand Description & Ethos</span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {brand.description}
                  </p>
                </div>
              )}
            </div>

            {/* Banking Details with Appropriate Masking */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Banking & Settlement Data</h2>
              <div style={{ background: '#FAF8F5', borderLeft: '3px solid var(--accent-gold)', padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <strong>Masked Financial Fields:</strong> In accordance with Makaura Phase 2 security protocols, bank account numbers and IBANs are encrypted at rest with AES-256-GCM. Below are the authorized masked review fields.
              </div>

              {bankAccount ? (
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Bank Name</span>
                    <span className={styles.infoVal}>{bankAccount.bankName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Account Title</span>
                    <span className={styles.infoVal}>{bankAccount.accountHolderName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Masked Account</span>
                    <span className={`${styles.infoVal} ${styles.maskedBadge}`}>
                      {bankAccount.accountNumberMasked || '****'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Masked IBAN</span>
                    <span className={`${styles.infoVal} ${styles.maskedBadge}`}>
                      {bankAccount.ibanMasked || 'None'}
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No bank account attached.</p>
              )}
            </div>
          </div>

          <div>
            {/* Applicant Information */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Founder / Applicant</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span className={styles.infoLabel}>Full Name</span>
                  <div className={styles.infoVal}>
                    {applicant?.firstName} {applicant?.lastName}
                  </div>
                </div>
                <div>
                  <span className={styles.infoLabel}>Email</span>
                  <div className={styles.infoVal}>{applicant?.email}</div>
                </div>
                <div>
                  <span className={styles.infoLabel}>Phone</span>
                  <div className={styles.infoVal}>{applicant?.phone || 'Not provided'}</div>
                </div>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Audit Trail</h2>
              {auditLogs && auditLogs.length > 0 ? (
                <div className={styles.timeline}>
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className={styles.timelineEvent}>
                      <div className={styles.eventAction}>{log.action}</div>
                      <div className={styles.eventMeta}>
                        {new Date(log.createdAt).toLocaleString()}
                        {log.user ? ` • by ${log.user.email}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  No historical audit entries.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Dialog for Admin Actions */}
        {modalType && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>
                {modalType === 'APPROVE' && 'Approve Brand Application'}
                {modalType === 'REJECT' && 'Reject Brand Application'}
                {modalType === 'NEEDS_MORE_INFORMATION' && 'Request Additional Information'}
                {modalType === 'UNDER_REVIEW' && 'Move Application to Under Review'}
              </h3>

              <p className={styles.modalDesc}>
                {modalType === 'APPROVE' &&
                  `Are you sure you want to approve "${brand?.name}"? The brand owner will be granted active dashboard privileges.`}
                {modalType === 'REJECT' &&
                  `Please specify the mandatory reason for rejecting "${brand?.name}". This message will be displayed to the applicant.`}
                {modalType === 'NEEDS_MORE_INFORMATION' &&
                  `Specify the exact missing credentials, documents, or details required from "${brand?.name}".`}
                {modalType === 'UNDER_REVIEW' &&
                  `Mark "${brand?.name}" as under active compliance review.`}
              </p>

              {(modalType === 'REJECT' || modalType === 'NEEDS_MORE_INFORMATION') && (
                <textarea
                  className={styles.modalTextarea}
                  placeholder={
                    modalType === 'REJECT'
                      ? 'State the reason for rejection (mandatory)...'
                      : 'Describe the missing information needed (mandatory)...'
                  }
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  id="modal-input-reason"
                  required
                />
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setModalType(null)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className={
                    modalType === 'APPROVE'
                      ? styles.btnApprove
                      : modalType === 'REJECT'
                      ? styles.btnReject
                      : modalType === 'NEEDS_MORE_INFORMATION'
                      ? styles.btnRequestInfo
                      : styles.btnUnderReview
                  }
                  onClick={handleAction}
                  disabled={isProcessing}
                  id="confirm-modal-action-btn"
                >
                  {isProcessing
                    ? 'Processing...'
                    : modalType === 'APPROVE'
                    ? 'Confirm Approval'
                    : modalType === 'REJECT'
                    ? 'Confirm Rejection'
                    : modalType === 'NEEDS_MORE_INFORMATION'
                    ? 'Send Request'
                    : 'Update to Under Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
