'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import ProductCard, { Product } from '../../../components/storefront/ProductCard';
import {
  getProductById,
  StoreOwnerProductDetails,
  ProductReview,
} from '../../../data/products';
import styles from './product-page.module.css';

const SIMILAR_PRODUCTS: Product[] = [
  {
    id: 'prod-bakuchiol-balm',
    name: 'Bakuchiol 2% Cellular Night Smoothing Nectar 50ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 5400,
    compareAtPrice: 6200,
    rating: 4.9,
    reviewCount: 63,
    badge: 'Formulator Pick',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-bakuchiol-balm',
  },
  {
    id: 'prod-velvet-lip-rouge',
    name: 'Velvet Matte Silk Lip Rouge in "Lahore Dahlia"',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 3200,
    compareAtPrice: 3800,
    rating: 4.8,
    reviewCount: 42,
    badge: 'New Shade',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-velvet-lip-rouge',
  },
  {
    id: 'prod-oud-damascena',
    name: 'Cambodian Oud & Damascena Attar Concentrée 12ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 8900,
    compareAtPrice: 10500,
    rating: 5.0,
    reviewCount: 19,
    badge: 'Artisanal Batch',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-oud-damascena',
  },
  {
    id: 'prod-amla-rosemary',
    name: 'Botanical Amla & Wild Rosemary Scalp Tonic 100ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    price: 3650,
    rating: 4.9,
    reviewCount: 116,
    badge: 'Clean Halal',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-amla-rosemary',
  },
];

