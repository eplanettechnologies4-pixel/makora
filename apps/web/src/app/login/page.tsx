'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
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
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(formData.email.trim(), formData.password);

      // Route according to user role and brand status
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/brands/applications');
      } else if (user.role === 'BRAND_OWNER') {
        if (user.brand?.status === 'APPROVED') {
          router.push('/brand/dashboard');
        } else {
          router.push('/brand/application-status');
        }
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Invalid email or password. Please check your credentials.',
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
          <span className={styles.subheading}>Welcome Back</span>
          <h1 className={styles.title}>Sign In to Makaura</h1>
          <p className={styles.description}>
            Access your curated beauty cart, orders, and saved luxury skincare collections.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert" id="login-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="e.g. customer@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className={styles.input}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            id="login-submit-button"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footerNote}>
          Don’t have an account yet?{' '}
          <Link href="/register" className={styles.footerLink}>
            Create One
          </Link>
        </p>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or Brand Partner</span>
        </div>

        <Link href="/brand/login" className={styles.brandLoginOption}>
          Brand Owner Portal Sign In →
        </Link>
      </div>
    </div>
  );
}
