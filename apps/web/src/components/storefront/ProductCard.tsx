'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

export interface Product {
  id: string;
  name: string;
  brandName: string;
  brandSlug: string;
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  badge?: string;
  category?: string;
  href?: string;
}

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

const FALLBACK_BEAUTY_IMAGE =
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80';

export default function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image || FALLBACK_BEAUTY_IMAGE);

  const productUrl = product.href || `/product/${product.id}`;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      brandName: product.brandName,
      brandSlug: product.brandSlug,
      price: product.price,
      image: product.image,
    }, 1);

    if (onQuickAdd) {
      onQuickAdd(product);
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article className={styles.card} id={`product-card-${product.id}`}>
      {/* Product Image Area */}
      <div className={styles.imageArea}>
        <Link href={productUrl} className={styles.imageLink} aria-label={product.name}>
          <Image
            src={imageSrc}
            alt={`${product.brandName} - ${product.name}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={styles.productImage}
            onError={() => setImageSrc(FALLBACK_BEAUTY_IMAGE)}
          />
        </Link>

        {/* Badge (e.l.f. Style Black Tag) */}
        {product.badge && (
          <span className={styles.badge}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistActive : ''}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={isWishlisted ? '#000000' : 'none'}
            stroke="#000000"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick Add To Bag Action */}
        <div className={styles.quickAddWrapper}>
          <button
            onClick={handleQuickAdd}
            className={`${styles.quickAddBtn} ${addedNotice ? styles.quickAddSuccess : ''}`}
            aria-label={`Add ${product.name} to bag`}
          >
            {addedNotice ? (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>QUICK ADD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className={styles.details}>
        {/* Brand Name */}
        <Link href={`/shop?brand=${product.brandSlug}`} className={styles.brandName}>
          {product.brandName}
        </Link>

        {/* Product Title */}
        <Link href={productUrl}>
          <h3 className={styles.productTitle}>{product.name}</h3>
        </Link>

        {/* Rating Stars */}
        <div className={styles.ratingRow}>
          <div className={styles.stars} aria-label={`${product.rating || 5} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={star <= Math.round(product.rating || 5) ? '#C5A880' : '#E2E8F0'}
                style={{ display: 'inline-block', marginRight: '1px' }}
              >
                <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
              </svg>
            ))}
          </div>
          <span className={styles.reviewCount}>
            ({product.reviewCount || 38})
          </span>
        </div>

        {/* Price Row */}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            Rs. {product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className={styles.compareAt}>
              Rs. {product.compareAtPrice.toLocaleString()}
            </span>
          )}
          {discountPercent && (
            <span className={styles.discountBadge}>
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
