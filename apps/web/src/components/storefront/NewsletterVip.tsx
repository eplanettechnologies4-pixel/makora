'use client';

import React, { useState } from 'react';
import styles from './NewsletterVip.module.css';

export default function NewsletterVip() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className={styles.section} aria-label="Join The Salon Privé">
      <div className={styles.backgroundGlow} />
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.kicker}>
            <span>Invitation Only</span>
          </div>

          <h2 className={styles.heading}>
            The Makaura <span className={styles.headingItalic}>Salon Privé</span>
          </h2>

          <p className={styles.description}>
            Join our private collector’s circle for early access to small-batch harvests,
            master formulator releases, and private sales reserved for beauty connoisseurs.
          </p>

          {submitted ? (
            <div className={styles.successMessage} role="status">
              Welcome to The Salon Privé. Your invitation has been registered.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                aria-label="Email address for Salon Privé"
              />
              <button type="submit" className={styles.submitBtn}>
                Request Access
              </button>
            </form>
          )}

          <p className={styles.privacyNote}>
            By requesting access, you agree to receive editorial releases. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  );
}

