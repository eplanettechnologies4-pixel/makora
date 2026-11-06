'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import styles from './brand-login.module.css';

export default function BrandLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please provide both your partner email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(formData.email.trim(), formData.password);

      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/brands/applications');
      } else if (user.role === 'BRAND_OWNER') {
        if (user.brand?.status === 'APPROVED') {
          router.push('/brand/dashboard');
        } else {
          router.push('/brand/application-status');
        }
      } else {
        // Customer trying to sign in via brand portal: redirect to brand register
        router.push('/brand/register');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Invalid partner email or password. Please verify your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
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
          <span className={styles.subheading}>Partner Management</span>
          <h1 className={styles.title}>Brand Owner Portal</h1>
          <p className={styles.description}>
            Sign in to manage your beauty house catalog, monitor customer fulfillment, and view settlement statements.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert" id="brand-login-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Partner Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="founder@yourbrand.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.input}
              placeholder="Enter your partner password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <button
            id="brand-login-submit-button"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Partner Credentials...' : 'Sign In to Portal'}
          </button>
        </form>

        <p className={styles.footerNote}>
          Interested in selling on Makaura?{' '}
          <Link href="/brand/register" className={styles.footerLink}>
            Apply for Brand Partnership
          </Link>
        </p>

        <p className={styles.footerNote} style={{ marginTop: '0.75rem' }}>
          Customer looking to shop?{' '}
          <Link href="/login" className={styles.footerLink}>
            Customer Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
