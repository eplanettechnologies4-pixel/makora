'use client';

import React, { useEffect, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  getAdminPaymentSettingsAction,
  updateAdminPaymentSettingsAction,
} from '../../../lib/supabase/actions';
import {
  MarketplacePaymentSettings,
  DEFAULT_PAYMENT_SETTINGS,
} from '../../../lib/payment-settings/types';
import styles from './admin-payments.module.css';

// Crisp SVG Icons (replacing emojis)
const TruckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const BankIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z" />
  </svg>
);

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CardIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const MobileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

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
        setTimeout(() => setSavedSuccess(false), 4500);
      } else {
        setErrorMessage(res.error || 'Failed to update payment settings.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating payment settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all payment gateways and commission rules to Makaura defaults?')) {
      setSettings(DEFAULT_PAYMENT_SETTINGS);
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div style={{ padding: '3.5rem', textAlign: 'center', color: '#6d7175', fontSize: '0.9rem' }}>
          Loading marketplace payment settings...
        </div>
      </AdminShell>
    );
  }

  // Active gateways count
  const activeCount = [
    settings.cod.enabled,
    settings.bankTransfer.enabled,
    settings.onlineGateway.enabled,
  ].filter(Boolean).length;

  const sampleAmount = 10000;
  const commRate = settings.commission.defaultCommissionRate || 15;
  const platformFee = Math.round((sampleAmount * commRate) / 100);
  const vendorPayout = sampleAmount - platformFee;

  return (
    <AdminShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Payment Methods & Commissions</h1>
            <p className={styles.pageSubtitle}>
              Configure customer checkout payment options, courier delivery charges, central escrow accounts, and default vendor commission rates.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={handleReset}
              className={styles.btnSecondary}
              title="Reset to factory settings"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className={styles.btnPrimary}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {savedSuccess && (
          <div className={styles.toastSuccess}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Payment methods, shipping fees, and commission rates saved successfully!</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className={styles.toastError}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick KPI Status Strip */}
        <div className={styles.kpiStrip}>
          <div className={styles.kpiBox}>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.kpiTextGroup}>
              <p className={styles.kpiTitle}>Checkout Gateways</p>
              <h3 className={styles.kpiValue}>{activeCount} of 3 Active</h3>
              <p className={styles.kpiMeta}>Available to buyers at checkout</p>
            </div>
          </div>

          <div className={styles.kpiBox}>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 7a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-.25 4.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zm.25 3a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.kpiTextGroup}>
              <p className={styles.kpiTitle}>Platform Take-Rate</p>
              <h3 className={styles.kpiValue}>{settings.commission.defaultCommissionRate}% Commission</h3>
              <p className={styles.kpiMeta}>Applied on vendor gross volume</p>
            </div>
          </div>

          <div className={styles.kpiBox}>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e4f8ec', color: '#108043' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.kpiTextGroup}>
              <p className={styles.kpiTitle}>Vendor Settlements</p>
              <h3 className={styles.kpiValue}>
                {settings.commission.payoutFrequency === 'WEEKLY'
                  ? 'Weekly'
                  : settings.commission.payoutFrequency === 'BI_WEEKLY'
                  ? 'Bi-Weekly'
                  : 'Monthly'}
              </h3>
              <p className={styles.kpiMeta}>Min. payout Rs. {settings.commission.minPayoutAmount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 1. Cash on Delivery (COD) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Cash on Delivery (COD) & Logistics</h2>
                <p className={styles.cardSubtitle}>
                  Nationwide physical cash collection fulfilled centrally by Makaura logistics partners.
                </p>
              </div>
            </div>

            <label className={styles.toggleControl}>
              <span className={settings.cod.enabled ? styles.statusPillActive : styles.statusPillInactive}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: settings.cod.enabled ? '#108043' : '#8c9196' }} />
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
            {/* Supported Couriers Chips */}
            <div className={styles.tagRow}>
              <span className={styles.tagLabel}>Integrated Courier Fleets:</span>
              <span className={styles.chip}><TruckIcon /> Trax Logistics</span>
              <span className={styles.chip}><TruckIcon /> TCS Express</span>
              <span className={styles.chip}><TruckIcon /> Leopards Courier</span>
              <span className={styles.chip}><TruckIcon /> Call Courier</span>
              <span className={styles.chip}><TruckIcon /> PostEx</span>
              <span className={styles.chip}><TruckIcon /> Swyft Logistics</span>
            </div>

            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Flat Shipping Fee</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>PKR</span>
                  <input
                    type="number"
                    min="0"
                    className={styles.inputPrefixed}
                    value={settings.cod.shippingFee}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cod: { ...settings.cod, shippingFee: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <p className={styles.formHint}>Flat delivery fee added to customer cart at checkout.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Free Delivery Threshold</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>PKR</span>
                  <input
                    type="number"
                    min="0"
                    className={styles.inputPrefixed}
                    value={settings.cod.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cod: { ...settings.cod, freeDeliveryThreshold: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <p className={styles.formHint}>Orders above this amount receive free nationwide delivery.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Maximum Order Amount (COD)</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>PKR</span>
                  <input
                    type="number"
                    min="0"
                    className={styles.inputPrefixed}
                    value={settings.cod.maxOrderAmount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cod: { ...settings.cod, maxOrderAmount: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <p className={styles.formHint}>Maximum cart total eligible for Cash on Delivery.</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Delivery Instructions Shown at Checkout</label>
              <textarea
                className={styles.formTextarea}
                value={settings.cod.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cod: { ...settings.cod, description: e.target.value },
                  })
                }
                placeholder="e.g. Pay with physical cash upon package delivery directly at your doorstep."
              />
              <p className={styles.formHint}>Helpful instruction text displayed under the Cash on Delivery radio option.</p>
            </div>
          </div>
        </div>

        {/* 2. Direct Bank Transfer & Raast (IBFT) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Direct Bank Transfer & Instant Raast (IBFT)</h2>
                <p className={styles.cardSubtitle}>
                  Makaura central corporate escrow account for direct online transfers and Raast instant payments.
                </p>
              </div>
            </div>

            <label className={styles.toggleControl}>
              <span className={settings.bankTransfer.enabled ? styles.statusPillActive : styles.statusPillInactive}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: settings.bankTransfer.enabled ? '#108043' : '#8c9196' }} />
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
            {/* Supported Rails */}
            <div className={styles.tagRow}>
              <span className={styles.tagLabel}>Settlement Channel:</span>
              <span className={styles.chip}><BankIcon /> Meezan Corporate Escrow</span>
              <span className={styles.chip}><BoltIcon /> 1Link Raast ID</span>
              <span className={styles.chip}><LockIcon /> IBFT Auto-Reconciliation</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bank Name</label>
                <input
                  type="text"
                  className={styles.formInput}
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
                <label className={styles.formLabel}>Account Title / Beneficiary</label>
                <input
                  type="text"
                  className={styles.formInput}
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
                <label className={styles.formLabel}>Account Number</label>
                <input
                  type="text"
                  className={styles.formInput}
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
                <label className={styles.formLabel}>IBAN (24 Characters)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  style={{ fontFamily: 'monospace' }}
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
                <label className={styles.formLabel}>Raast ID (Instant Phone/1Link)</label>
                <input
                  type="text"
                  className={styles.formInput}
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
              <label className={styles.formLabel}>Checkout Instructions & Slip Upload Note</label>
              <textarea
                className={styles.formTextarea}
                value={settings.bankTransfer.instructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankTransfer: { ...settings.bankTransfer, instructions: e.target.value },
                  })
                }
              />
              <p className={styles.formHint}>Shown to buyer after placing order with instructions to transfer and upload payment proof.</p>
            </div>
          </div>
        </div>

        {/* 3. Online Digital Gateways */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardIcon} style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Online Cards & Digital Wallets Gateway</h2>
                <p className={styles.cardSubtitle}>
                  Debit Cards, Credit Cards, UnionPay, PayPak, JazzCash, and EasyPaisa integration.
                </p>
              </div>
            </div>

            <label className={styles.toggleControl}>
              <span className={settings.onlineGateway.enabled ? styles.statusPillActive : styles.statusPillInactive}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: settings.onlineGateway.enabled ? '#108043' : '#8c9196' }} />
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
            {/* Supported Card Schemes */}
            <div className={styles.tagRow}>
              <span className={styles.tagLabel}>Supported Networks:</span>
              <span className={styles.chip}><CardIcon /> Visa</span>
              <span className={styles.chip}><CardIcon /> Mastercard</span>
              <span className={styles.chip}><CardIcon /> UnionPay</span>
              <span className={styles.chip}><CardIcon /> PayPak</span>
              <span className={styles.chip}><MobileIcon /> JazzCash</span>
              <span className={styles.chip}><MobileIcon /> EasyPaisa</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Selected Payment Provider</label>
                <select
                  className={styles.formSelect}
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
                  <option value="stripe">Stripe Global (International Visa/MC)</option>
                </select>
                <p className={styles.formHint}>Select your primary merchant gateway provider.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Environment Mode</label>
                <select
                  className={styles.formSelect}
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
                <p className={styles.formHint}>Sandbox processes mock payments; Live processes real transactions.</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Merchant ID / Terminal ID</label>
                <input
                  type="text"
                  className={styles.formInput}
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
                <label className={styles.formLabel}>Public API Key</label>
                <input
                  type="text"
                  className={styles.formInput}
                  style={{ fontFamily: 'monospace' }}
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
              <div className={styles.cardIcon} style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H11a1 1 0 100-2H8.08a7.35 7.35 0 010-1H11a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Marketplace Commission & Vendor Payout Policy</h2>
                <p className={styles.cardSubtitle}>
                  Set the default platform commission deducted on store sales and manage remittance schedules.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Commission Rate (%)</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={styles.inputSuffixed}
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
                  <span className={styles.suffix}>%</span>
                </div>
                <p className={styles.formHint}>Automatically assigned to new brand owners upon approval.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Vendor Settlement Cycle</label>
                <select
                  className={styles.formSelect}
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
                  <option value="MONTHLY">Monthly Settlements (End of Month)</option>
                </select>
                <p className={styles.formHint}>Automated schedule when collected balances are disbursed.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Minimum Payout Threshold</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>PKR</span>
                  <input
                    type="number"
                    min="0"
                    className={styles.inputPrefixed}
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
                </div>
                <p className={styles.formHint}>Accumulated net earnings required before bank transfer.</p>
              </div>
            </div>

            {/* Live Calculation Simulation Box */}
            <div className={styles.calcBox}>
              <div className={styles.calcIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className={styles.calcTitle}>
                  Live Platform Take-Rate Example (Rs. {sampleAmount.toLocaleString()} Order)
                </div>
                <p className={styles.calcText}>
                  On an order of <strong>Rs. {sampleAmount.toLocaleString()}</strong>: Makaura retains <strong>{commRate}%</strong> (<strong>Rs. {platformFee.toLocaleString()}</strong>) for platform operations and central logistics $\rightarrow$ The store owner receives <strong>Rs. {vendorPayout.toLocaleString()}</strong> net payout on the next <strong>{settings.commission.payoutFrequency.toLowerCase()}</strong> settlement cycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className={styles.bottomActionCard}>
          <div className={styles.bottomActionText} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#0369a1', display: 'flex' }}><InfoIcon /></span>
            <span>Configuration changes persist in real-time across the checkout page and vendor payout calculations.</span>
          </div>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className={styles.btnPrimary}
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{isSaving ? 'Saving Changes...' : 'Save All Payment Settings'}</span>
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