const SHOPPERS_ALSO_VIEWED: Product[] = [
  {
    id: 'prod-sandalwood-scrub',
    name: 'Wild Sandalwood & Raw Cane Sugar Body Soufflé 250g',
    brandName: 'Indisense Rituals',
    brandSlug: 'indisense-rituals',
    price: 4100,
    compareAtPrice: 4800,
    rating: 4.8,
    reviewCount: 51,
    badge: 'Organic Wild',
    category: 'bath-body',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-sandalwood-scrub',
  },
  {
    id: 'prod-peptide-tint',
    name: 'Luminous Peptide Hydro-Skin Tint SPF 30',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 3950,
    compareAtPrice: 4600,
    rating: 4.7,
    reviewCount: 38,
    badge: 'Trending',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-peptide-tint',
  },
  {
    id: 'prod-rose-clay-mask',
    name: 'Rose & Pink Himalayan Clay Purifying Mask 100ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    price: 2950,
    rating: 4.9,
    reviewCount: 77,
    badge: 'Purifying',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-rose-clay-mask',
  },
  {
    id: 'prod-amber-attar',
    name: 'Imperial White Amber & Taif Rose Attar 6ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 6500,
    compareAtPrice: 7500,
    rating: 5.0,
    reviewCount: 29,
    badge: 'Pure Extrait',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-amber-attar',
  },
];

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = (params?.id as string) || 'prod-saffron-rose';
  const product = getProductById(productId);

  // Interactive Gallery Carousel State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Purchase States
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Review System States
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(product.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState(false);

  // Sync state whenever the product route or ID changes
  useEffect(() => {
    setCurrentImgIndex(0);
    const popIdx = product.sizes.findIndex((s) => s.isPopular);
    setSelectedSizeIndex(popIdx >= 0 ? popIdx : 0);
    setQuantity(1);
    setReviewsList(product.reviews || []);
    setShowReviewForm(false);
    setReviewSubmittedNotice(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productId]);

  const currentPrice = product.sizes[selectedSizeIndex]?.price || product.price;
  const currentCompareAt = product.compareAtPrice;
  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : null;

  // Carousel Controls
  const handlePrevImage = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToBag = () => {
    addItem({
      id: product.id,
      name: product.name,
      brandName: product.brandName,
      brandSlug: product.brandSlug,
      price: currentPrice,
      image: product.images[0],
      volume: product.sizes[selectedSizeIndex]?.volume,
    }, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      brandName: product.brandName,
      brandSlug: product.brandSlug,
      price: currentPrice,
      image: product.images[0],
      volume: product.sizes[selectedSizeIndex]?.volume,
    }, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: `${newReviewAuthor.trim()}${newReviewCity.trim() ? ` (${newReviewCity.trim()})` : ''}`,
      verified: true,
      date: 'Just now',
      stars: newReviewRating,
      comment: newReviewComment.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewComment('');
    setShowReviewForm(false);
    setReviewSubmittedNotice(true);
    setTimeout(() => setReviewSubmittedNotice(false), 5000);
  };

  return (
    <div className={styles.pageRoot}>
      {/* 1. Breadcrumbs */}
      <nav className={styles.breadcrumbsBar} aria-label="Breadcrumb Navigation">
        <div className="container">
          <ol className={styles.breadcrumbList}>
            <li><Link href="/">Home</Link></li>
            <li className={styles.sep}>/</li>
            <li><Link href={`/categories/${product.category}`}>{product.categoryLabel}</Link></li>
            <li className={styles.sep}>/</li>
            <li><Link href={`/brands?brand=${product.brandSlug}`}>{product.brandName}</Link></li>
            <li className={styles.sep}>/</li>
            <li className={styles.activeCrumb} aria-current="page">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* 2. Main Product Grid */}
      <main className={styles.mainProductSection}>
        <div className="container">
          <div className={styles.heroGrid}>
            {/* LEFT COLUMN (Sticky until right column finishes) */}
            <div className={styles.leftColumn}>
              {/* Product Gallery Carousel with Vertical Thumbnails & Slider Arrows */}
              <div className={styles.galleryWrapper}>
                {/* Vertical Thumbnail Rail */}
                <div className={styles.thumbnailRail} role="tablist" aria-label="Product thumbnails">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`${styles.thumbnailBtn} ${currentImgIndex === idx ? styles.thumbActive : ''}`}
                      aria-label={`View photo ${idx + 1}`}
                      aria-selected={currentImgIndex === idx}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} preview ${idx + 1}`}
                        fill
                        sizes="74px"
                        className={styles.thumbImg}
                      />
                    </button>
                  ))}
                </div>

                {/* Main Carousel Image Frame with Navigation Arrows */}
                <div className={styles.mainImageFrame}>
                  <Image
                    src={product.images[currentImgIndex] || product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 580px"
                    className={styles.mainImage}
                  />

                  {/* Top Badges */}
                  <div className={styles.imageBadgeGroup}>
                    {product.badge && (
                      <span className={styles.bestsellerBadge}>
                        {product.badge.toUpperCase()}
                      </span>
                    )}
                    <span className={styles.authenticPill}>
                      100% FORMULATOR AUTHENTIC
                    </span>
                  </div>

                  {/* Carousel Previous & Next Arrow Buttons */}
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className={`${styles.carouselNavBtn} ${styles.carouselPrev}`}
                    aria-label="Previous product image"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className={`${styles.carouselNavBtn} ${styles.carouselNext}`}
                    aria-label="Next product image"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Carousel Dot Indicators */}
                  <div className={styles.carouselDotsRow}>
                    {product.images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentImgIndex(dotIdx)}
                        className={`${styles.carouselDot} ${currentImgIndex === dotIdx ? styles.carouselDotActive : ''}`}
                        aria-label={`Jump to image ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Floating View Similar Pill */}
                  <Link href="#similar-section" className={styles.viewSimilarPill}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>View similar</span>
                  </Link>
                </div>
              </div>

              {/* Styling Videos (Clean & Video-Only — Hidden Details Under Video) */}
              <section className={styles.videosSection} aria-label="Styling & Application Videos">
                <div className={styles.sectionHeaderSmall}>
                  <h3 className={styles.videoHeading}>Styling Videos</h3>
                  <span className={styles.videoCount}>4 formulation reels</span>
                </div>

                <div className={styles.videosGrid}>
                  {product.videos.map((vid, idx) => (
                    <div
                      key={idx}
                      className={styles.videoCard}
                      onClick={() => alert(`Playing application reel: "${vid.title}"`)}
                      title={`Play: ${vid.title}`}
                    >
                      <div className={styles.videoThumbFrame}>
                        <Image
                          src={vid.thumb}
                          alt={vid.title}
                          fill
                          sizes="180px"
                          className={styles.videoImg}
                        />
                        <div className={styles.playOverlay}>
                          <div className={styles.playCircle}>
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                          <span className={styles.durationTag}>{vid.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ratings and Reviews with "+ Write a Review" Option */}
              <section className={styles.reviewsSection} aria-label="Customer Ratings and Reviews">
                <div className={styles.sectionHeaderSmall}>
                  <div>
                    <h3 className={styles.reviewsHeading}>Ratings and reviews</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className={styles.writeReviewBtn}
                  >
                    {showReviewForm ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close Form
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Write a review
                      </span>
                    )}
                  </button>
                </div>

                {reviewSubmittedNotice && (
                  <div className={styles.reviewSuccessNotice}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Thank you! Your review has been submitted as a verified customer.
                  </div>
                )}

                {/* Expandable Write a Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className={styles.reviewFormCard}>
                    <h4 className={styles.reviewFormTitle}>Share Your Formulation Experience</h4>

                    {/* Star Rating Select */}
                    <div className={styles.starSelectRow}>
                      <span className={styles.starSelectLabel}>Your Rating:</span>
                      <div className={styles.starSelectGroup}>
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setNewReviewRating(starVal)}
                            className={`${styles.starSelectBtn} ${starVal <= newReviewRating ? styles.starSelected : ''}`}
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={starVal <= newReviewRating ? '#C5A880' : '#D1D5DB'}>
                              <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formInputsRow}>
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Maryam K.)"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className={styles.formInput}
                        required
                      />
                      <input
                        type="text"
                        placeholder="City (e.g. Lahore / Islamabad)"
                        value={newReviewCity}
                        onChange={(e) => setNewReviewCity(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>

                    <textarea
                      placeholder="Describe the texture, results on your skin, and overall experience..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className={styles.formTextarea}
                      rows={3}
                      required
                    />

                    <div className={styles.formActionsRow}>
                      <button type="submit" className={styles.submitReviewBtn}>
                        Submit Verified Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className={styles.cancelReviewBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Ratings Breakdown Summary */}
                <div className={styles.ratingsCard}>
                  <div className={styles.ratingScoreCol}>
                    <div className={styles.bigRatingNumber}>
                      <span>{product.rating}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#C5A880" style={{ display: 'inline-block' }}>
                        <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                      </svg>
                    </div>
                    <span className={styles.totalRatingsLabel}>{reviewsList.length + 114} verified ratings</span>
                  </div>

                  <div className={styles.breakdownBarsCol}>
                    {[
                      { star: 5, pct: '92%' },
                      { star: 4, pct: '6%' },
                      { star: 3, pct: '2%' },
                      { star: 2, pct: '0%' },
                      { star: 1, pct: '0%' },
                    ].map((row) => (
                      <div key={row.star} className={styles.breakdownRow}>
                        <span className={styles.starNumber} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          {row.star}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#C5A880">
                            <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                          </svg>
                        </span>
                        <div className={styles.progressTrack}><div className={styles.progressBar} style={{ width: row.pct }} /></div>
                        <span className={styles.starPercent}>{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Reviews List */}
                <div className={styles.reviewsList}>
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className={styles.reviewItem}>
                      <div className={styles.reviewTopRow}>
                        <div className={styles.reviewerMeta}>
                          <span className={styles.reviewerName}>{rev.author}</span>
                          {rev.verified && (
                            <span className={styles.verifiedBuyerTag}>
                              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '3px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className={styles.reviewDate}>{rev.date}</span>
                      </div>
                      <div className={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((sVal) => (
                          <svg
                            key={sVal}
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={sVal <= rev.stars ? '#C5A880' : '#E2E8F0'}
                            style={{ display: 'inline-block', marginRight: '1px' }}
                          >
                            <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                          </svg>
                        ))}
                      </div>
                      <p className={styles.reviewBody}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN (Store Owner Details & Action Controls) */}
            <div className={styles.rightColumn}>
              {/* Store Owner Header & Quick Actions */}
              <div className={styles.storeHeaderRow}>
                <div className={styles.storeInfoGroup}>
                  <Link href={`/brands?brand=${product.brandSlug}`} className={styles.storeBrandLink}>
                    <span className={styles.storeName}>{product.brandName}</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className={styles.storeMetaBadge}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#C5A880" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '3px' }}>
                      <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                    </svg>
                    {product.brandRating} • {product.brandItemsSold} Formulations Delivered
                  </span>
                </div>

                <div className={styles.quickActionsGroup}>
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`${styles.iconActionBtn} ${isWishlisted ? styles.wishlistedActive : ''}`}
                    title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    aria-label="Wishlist toggle"
                  >
                    <svg width="18" height="18" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className={styles.iconActionBtn}
                    title="Share Formulation"
                    aria-label="Share formulation"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {showShareToast && (
                <div className={styles.shareToast}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '5px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Formulation link copied to clipboard!
                </div>
              )}

              {/* Main Product Title */}
              <h1 className={styles.productTitle}>{product.name}</h1>

              {/* Rating stars and SKU */}
              <div className={styles.ratingSkuRow}>
                <div className={styles.starsGroup}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#C5A880">
                        <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                      </svg>
                    ))}
                  </div>
                  <span className={styles.ratingNumberText}>{product.rating}</span>
                  <span className={styles.reviewCountText}>({reviewsList.length + 114} reviews)</span>
                </div>
                <div className={styles.skuTag}>SKU: {product.sku}</div>
              </div>

              {/* Price Container */}
              <div className={styles.priceContainer}>
                <div className={styles.priceMainRow}>
                  <span className={styles.currencySymbol}>PKR</span>
                  <span className={styles.currentPriceText}>{currentPrice.toLocaleString()}</span>
                  {currentCompareAt && (
                    <span className={styles.comparePriceText}>
                      PKR {currentCompareAt.toLocaleString()}
                    </span>
                  )}
                  {discountPercent && (
                    <span className={styles.discountBadge}>
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className={styles.loyaltyStrip}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#C5A880" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '4px' }}>
                    <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z" />
                  </svg>
                  <span>Earn <strong>48 Beauty Club Points</strong> • Direct Cash on Delivery (COD) Nationwide</span>
                </div>
              </div>

              {/* Beautifully Redesigned Luxury Size Selector (Minimalist Pill Design) */}
              <div className={styles.sizeSection}>
                <div className={styles.sizeHeader}>
                  <span className={styles.sizeTitle}>SIZE</span>
                  <span className={styles.sizeActiveLabel}>{product.sizes[selectedSizeIndex]?.label}</span>
                </div>

                <div className={styles.sizePillsGroup}>
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`${styles.sizePill} ${selectedSizeIndex === idx ? styles.sizePillActive : ''}`}
                    >
                      <span className={styles.sizePillVolume}>{s.volume}</span>
                      <span className={styles.sizePillPrice}>PKR {s.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className={styles.quantityRow}>
                <span className={styles.quantityLabel}>Quantity:</span>
                <div className={styles.quantityCapsule}>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className={styles.qtyBtn}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className={styles.qtyVal}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className={styles.qtyBtn}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div className={styles.actionButtonsCol}>
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`${styles.addToBagBtn} ${addedNotice ? styles.addedToBagSuccess : ''}`}
                  id="btn-add-to-bag-single"
                >
                  {addedNotice ? (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className={styles.buyNowBtn}
                  id="btn-buy-now-single"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Beautifully Redesigned Luxury Trust Badges */}
              <div className={styles.trustBadgesGrid}>
                <div className={styles.trustCard}>
                  <div className={styles.trustIconBox}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className={styles.trustContent}>
                    <span className={styles.trustTitle}>Free Nationwide Delivery</span>
                    <span className={styles.trustSub}>Orders PKR 2,500+</span>
                  </div>
                </div>

                <div className={styles.trustCard}>
                  <div className={styles.trustIconBox}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className={styles.trustContent}>
                    <span className={styles.trustTitle}>100% Authentic</span>
                    <span className={styles.trustSub}>Certified indie lab batch</span>
                  </div>
                </div>

                <div className={styles.trustCard}>
                  <div className={styles.trustIconBox}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className={styles.trustContent}>
                    <span className={styles.trustTitle}>Cash on Delivery</span>
                    <span className={styles.trustSub}>Inspect before payment</span>
                  </div>
                </div>
              </div>

              {/* Minimalist Product Details Table (Details Added By Store Owner) */}
              <div className={styles.storeOwnerDetailsBlock}>
                <h3 className={styles.detailsBlockHeading}>Product Details</h3>
                <div className={styles.specsTable}>
                  {product.specs.map((row, idx) => (
                    <div key={idx} className={styles.specsRow}>
                      <span className={styles.specLabel}>{row.label}</span>
                      <span className={styles.specValue}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimalist Description & Protocol (No AI Clutter) */}
              <div className={styles.minimalistDescriptionBlock}>
                <h3 className={styles.detailsBlockHeading}>Description &amp; Ritual</h3>
                <p className={styles.descText}>{product.description}</p>

                <div className={styles.ritualBox}>
                  <strong>How to Apply:</strong>
                  <ul>
                    {product.ritualBullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.inciBox}>
                  <strong>Full Ingredients (INCI):</strong>
                  <p>{product.inci}</p>
                </div>

                <div className={styles.noteBox}>
                  <strong>Formulator Note:</strong>
                  <p>{product.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Similar Products */}
      <section className={styles.relatedSection} id="similar-section" aria-label="Similar Products">
        <div className="container">
          <div className={styles.relatedHeaderRow}>
            <div>
              <h2 className={styles.relatedHeading}>Similar Products</h2>
              <span className={styles.relatedSub}>Formulations with shared active botanicals</span>
            </div>
            <Link href={`/categories/${product.category}`} className={styles.viewCategoryLink}>
              View More in {product.categoryLabel} →
            </Link>
          </div>

          <div className={styles.relatedGrid}>
            {SIMILAR_PRODUCTS.filter((prod) => prod.id !== product.id).slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shoppers Also Viewed */}
      <section className={styles.relatedSection} aria-label="Shoppers Also Viewed">
        <div className="container">
          <div className={styles.relatedHeaderRow}>
            <div>
              <h2 className={styles.relatedHeading}>Shoppers Also Viewed</h2>
              <span className={styles.relatedSub}>Customer favorites &amp; viral indie releases</span>
            </div>
            <Link href="/shop" className={styles.viewCategoryLink}>
              Explore Marketplace Catalog →
            </Link>
          </div>

          <div className={styles.relatedGrid}>
            {SHOPPERS_ALSO_VIEWED.filter((prod) => prod.id !== product.id).slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
