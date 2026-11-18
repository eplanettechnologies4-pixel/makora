'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getMyBrandAction, changeMyPasswordAction } from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from '../products/shopify-product.module.css';

export default function BrandSettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeMyPasswordAction({
        currentPassword: currentPassword.trim() || undefined,
        newPassword,
      });

      if (!res.ok) {
        setPasswordError(res.error || 'Failed to update password');
        return;
      }

      setPasswordSuccess('Password updated successfully! Your account is now secured with the new password.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Error updating password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      getMyBrandAction()
        .then((res) => {
          if (!res.ok) {
            router.push('/brand/application-status');
            return;
          }
          setBrand(res.data);
          setIsLoading(false);
        })
        .catch(() => router.push('/brand/application-status'));
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>Loading settings...</div>;
  }

  const bankAccount = brand?.bankAccounts?.[0];

  return (
    <ShopifyShell brand={brand}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings & Banking</h1>
      </div>

      <div className={styles.card} style={{ maxWidth: '700px' }}>
        <h2 className={styles.cardTitle}>Payout Settlement Bank Account</h2>
        <p style={{ fontSize: '0.8125rem', color: '#6d7175', marginBottom: '1.25rem' }}>
          Banking credentials are encrypted at rest with AES-256-GCM. Below are the masked identifiers for your records.
        </p>

        {bankAccount ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: '#6d7175' }}>Bank Name</span>
              <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{bankAccount.bankName}</div>
            </div>
            <div>
              <span style={{ color: '#6d7175' }}>Account Title</span>
              <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{bankAccount.accountHolderName}</div>
            </div>
            <div>
              <span style={{ color: '#6d7175' }}>Masked Account Number</span>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', marginTop: '0.2rem' }}>
                {bankAccount.accountNumberMasked || '****'}
              </div>
            </div>
            <div>
              <span style={{ color: '#6d7175' }}>Status</span>
              <div style={{ color: bankAccount.isVerified ? '#108043' : '#b95000', fontWeight: 600, marginTop: '0.2rem' }}>
                {bankAccount.isVerified ? 'Verified by Admin' : 'Pending Verification'}
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#6d7175', fontSize: '0.8125rem' }}>No bank account registered.</p>
        )}
      </div>

      {/* Account Security & Password Card */}
      <div className={styles.card} style={{ maxWidth: '700px', marginTop: '1.5rem' }}>
        <h2 className={styles.cardTitle}>Account Security & Change Password</h2>
        <p style={{ fontSize: '0.8125rem', color: '#6d7175', marginBottom: '1.25rem' }}>
          Update your store owner account password at any time. Must be at least 8 characters.
        </p>

        {passwordSuccess && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className={styles.label} style={{ margin: 0 }}>Current Password</label>
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="Enter existing password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isChangingPassword}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className={styles.label} style={{ margin: 0 }}>New Password *</label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                className={styles.input}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className={styles.label} style={{ margin: 0 }}>Confirm New Password *</label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className={styles.input}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isChangingPassword}
              className={styles.btnPrimary}
              style={{ minWidth: '160px' }}
            >
              {isChangingPassword ? 'Updating Password...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>
    </ShopifyShell>
  );
}
