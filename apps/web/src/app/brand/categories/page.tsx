'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyBrandAction,
  getMyBrandCategoriesAction,
  saveBrandCategoryAction,
  deleteBrandCategoryAction,
} from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from '../products/shopify-product.module.css';

export default function BrandCategoriesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create category modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        getMyBrandAction(),
        getMyBrandCategoriesAction(),
      ]);

      if (!bRes.ok) {
        router.push('/brand/application-status');
        return;
      }
      setBrand(bRes.data);
      if (cRes.ok) setCategories(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }
      loadData();
    }
  }, [user, authLoading, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const res = await saveBrandCategoryAction({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
      });

      if (!res.ok) {
        alert(res.error || 'Failed to create category');
        return;
      }

      setIsModalOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (catSlug: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    const res = await deleteBrandCategoryAction(catSlug);
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.slug !== catSlug));
    } else {
      alert(res.error || 'Failed to delete category');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
        Loading categories...
      </div>
    );
  }

  return (
    <ShopifyShell brand={brand}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p style={{ fontSize: '0.8125rem', color: '#6d7175', margin: '0.2rem 0 0 0' }}>
            Organize products into categories so customers can filter and browse your store.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.btnPrimary}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Create category</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5', color: '#6d7175' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Slug Handle</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Products</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr
                key={c.id || c.slug}
                style={{ borderBottom: '1px solid #f1f2f4' }}
              >
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#111213' }}>
                  {c.name}
                  {c.description && (
                    <div style={{ fontSize: '0.75rem', color: '#6d7175', fontWeight: 400 }}>
                      {c.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#6d7175', fontFamily: 'monospace' }}>
                  {c.slug}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link
                    href={`/brand/products?category=${c.slug}`}
                    style={{ color: '#008060', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {c.productCount || 0} products →
                  </Link>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(c.slug, c.name)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'transparent',
                      border: '1px solid #fed2cd',
                      borderRadius: '4px',
                      color: '#d72c0d',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '480px',
            padding: '1.5rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>
              Create Category
            </h2>
            <form onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lawn Collection"
                  className={styles.input}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''));
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Handle / Slug</label>
                <input
                  type="text"
                  required
                  placeholder="lawn-collection"
                  className={styles.input}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description (optional)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Short note about this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={styles.btnPrimary}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ShopifyShell>
  );
}
