'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import styles from './status.module.css';

export default function ApplicationStatusPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applicantNotes, setApplicantNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);

  const fetchApplication = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiRequest('/brand-applications/me');
      setApplication(response.data || response);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'No brand application found or you are not logged in.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
      } else {
        fetchApplication();
      }
    }
  }, [user, authLoading]);

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantNotes.trim()) {
      alert('Please provide an explanation or details answering the review team’s request.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update with notes
      await apiRequest('/brand-applications/me', {
        method: 'PATCH',
        data: { applicantNotes: applicantNotes.trim() },
      });

      // 2. Resubmit
      await apiRequest('/brand-applications/me/submit', {
        method: 'POST',
      });

      setResubmitSuccess(true);
      await fetchApplication();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to resubmit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <div className={styles.loadingWrapper}>
              <p>Retrieving your brand application status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={`${styles.card} ${styles.emptyCard}`}>
            <h1 className={styles.title}>No Brand Application Found</h1>
            <p className={styles.statusContentDesc} style={{ marginBottom: '1.5rem' }}>
              We could not find an active or historical brand application linked to your account ({user?.email}).
            </p>
            <Link href="/brand/register" className={styles.dashboardBtn} style={{ maxWidth: '280px', margin: '0 auto' }}>
              Submit Brand Application →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { status, brand, submittedAt, rejectionReason, additionalInfoRequest } = application;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.subheading}>Makaura Brand Partner Portal</span>
            <h1 className={styles.title}>{brand?.name || 'Your Brand'}</h1>
            <div className={styles.brandRef}>
              <span>Ref: MAK-{application.id.substring(0, 8).toUpperCase()}</span>
              <span>•</span>
              <span>Slug: @{brand?.slug}</span>
            </div>
          </div>

          {/* STATUS: PENDING APPROVAL */}
          {status === 'PENDING_APPROVAL' && (
            <div className={`${styles.statusBanner} ${styles.statusPending}`}>
              <div className={styles.statusIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className={styles.statusContentTitle}>Application Pending Review</div>
                <div className={styles.statusContentDesc}>
                  Your brand application has been successfully submitted and is currently in the compliance review queue. The Makaura Vendor Onboarding team is reviewing your business details and credentials.
                </div>
              </div>
            </div>
          )}

          {/* STATUS: UNDER REVIEW */}
          {status === 'UNDER_REVIEW' && (
            <div className={`${styles.statusBanner} ${styles.statusUnderReview}`}>
              <div className={styles.statusIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className={styles.statusContentTitle}>Under Active Review</div>
                <div className={styles.statusContentDesc}>
                  A Makaura compliance officer has been assigned to your application and is actively reviewing your cosmetic portfolio and company registration.
                </div>
              </div>
            </div>
          )}

          {/* STATUS: NEEDS MORE INFORMATION */}
          {status === 'NEEDS_MORE_INFORMATION' && (
            <div className={`${styles.statusBanner} ${styles.statusNeedsInfo}`}>
              <div className={styles.statusIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className={styles.statusContentTitle}>Action Required: Additional Information Requested</div>
                <div className={styles.statusContentDesc}>
                  Our onboarding team requires additional clarification before activating your storefront:
                </div>
                {additionalInfoRequest && (
                  <div className={styles.infoRequestBox}>
                    <strong>Admin Note:</strong> {additionalInfoRequest}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STATUS: APPROVED */}
          {status === 'APPROVED' && (
            <div>
              <div className={`${styles.statusBanner} ${styles.statusApproved}`}>
                <div className={styles.statusIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className={styles.statusContentTitle}>Congratulations! Your Brand is Approved</div>
                  <div className={styles.statusContentDesc}>
                    Your brand application has been fully approved by Makaura Marketplace Administration. You now have full access to your Brand Partner Dashboard!
                  </div>
                </div>
              </div>

              <Link href="/brand/dashboard" className={styles.dashboardBtn} id="enter-dashboard-btn">
                Enter Brand Dashboard →
              </Link>
            </div>
          )}

          {/* STATUS: REJECTED */}
          {status === 'REJECTED' && (
            <div className={`${styles.statusBanner} ${styles.statusRejected}`}>
              <div className={styles.statusIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <div className={styles.statusContentTitle}>Application Unsuccessful</div>
                <div className={styles.statusContentDesc}>
                  Unfortunately, your brand application could not be approved at this time.
                </div>
                {rejectionReason && (
                  <div className={styles.infoRequestBox} style={{ borderColor: '#FFA39E', color: '#CF1322' }}>
                    <strong>Reason:</strong> {rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form to submit updates when status is NEEDS_MORE_INFORMATION */}
          {status === 'NEEDS_MORE_INFORMATION' && (
            <form onSubmit={handleResubmit} className={styles.updateForm}>
              <h3 className={styles.statusContentTitle} style={{ marginBottom: '0.75rem' }}>
                Respond to Compliance Team
              </h3>

              {resubmitSuccess && (
                <div style={{ background: '#F6FFED', border: '1px solid #B7EB8F', color: '#389E0D', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                  Response recorded and application resubmitted! Our team will re-evaluate shortly.
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Your Response & Updated Details</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Provide the requested details or clarifications..."
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.resubmitBtn}
                disabled={isSubmitting}
                id="resubmit-application-button"
              >
                {isSubmitting ? 'Resubmitting...' : 'Submit Requested Information'}
              </button>
            </form>
          )}

          {/* Timeline details */}
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div>
                <div className={styles.timelineTitle}>Application Submitted</div>
                <div className={styles.timelineTime}>
                  {submittedAt ? new Date(submittedAt).toLocaleString() : 'Recently'}
                </div>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div
                className={styles.timelineDot}
                style={{
                  background:
                    status === 'APPROVED'
                      ? '#389E0D'
                      : status === 'REJECTED'
                      ? '#CF1322'
                      : 'var(--accent-gold)',
                }}
              />
              <div>
                <div className={styles.timelineTitle}>Current Status: {status}</div>
                <div className={styles.timelineTime}>Live system status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
