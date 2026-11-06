import React from 'react';
import Link from 'next/link';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  return (
    <aside className={styles.bar} aria-label="Marketplace Announcement">
      <div className={styles.inner}>
        <span className={styles.item}>
          Pakistan’s Premier Multi-Vendor Beauty Collective
        </span>
        <span className={styles.dot}>•</span>
        <span className={styles.item}>
          Cash On Delivery (COD) Available Nationwide
        </span>
        <span className={styles.dot}>•</span>
        <span className={styles.item}>
          Complimentary Delivery on Orders Above <strong className={styles.highlight}>Rs. 3,500</strong>
        </span>
        <span className={styles.dot}>•</span>
        <span className={styles.item}>
          <Link href="/brand/register" className={styles.highlight}>
            Sell Your Brand →
          </Link>
        </span>
      </div>
    </aside>
  );
}

