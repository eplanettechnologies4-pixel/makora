'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0d1117',
        color: '#e6edf3',
        fontFamily: 'sans-serif',
      }}
    >
      <p>Redirecting to Marketplace Master Admin Console...</p>
    </div>
  );
}
