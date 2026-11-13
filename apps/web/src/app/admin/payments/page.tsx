'use client';

import React, { useEffect, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  getAdminPaymentSettingsAction,
  updateAdminPaymentSettingsAction,
} from '../../../lib/supabase/actions';
import { MarketplacePaymentSettings, DEFAULT_PAYMENT_SETTINGS } from '../../../lib/payment-settings/types';
import styles from './admin-payments.module.css';

export default function AdminPaymentsPage() {
  const [settings, setSettings] = useState<MarketplacePaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminPaymentSettingsAction()
      .then((res) => {
        if (res.ok && res.data) {
          setSettings(res.data);
        }
      })
      .catch((err) => console.error('Error loading payment settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const res = await updateAdminPaymentSettingsAction(settings);
      if (res.ok) {
        setSettings(res.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setErrorMessage(res.error || 'Failed to update payment settings.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating payment settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8b949e' }}>
          Loading marketplace payment settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Payment Methods & Commissions</h1>
            <p className={styles.pageSubtitle}>
              Configure platform payment gateways, Cash on Delivery logistics, bank settlement details, and default brand commission rates.
            </p>
          </div>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className={styles.btnSaveTop}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className={styles.toastSuccess}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Payment methods and platform commission rules updated successfully!</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{ backgroundColor: 'rgba(248,81,73,0.15)', border: '1px solid #f85149', color: '#f85149', padding: '0.85rem 1.25rem', borderRadius: 6, marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            {errorMessage}
          </div>
        )}

        {/* 1. Cash on Delivery (COD) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Cash on Delivery (COD)</h2>
                <p className={styles.cardSubtitle}>
                  Nationwide physical cash collection by logistics couriers (Trax, Call Courier, TCS, Leopard).
                </p>
              </div>
            </div>

            <label className={styles.switchLabel}>
              <span className={styles.switchStatusText}>
                {settings.cod.enabled ? 'Active on Checkout' : 'Disabled'}
              </span>
              <div className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.cod.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cod: { ...settings.cod, enabled: e.target.checked },
                    })
                  }
                />
                <span className={styles.slider} />
              </div>
            </label>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Default Shipping Fee (PKR)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={settings.cod.shippingFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cod: { ...settings.cod, shippingFee: Number(e.target.value) },
                    })
                  }
                />
                <p className={styles.inputHint}>Flat courier delivery charge applied to orders.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Free Delivery Threshold (PKR)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={settings.cod.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cod: { ...settings.cod, freeDeliveryThreshold: Number(e.target.value) },
                    })
                  }
                />
                <p className={styles.inputHint}>Orders above this amount qualify for free shipping.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Max Order Amount (PKR)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={settings.cod.maxOrderAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cod: { ...settings.cod, maxOrderAmount: Number(e.target.value) },
                    })
                  }
                />
                <p className={styles.inputHint}>Maximum cart total eligible for Cash on Delivery.</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Delivery Instructions Shown at Checkout</label>
              <textarea
                className={styles.textarea}
                value={settings.cod.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cod: { ...settings.cod, description: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* 2. Direct Bank Transfer / Raast (IBFT) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Direct Bank Transfer & Raast (IBFT)</h2>
                <p className={styles.cardSubtitle}>
                  Makaura central corporate escrow account for direct online transfers and Raast instant payments.
                </p>
              </div>
            </div>

            <label className={styles.switchLabel}>
              <span className={styles.switchStatusText}>
                {settings.bankTransfer.enabled ? 'Active on Checkout' : 'Disabled'}
              </span>
              <div className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.bankTransfer.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, enabled: e.target.checked },
                    })
                  }
                />
                <span className={styles.slider} />
              </div>
            </label>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bank Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.bankTransfer.bankName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, bankName: e.target.value },
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Title</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.bankTransfer.accountTitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, accountTitle: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Account Number</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.bankTransfer.accountNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, accountNumber: e.target.value },
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>IBAN (24 Characters)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.bankTransfer.iban}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, iban: e.target.value },
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Raast ID (Instant 1Link)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.bankTransfer.raastId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, raastId: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Checkout Instructions & Slip Upload Note</label>
              <textarea
                className={styles.textarea}
                value={settings.bankTransfer.instructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankTransfer: { ...settings.bankTransfer, instructions: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* 3. Online Digital Gateways */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Online Card & Digital Wallet Gateway</h2>
                <p className={styles.cardSubtitle}>
                  Debit Cards, Credit Cards, UnionPay, PayPak, JazzCash and EasyPaisa integration.
                </p>
              </div>
            </div>

            <label className={styles.switchLabel}>
              <span className={styles.switchStatusText}>
                {settings.onlineGateway.enabled ? 'Active on Checkout' : 'Disabled'}
              </span>
              <div className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.onlineGateway.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      onlineGateway: { ...settings.onlineGateway, enabled: e.target.checked },
                    })
                  }
                />
                <span className={styles.slider} />
              </div>
            </label>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Payment Provider</label>
                <select
                  className={styles.select}
                  value={settings.onlineGateway.provider}
                  onChange={(e: any) =>
                    setSettings({
                      ...settings,
                      onlineGateway: { ...settings.onlineGateway, provider: e.target.value },
                    })
                  }
                >
                  <option value="payfast">PayFast (1Link & Pakistan Card Scheme)</option>
                  <option value="jazzcash">JazzCash Merchant Gateway</option>
                  <option value="easypaisa">EasyPaisa Payment Gateway</option>
                  <option value="stripe">Stripe Global (International Cards)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Environment Mode</label>
                <select
                  className={styles.select}
                  value={settings.onlineGateway.environment}
                  onChange={(e: any) =>
                    setSettings({
                      ...settings,
                      onlineGateway: { ...settings.onlineGateway, environment: e.target.value },
                    })
                  }
                >
                  <option value="sandbox">Sandbox / Testing Mode</option>
                  <option value="live">Live Production (Real Transactions)</option>
                </select>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Merchant ID</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.onlineGateway.merchantId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      onlineGateway: { ...settings.onlineGateway, merchantId: e.target.value },
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Public Key / API Key</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.onlineGateway.publicKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      onlineGateway: { ...settings.onlineGateway, publicKey: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Marketplace Commission & Payout Policy */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Marketplace Commission & Payout Rules</h2>
                <p className={styles.cardSubtitle}>
                  Default commission deducted by Makaura on vendor sales, settlement cycle, and minimum payout threshold.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Default Commission Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={settings.commission.defaultCommissionRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commission: {
                        ...settings.commission,
                        defaultCommissionRate: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className={styles.inputHint}>Assigned to newly approved brands automatically.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Vendor Payout Frequency</label>
                <select
                  className={styles.select}
                  value={settings.commission.payoutFrequency}
                  onChange={(e: any) =>
                    setSettings({
                      ...settings,
                      commission: { ...settings.commission, payoutFrequency: e.target.value },
                    })
                  }
                >
                  <option value="WEEKLY">Weekly Settlements (Every Monday)</option>
                  <option value="BI_WEEKLY">Bi-Weekly Settlements (1st & 15th)</option>
                  <option value="MONTHLY">Monthly Settlements</option>
                </select>
                <p className={styles.inputHint}>Schedule when brand balances are disbursed.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Minimum Payout Threshold (PKR)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={settings.commission.minPayoutAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commission: {
                        ...settings.commission,
                        minPayoutAmount: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className={styles.inputHint}>Accumulated net sales before remittance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginBottom: '3rem' }}>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className={styles.btnSaveTop}
            style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
          >
            {isSaving ? 'Saving Changes...' : 'Save All Payment Settings'}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
