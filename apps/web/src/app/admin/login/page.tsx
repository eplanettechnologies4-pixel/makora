'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
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
      setErrorMessage('Admin credentials required.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(formData.email.trim(), formData.password);

      // Verify the returned authenticated user has administrative privileges
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        setErrorMessage(
          'Access Denied: Your account does not possess marketplace administrative privileges.',
        );
        return;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Administrative authentication failed. Check credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
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
          <span className={styles.shieldIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <span className={styles.badge}>Internal Console</span>
          <h1 className={styles.title}>Marketplace Administration</h1>
          <p className={styles.description}>
            Authorized Makaura personnel only. All access attempts and administrative actions are cryptographically logged.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert" id="admin-login-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Administrator Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="admin@makaura.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="admin-password" className={styles.label}>
                Security Key / Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold, #b8860b)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </button>
            </div>
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className={styles.input}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <button
            id="admin-login-submit-button"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter'}
          </button>
        </form>

        {/* Quick Fill Helper */}
        <div style={{ marginTop: '1.25rem', padding: '0.85rem', backgroundColor: '#fdfbf7', borderRadius: '8px', border: '1px solid #f1e5cc', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', color: '#856404', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Master Admin Demo Credentials
          </p>
          <div style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '0.65rem', lineHeight: '1.4' }}>
            <div>Email: <strong style={{ color: '#111827' }}>admin@makaura.com</strong></div>
            <div>Password: <strong style={{ color: '#111827' }}>admin123456</strong></div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData({ email: 'admin@makaura.com', password: 'admin123456' });
              setErrorMessage(null);
            }}
            style={{
              background: '#111827',
              color: '#d4af37',
              border: '1px solid #d4af37',
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#008060' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Click to Auto-Fill Credentials</span>
          </button>
        </div>

        <div className={styles.securityFooter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Makaura RBAC Security Active • IP Monitored</span>
        </div>
      </div>
    </div>
  );
}
