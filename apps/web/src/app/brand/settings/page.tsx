'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getMyBrandAction } from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from '../products/shopify-product.module.css';

export default function BrandSettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    </ShopifyShell>
  );
}
