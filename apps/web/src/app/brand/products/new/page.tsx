'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import {
  getMyBrandAction,
  getMyBrandProductsAction,
  saveBrandProductAction,
  getMyBrandCategoriesAction,
  uploadBrandAssetAction,
} from '../../../../lib/supabase/actions';
import ShopifyShell from '../../../../components/brand/ShopifyShell';
import styles from '../shopify-product.module.css';

const SAMPLE_MEDIA = [
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
];

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const { user, isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields (Shopify Model)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('15');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/brand/login');
        return;
      }

      Promise.all([
        getMyBrandAction(),
        getMyBrandCategoriesAction(),
        getMyBrandProductsAction(),
      ])
        .then(([bRes, cRes, pRes]) => {
          if (!bRes.ok) {
            router.push('/brand/application-status');
            return;
          }
          setBrand(bRes.data);
          const cats = cRes.ok ? cRes.data || [] : [];
          setCategories(cats);

          if (editId && pRes.ok) {
            const existing = pRes.data?.find((p: any) => p.id === editId);
            if (existing) {
              setTitle(existing.title || '');
              setDescription(existing.description || '');
              setImages(existing.images || []);
              setPrice(existing.price ? existing.price.toString() : '');
              setCompareAtPrice(existing.compareAtPrice ? existing.compareAtPrice.toString() : '');
              setCostPrice(existing.costPrice ? existing.costPrice.toString() : '');
              setSku(existing.sku || '');
              setStock(existing.stock !== undefined ? existing.stock.toString() : '10');
              setCategory(existing.category || (cats[0]?.slug || 'pret'));
              setStatus(existing.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE');
            }
          } else {
            // New product defaults
            setCategory(cats[0]?.slug || 'pret');
            setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
            setImages([SAMPLE_MEDIA[0]]);
          }
          setIsLoading(false);
        })
        .catch(() => router.push('/brand/application-status'));
    }
  }, [user, authLoading, router, editId]);

  const handleAddImage = (urlToAdd: string) => {
    if (!urlToAdd.trim()) return;
    if (!images.includes(urlToAdd.trim())) {
      setImages([...images, urlToAdd.trim()]);
    }
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [selected, ...remaining];
    });
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    setImages((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Please select valid image files (JPG, PNG, WEBP, etc.)');
      return;
    }

    setIsUploadingFiles(true);
    setUploadProgressText(`Uploading ${fileArray.length} image${fileArray.length > 1 ? 's' : ''} to CDN...`);

    try {
      const uploadPromises = fileArray.map(async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'products');
        const res = await uploadBrandAssetAction(fd);
        if (res.ok && res.data?.url) {
          return res.data.url;
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter((u): u is string => Boolean(u));

      if (validUrls.length > 0) {
        setImages((prev) => [...prev, ...validUrls]);
        setToastMessage(`Successfully uploaded ${validUrls.length} image${validUrls.length > 1 ? 's' : ''}`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert('Failed to upload images. Please check file sizes or connection.');
      }
    } catch (err: any) {
      console.error('Multi-image upload error:', err);
      alert('Error uploading images: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingFiles(false);
      setUploadProgressText(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert('Please fill in product title and price.');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCat = categories.find((c) => c.slug === category);
      const res = await saveBrandProductAction({
        id: editId || undefined,
        title: title.trim(),
        description: description.trim(),
        images: images.length > 0 ? images : [SAMPLE_MEDIA[0]],
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        sku: sku.trim(),
        stock: parseInt(stock, 10) || 0,
        category: category,
        categoryLabel: selectedCat?.name || 'Catalog Item',
        status: status,
      });

      if (!res.ok) {
        alert(res.error || 'Failed to save product');
        return;
      }

      setToastMessage('Product saved successfully');
      setTimeout(() => {
        router.push('/brand/products');
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6d7175' }}>
        Loading product editor...
      </div>
    );
  }

  return (
    <ShopifyShell brand={brand}>
      {toastMessage && (
        <div className={styles.toast}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <Link href="/brand/products" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Products</span>
        </Link>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {editId ? 'Edit product' : 'Add product'}
          </h1>
          <div className={styles.headerActions}>
            <Link href="/brand/products" className={styles.btnSecondary}>
              Discard
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className={styles.btnPrimary}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <form onSubmit={handleSubmit} className={styles.productGrid}>
        {/* Left Column (Primary Content) */}
        <div className={styles.columnMain}>
          {/* Title & Description Card */}
          <div className={styles.card}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Scarlet Embroidered Raw Silk Kurta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                placeholder="Describe your product, fabric specifications, craftsmanship, and styling notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Media / Gallery Card */}
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h2 className={styles.cardTitle} style={{ margin: 0 }}>Media Gallery</h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#6d7175' }}>
                  Upload product imagery (Shopify format). Select 10, 15, or more images at once. First image is the primary cover photo.
                </p>
              </div>
              {images.length > 0 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#008060', background: '#e3f1df', padding: '0.25rem 0.6rem', borderRadius: '12px' }}>
                  {images.length} Image{images.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Hidden multi-file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesSelected(e.target.files);
                }
              }}
            />

            {/* Upload Zone / Dropzone */}
            <div
              className={`${styles.galleryZone} ${isDraggingOver ? styles.galleryZoneActive : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!isUploadingFiles) {
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className={styles.galleryPrompt}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={isDraggingOver ? '#008060' : '#8c9196'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>

                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#202223' }}>
                  {isUploadingFiles ? (
                    <span style={{ color: '#008060' }}>{uploadProgressText || 'Uploading images...'}</span>
                  ) : isDraggingOver ? (
                    <span style={{ color: '#008060' }}>Drop your images here to upload</span>
                  ) : (
                    'Add files or drop photos here'
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6d7175' }}>
                  Accepts JPG, PNG, WEBP. Select multiple files (e.g. 10 to 15+ photos) at once.
                </div>

                <div className={styles.uploadActionRow} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={isUploadingFiles}
                    className={styles.uploadMediaBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{isUploadingFiles ? 'Uploading...' : 'Select Images'}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.toggleUrlBtn}
                    onClick={() => setShowUrlInput(!showUrlInput)}
                  >
                    {showUrlInput ? 'Hide URL Input' : 'Add from URL / Presets'}
                  </button>
                </div>
              </div>

              {/* Collapsible URL Input & Sample Presets */}
              {showUrlInput && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e1e3e5' }} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.galleryInputRow}>
                    <input
                      type="url"
                      className={styles.input}
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={() => handleAddImage(imageUrlInput)}
                    >
                      Add URL
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6d7175', alignSelf: 'center' }}>Quick Presets:</span>
                    {SAMPLE_MEDIA.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddImage(url)}
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          background: '#fff',
                          border: '1px solid #c9cccf',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Sample #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Image Grid */}
            {images.length > 0 && (
              <div className={styles.galleryGrid}>
                {images.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className={`${styles.imageItem} ${idx === 0 ? styles.imageItemPrimary : ''}`}
                  >
                    <img src={imgUrl} alt={`Product ${idx + 1}`} className={styles.imageThumb} />

                    {idx === 0 ? (
                      <span className={styles.primaryBadge}>Primary Cover</span>
                    ) : (
                      <span className={styles.orderBadge}>#{idx + 1}</span>
                    )}

                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      title="Remove image"
                    >
                      ×
                    </button>

                    <div className={styles.imageBottomActions}>
                      {idx > 0 && (
                        <button
                          type="button"
                          className={styles.makePrimaryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimary(idx);
                          }}
                          title="Set as storefront primary cover photo"
                        >
                          Make Cover
                        </button>
                      )}
                      <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                        {idx > 0 && (
                          <button
                            type="button"
                            className={styles.reorderBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMove(idx, 'left');
                            }}
                            title="Move left"
                          >
                            ‹
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            className={styles.reorderBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMove(idx, 'right');
                            }}
                            title="Move right"
                          >
                            ›
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add more tile in the grid */}
                <div
                  className={styles.addMoreTile}
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload more product photos"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Add media</span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pricing</h2>
            <div className={styles.priceGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Price (PKR)</label>
                <input
                  type="number"
                  required
                  min="0"
                  className={styles.input}
                  placeholder="Rs. 14850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Compare-at price (PKR)</label>
                <input
                  type="number"
                  min="0"
                  className={styles.input}
                  placeholder="Rs. 19800"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                />
                <span className={styles.helpText}>
                  Displays original crossed-out price and discount badge on your store.
                </span>
              </div>
            </div>
          </div>

          {/* Inventory Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Inventory</h2>
            <div className={styles.priceGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Quantity Available</label>
                <input
                  type="number"
                  required
                  min="0"
                  className={styles.input}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className={styles.columnSidebar}>
          {/* Status Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Status</h2>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="ACTIVE">Active (Live on store)</option>
              <option value="DRAFT">Draft</option>
            </select>
            <p className={styles.helpText}>
              Active products are immediately purchasable on Makaura.
            </p>
          </div>

          {/* Product Organization Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Product Organization</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className={styles.helpText}>
                Assigns which filter pill this item belongs to on your storefront.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Vendor / Store</label>
              <input
                type="text"
                disabled
                className={styles.input}
                value={brand?.name || user?.brand?.name || ''}
                style={{ background: '#f6f6f7', color: '#6d7175' }}
              />
            </div>
          </div>
        </div>
      </form>
    </ShopifyShell>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>Loading editor...</div>}>
      <ProductFormContent />
    </Suspense>
  );
}
