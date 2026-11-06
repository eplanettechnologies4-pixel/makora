'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        router.push('/admin/login');
      } else {
        router.push('/admin/brands/applications');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <p>Redirecting to Marketplace Administration Console...</p>
      <Link href="/admin/brands/applications" style={{ color: 'var(--accent-gold)', marginTop: '1rem', display: 'inline-block' }}>
        Go to Brand Applications Queue →
      </Link>
    </div>
  );
}
