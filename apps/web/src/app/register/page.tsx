'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validations
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please enter both your first and last name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (!formData.agreeToTerms) {
      setErrorMessage('You must accept the terms of service and privacy policy to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        data: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms,
        },
      });

      if (response?.data?.accessToken && typeof window !== 'undefined') {
        sessionStorage.setItem('makaura_access_token', response.data.accessToken);
      }

      setSuccessMessage('Welcome to Makaura! Your account has been created successfully.');
      await refreshUser();

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An error occurred during registration. Please try again.',
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
          <span className={styles.subheading}>Join Makaura Collective</span>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.description}>
            Experience luxury beauty from the finest independent Pakistani cosmetic houses.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert" id="register-error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className={styles.successBanner} role="status" id="register-success">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Fatima"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Khan"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

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
              placeholder="e.g. fatima@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.row}>
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
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={styles.input}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <label className={styles.checkboxContainer}>
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              className={styles.checkbox}
              checked={formData.agreeToTerms}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className={styles.checkboxLabel}>
              I accept the Makaura{' '}
              <Link href="/terms" className={styles.termsLink}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className={styles.termsLink}>
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            id="register-submit-button"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footerNote}>
          Already have an account?{' '}
          <Link href="/login" className={styles.footerLink}>
            Sign In
          </Link>
        </p>

        <p className={styles.footerNote} style={{ marginTop: '0.75rem' }}>
          Are you a beauty brand creator?{' '}
          <Link href="/brand/register" className={styles.footerLink}>
            Register as Brand Partner →
          </Link>
        </p>
      </div>
    </div>
  );
}
