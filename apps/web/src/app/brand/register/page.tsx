'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import styles from './brand-register.module.css';

const STEPS = [
  { id: 1, label: 'Owner Account' },
  { id: 2, label: 'Brand Details' },
  { id: 3, label: 'Verification' },
  { id: 4, label: 'Banking' },
  { id: 5, label: 'Review & Submit' },
];

export default function BrandRegisterPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    referenceNumber: string;
    applicationId: string;
    status: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner
    ownerFirstName: user?.firstName || '',
    ownerLastName: user?.lastName || '',
    ownerEmail: user?.email || '',
    ownerPhone: user?.phone || '',
    ownerPassword: '',
    ownerConfirmPassword: '',

    // Step 2: Brand
    brandName: '',
    brandSlug: '',
    brandDescription: '',
    businessType: 'SOLE_PROPRIETORSHIP',
    businessAddress: '',
    city: 'Lahore',
    country: 'Pakistan',
    websiteUrl: '',
    instagramHandle: '',
    logoUrl: '',
    bannerUrl: '',

    // Step 3: Verification
    businessRegNumber: '',
    documentName: 'SECP_Certificate_2026.pdf',

    // Step 4: Banking
    bankName: 'Habib Bank Limited (HBL)',
    accountHolderName: '',
    accountNumber: '',
    iban: '',
    branchCode: '',

    // Step 5: Agreement
    agreedToSellerPolicy: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Auto-generate slug from brand name if slug hasn't been manually customized
      if (name === 'brandName') {
        updated.brandSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      return updated;
    });

    setErrorMessage(null);
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!user) {
        if (!formData.ownerFirstName.trim() || !formData.ownerLastName.trim()) {
          setErrorMessage('Please enter your full name (first and last name).');
          return false;
        }
        if (!formData.ownerEmail.trim() || !formData.ownerEmail.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          return false;
        }
        if (formData.ownerPassword.length < 8) {
          setErrorMessage('Password must be at least 8 characters long.');
          return false;
        }
        if (formData.ownerPassword !== formData.ownerConfirmPassword) {
          setErrorMessage('Passwords do not match.');
          return false;
        }
      }
      return true;
    }

    if (step === 2) {
      if (!formData.brandName.trim()) {
        setErrorMessage('Brand name is required.');
        return false;
      }
      if (!formData.brandSlug.trim()) {
        setErrorMessage('Brand URL handle (slug) is required.');
        return false;
      }
      if (!formData.city.trim()) {
        setErrorMessage('City of operation is required.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      // Step 3 optional or minimal
      return true;
    }

    if (step === 4) {
      if (!formData.bankName.trim()) {
        setErrorMessage('Bank name is required.');
        return false;
      }
      if (!formData.accountHolderName.trim()) {
        setErrorMessage('Account holder title is required.');
        return false;
      }
      if (!formData.accountNumber.trim()) {
        setErrorMessage('Account number is required for future settlement disbursements.');
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (!formData.agreedToSellerPolicy) {
        setErrorMessage('Please agree to the Makaura Marketplace Seller Terms & Code of Conduct.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        brandName: formData.brandName.trim(),
        brandSlug: formData.brandSlug.trim(),
        brandDescription: formData.brandDescription.trim() || undefined,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress.trim() || undefined,
        city: formData.city.trim(),
        country: formData.country.trim() || 'Pakistan',
        websiteUrl: formData.websiteUrl.trim() || undefined,
        socialLinks: formData.instagramHandle
          ? { instagram: formData.instagramHandle.trim() }
          : undefined,
        logoUrl: formData.logoUrl.trim() || undefined,
        bannerUrl: formData.bannerUrl.trim() || undefined,
        businessRegNumber: formData.businessRegNumber.trim() || undefined,
        bankName: formData.bankName.trim(),
        accountHolderName: formData.accountHolderName.trim(),
        accountNumber: formData.accountNumber.trim(),
        iban: formData.iban.trim() || undefined,
        branchCode: formData.branchCode.trim() || undefined,
      };

      // Include owner account details if not logged in
      if (!user) {
        payload.ownerFirstName = formData.ownerFirstName.trim();
        payload.ownerLastName = formData.ownerLastName.trim();
        payload.ownerEmail = formData.ownerEmail.trim();
        payload.ownerPhone = formData.ownerPhone.trim() || undefined;
        payload.ownerPassword = formData.ownerPassword;
      }

      const response = await apiRequest('/brand-applications', {
        method: 'POST',
        data: payload,
      });

      const resData = response.data || response;
      setSubmittedData({
        referenceNumber: resData.referenceNumber || 'MAK-ONBOARD',
        applicationId: resData.applicationId,
        status: resData.status || 'PENDING_APPROVAL',
      });

      await refreshUser();
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Failed to submit brand application. Please review your entries.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already submitted, display confirmation screen
  if (submittedData) {
    return (
      <div className={styles.container}>
        <div className={styles.wizardWrapper}>
          <div className={`${styles.wizardCard} ${styles.confirmationCard}`}>
            <div className={styles.successIcon}>
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className={styles.subheading}>Application Successfully Submitted</span>
            <h1 className={styles.title}>Welcome to Makaura Partner Onboarding</h1>
            <p className={styles.description}>
              Your brand application for <strong>{formData.brandName}</strong> has been logged in our secure review queue.
            </p>

            <div>
              <span className={styles.refBadge}>
                Ref: {submittedData.referenceNumber}
              </span>
            </div>

            <div className={styles.securityNotice} style={{ maxWidth: '600px', margin: '1.5rem auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span><strong>Compliance & Review Notice:</strong> All beauty product houses undergo credential and formulation safety verification before storefront activation. The Makaura Vendor Onboarding team typically reviews applications within 24–48 business hours.</span>
            </div>

            <div>
              <Link href="/brand/application-status" className={styles.statusActionBtn}>
                Check Application Status →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wizardWrapper}>
        <div className={styles.wizardCard}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Link href="/" aria-label="Makora Home">
              <Image
                src="/images/logo.png"
                alt="MAKORA - Discover Beauty. Explore Brands."
                width={150}
                height={95}
                style={{ height: '56px', width: 'auto', margin: '0 auto', display: 'block' }}
                priority
              />
            </Link>
          </div>

          <div className={styles.header}>
            <span className={styles.subheading}>Brand Partnership Program</span>
            <h1 className={styles.title}>Apply as a Makaura Brand Partner</h1>
            <p className={styles.description}>
              Showcase and sell your authentic skincare, cosmetic, or niche fragrance creations to thousands of luxury beauty connoisseurs across Pakistan.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className={styles.stepper}>
            <div className={styles.stepDivider} />
            {STEPS.map((s) => {
              const isCompleted = currentStep > s.id;
              const isActive = currentStep === s.id;

              return (
                <div key={s.id} className={styles.stepItem}>
                  <div
                    className={`${styles.stepCircle} ${
                      isActive
                        ? styles.stepCircleActive
                        : isCompleted
                        ? styles.stepCircleCompleted
                        : ''
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </div>
                  <span
                    className={`${styles.stepLabel} ${
                      isActive ? styles.stepLabelActive : ''
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {errorMessage && (
            <div className={styles.errorBanner} role="alert" id="wizard-error">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* STEP 1: OWNER ACCOUNT */}
            {currentStep === 1 && (
              <div>
                <h2 className={styles.sectionTitle}>Step 1: Brand Owner Account</h2>
                <p className={styles.sectionSubtitle}>
                  {user
                    ? `You are signed in as ${user.firstName} ${user.lastName} (${user.email}). This account will be designated as the Primary Brand Owner.`
                    : 'Create your primary Brand Owner account to manage your brand storefront and settlements.'}
                </p>

                {!user ? (
                  <div className={styles.formGrid}>
                    <div className={styles.row}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>First Name *</label>
                        <input
                          name="ownerFirstName"
                          type="text"
                          required
                          className={styles.input}
                          placeholder="e.g. Zainab"
                          value={formData.ownerFirstName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Last Name *</label>
                        <input
                          name="ownerLastName"
                          type="text"
                          required
                          className={styles.input}
                          placeholder="e.g. Ahmed"
                          value={formData.ownerLastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.row}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address *</label>
                        <input
                          name="ownerEmail"
                          type="email"
                          required
                          className={styles.input}
                          placeholder="founder@brand.com"
                          value={formData.ownerEmail}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Phone Number</label>
                        <input
                          name="ownerPhone"
                          type="tel"
                          className={styles.input}
                          placeholder="+92 300 7654321"
                          value={formData.ownerPhone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.row}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Account Password *</label>
                        <input
                          name="ownerPassword"
                          type="password"
                          required
                          className={styles.input}
                          placeholder="Min 8 characters"
                          value={formData.ownerPassword}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Confirm Password *</label>
                        <input
                          name="ownerConfirmPassword"
                          type="password"
                          required
                          className={styles.input}
                          placeholder="Re-enter password"
                          value={formData.ownerConfirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewGrid}>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewItemLabel}>Name</span>
                        <span className={styles.reviewItemVal}>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewItemLabel}>Email</span>
                        <span className={styles.reviewItemVal}>{user.email}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewItemLabel}>Assigned Role</span>
                        <span className={styles.reviewItemVal}>BRAND_OWNER</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: BRAND INFORMATION */}
            {currentStep === 2 && (
              <div>
                <h2 className={styles.sectionTitle}>Step 2: Brand Information</h2>
                <p className={styles.sectionSubtitle}>
                  Provide details about your cosmetics brand, aesthetic identity, and customer presence.
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Brand Name *</label>
                      <input
                        name="brandName"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="e.g. Glow Botanics"
                        value={formData.brandName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Brand URL Slug (Handle) *</label>
                      <input
                        name="brandSlug"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="e.g. glow-botanics"
                        value={formData.brandSlug}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Brand Description & Philosophy</label>
                    <textarea
                      name="brandDescription"
                      className={styles.textarea}
                      placeholder="Share your brand story, core formulation ethics (organic, cruelty-free, halal-certified), and signature product lines..."
                      value={formData.brandDescription}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Business Entity Type</label>
                      <select
                        name="businessType"
                        className={styles.select}
                        value={formData.businessType}
                        onChange={handleChange}
                      >
                        <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                        <option value="PRIVATE_LIMITED">Private Limited (Pvt Ltd)</option>
                        <option value="PARTNERSHIP">Partnership</option>
                        <option value="INDIVIDUAL">Individual Artisan</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>City of Origin *</label>
                      <input
                        name="city"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="e.g. Lahore, Karachi, Islamabad"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Registered Business Address</label>
                    <input
                      name="businessAddress"
                      type="text"
                      className={styles.input}
                      placeholder="Office or studio address"
                      value={formData.businessAddress}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Brand Website URL</label>
                      <input
                        name="websiteUrl"
                        type="url"
                        className={styles.input}
                        placeholder="https://yourbrand.com"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Instagram Handle</label>
                      <input
                        name="instagramHandle"
                        type="text"
                        className={styles.input}
                        placeholder="@yourbrand"
                        value={formData.instagramHandle}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Brand Logo URL (Optional demo link)</label>
                      <input
                        name="logoUrl"
                        type="url"
                        className={styles.input}
                        placeholder="https://..."
                        value={formData.logoUrl}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Brand Banner URL (Optional demo link)</label>
                      <input
                        name="bannerUrl"
                        type="url"
                        className={styles.input}
                        placeholder="https://..."
                        value={formData.bannerUrl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BUSINESS VERIFICATION */}
            {currentStep === 3 && (
              <div>
                <h2 className={styles.sectionTitle}>Step 3: Business Verification & Compliance</h2>
                <p className={styles.sectionSubtitle}>
                  Provide corporate registration details or tax identification for your cosmetics enterprise.
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Business Registration / NTN / SECP Number (if applicable)
                    </label>
                    <input
                      name="businessRegNumber"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. NTN-8765432-1 or SECP-019283"
                      value={formData.businessRegNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.securityNotice} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span><strong>Verification Files:</strong> Once your initial application is submitted, you can upload CNIC, NTN Certificate, and Drug Regulatory Authority or cosmetic lab certifications directly through your Partner Portal.</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BANK INFORMATION */}
            {currentStep === 4 && (
              <div>
                <h2 className={styles.sectionTitle}>Step 4: Banking & Settlement Details</h2>
                <p className={styles.sectionSubtitle}>
                  Cash on Delivery customer payments are reconciled and settled directly into this corporate or proprietor bank account.
                </p>

                <div className={styles.securityNotice} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span><strong>Bank-Grade AES-256 Encryption:</strong> Your banking credentials are encrypted at rest with server-side AES-256-GCM. Plaintext account numbers are never exposed in ordinary API responses or logs.</span>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Bank Name *</label>
                      <input
                        name="bankName"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="e.g. Standard Chartered / HBL / Meezan"
                        value={formData.bankName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Account Title (Holder Name) *</label>
                      <input
                        name="accountHolderName"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="Exact title as appears on cheque leaf"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Account Number *</label>
                      <input
                        name="accountNumber"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="e.g. 010123456789"
                        value={formData.accountNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>IBAN (International Bank Account Number)</label>
                      <input
                        name="iban"
                        type="text"
                        className={styles.input}
                        placeholder="PK36SCBL0000001123456702"
                        value={formData.iban}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Branch Name / Code (Optional)</label>
                    <input
                      name="branchCode"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Main Boulevard Branch (042)"
                      value={formData.branchCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {currentStep === 5 && (
              <div>
                <h2 className={styles.sectionTitle}>Step 5: Review & Submit Application</h2>
                <p className={styles.sectionSubtitle}>
                  Please review your information carefully before submitting for compliance verification.
                </p>

                {/* Owner Summary */}
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewTitle}>1. Brand Owner</span>
                    <button
                      type="button"
                      className={styles.reviewEditBtn}
                      onClick={() => setCurrentStep(1)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Name</span>
                      <span className={styles.reviewItemVal}>
                        {formData.ownerFirstName || user?.firstName}{' '}
                        {formData.ownerLastName || user?.lastName}
                      </span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Email</span>
                      <span className={styles.reviewItemVal}>
                        {formData.ownerEmail || user?.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Brand Summary */}
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewTitle}>2. Brand Identity</span>
                    <button
                      type="button"
                      className={styles.reviewEditBtn}
                      onClick={() => setCurrentStep(2)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Brand Name</span>
                      <span className={styles.reviewItemVal}>{formData.brandName}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Handle / Slug</span>
                      <span className={styles.reviewItemVal}>@{formData.brandSlug}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Entity Type</span>
                      <span className={styles.reviewItemVal}>{formData.businessType}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>City & Origin</span>
                      <span className={styles.reviewItemVal}>
                        {formData.city}, {formData.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banking Summary */}
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewTitle}>3. Banking & Settlement</span>
                    <button
                      type="button"
                      className={styles.reviewEditBtn}
                      onClick={() => setCurrentStep(4)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Bank</span>
                      <span className={styles.reviewItemVal}>{formData.bankName}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Title</span>
                      <span className={styles.reviewItemVal}>{formData.accountHolderName}</span>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Account Number</span>
                      <span className={styles.reviewItemVal}>
                        {'*'.repeat(Math.max(0, formData.accountNumber.length - 4))}
                        {formData.accountNumber.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input
                      name="agreedToSellerPolicy"
                      type="checkbox"
                      checked={formData.agreedToSellerPolicy}
                      onChange={handleChange}
                      style={{ marginTop: '0.2rem', accentColor: 'var(--accent-gold)' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      I confirm that all products submitted under this brand will be 100% authentic, comply with consumer safety standards, and adhere to the Makaura Multi-Vendor Seller Guidelines.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className={styles.buttonRow}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={handleNext}
                  id="wizard-next-button"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles.nextBtn}
                  disabled={isSubmitting}
                  id="wizard-submit-button"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
