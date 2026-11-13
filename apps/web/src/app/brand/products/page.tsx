'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyBrandAction,
  getMyBrandProductsAction,
  deleteBrandProductAction,
  getMyBrandCategoriesAction,
} from '../../../lib/supabase/actions';
import ShopifyShell from '../../../components/brand/ShopifyShell';
import styles from './shopify-product.module.css';

export default function BrandProductsListPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'DRAFT'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadData = async () => {
    try {
      const [brandRes, prodRes, catRes] = await Promise.all([
        getMyBrandAction(),
        getMyBrandProductsAction(),
        getMyBrandCategoriesAction(),
      ]);

      if (!brandRes.ok) {
        router.push('/brand/application-status');
        return;
      }
      setBrand(brandRes.data);
      if (prodRes.ok) setProducts(prodRes.data || []);
      if (catRes.ok) setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const res = await deleteBrandProductAction(id);
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.error || 'Failed to delete product');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
        Loading products...
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesTab && matchesCat;
  });

  return (
    <ShopifyShell brand={brand}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Products</h1>
        <div className={styles.headerActions}>
          <Link href="/brand/products/new" className={styles.btnPrimary}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add product</span>
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
        {/* Filter bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #e1e3e5',
          background: '#ffffff',
          gap: '1rem',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['ALL', 'ACTIVE', 'DRAFT'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: 'none',
                  background: activeTab === tab ? '#f1f2f4' : 'transparent',
                  color: activeTab === tab ? '#111213' : '#6d7175',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: activeTab === tab ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '450px' }}>
            <input
              type="text"
              placeholder="Search products by title or SKU..."
              className={styles.input}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.8125rem', height: '32px' }}
            />
            <select
              className={styles.select}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ fontSize: '0.8125rem', height: '32px', width: 'auto' }}
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5', color: '#6d7175' }}>
              <th style={{ padding: '0.65rem 1rem', width: '48px' }}></th>
              <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Product</th>
              <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Inventory</th>
              <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '0.65rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
                  No products found. Click "Add product" to create one.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: '1px solid #f1f2f4', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      background: '#f1f2f4',
                      border: '1px solid #e1e3e5',
                    }}>
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <Link
                      href={`/brand/products/new?id=${p.id}`}
                      style={{ fontWeight: 600, color: '#111213', textDecoration: 'none' }}
                    >
                      {p.title}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>SKU: {p.sku}</div>
                  </td>
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: p.status === 'ACTIVE' ? '#e4f8ec' : '#f1f2f4',
                      color: p.status === 'ACTIVE' ? '#108043' : '#6d7175',
                    }}>
                      {p.status === 'ACTIVE' ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: p.stock > 0 ? '#111213' : '#d72c0d' }}>
                    {p.stock > 0 ? `${p.stock} in stock` : '0 in stock'}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: '#6d7175' }}>
                    {p.categoryLabel || p.category}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>
                    Rs. {p.price.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                    <Link
                      href={`/brand/products/new?id=${p.id}`}
                      style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem',
                        color: '#202223',
                        background: '#ffffff',
                        border: '1px solid #c9cccf',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        marginRight: '0.4rem',
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem',
                        color: '#d72c0d',
                        background: 'transparent',
                        border: '1px solid #fed2cd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ShopifyShell>
  );
}
