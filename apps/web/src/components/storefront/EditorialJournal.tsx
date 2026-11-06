import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './EditorialJournal.module.css';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: string;
  href: string;
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The Renaissance of Desi Botanicals: Saffron, Rose & Cold-Pressed Rosehip',
    category: 'Botanical Science',
    readTime: '5 min read',
    author: 'Makaura Editorial',
    excerpt: 'How contemporary Pakistani indie chemists are marrying age-old Himalayan herbology with modern active peptides and bakuchiol.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    href: '/shop',
  },
  {
    id: 'art-2',
    title: 'The Architecture of Olfaction: The Art of Layering Aged Oud & Floral Attars',
    category: 'Niche Fragrance',
    readTime: '4 min read',
    author: 'Aura Scents House',
    excerpt: 'An olfactory masterclass on harmonizing dense Cambodian agarwood with fresh Bulgarian and Damascena rose notes.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    href: '/shop',
  },
  {
    id: 'art-3',
    title: 'Conscious Luxury: What Truly Goes into Halal-Certified Clean Cosmetics',
    category: 'Formulator Journal',
    readTime: '6 min read',
    author: 'Noor Artisanal Labs',
    excerpt: 'Inside the ethical formulation standards required to produce silky, long-wearing lipsticks and peptide skin drops with 0% harmful fillers.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    href: '/shop',
  },
];

export default function EditorialJournal() {
  return (
    <section className={styles.section} aria-label="Haute Beauté Journal">
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className={styles.kicker}>The Makaura Journal</div>
            <h2 className={styles.heading}>Stories from the Formulators</h2>
            <p className={styles.subheading}>
              In-depth essays on raw ingredient sourcing, botanical distillation, and the
              thriving artisan beauty movement in South Asia.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {ARTICLES.map((article) => (
            <Link key={article.id} href={article.href} className={styles.articleCard} id={`journal-${article.id}`}>
              <div className={styles.imageFrame}>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className={styles.articleImage}
                />
                <div className={styles.metaRow}>
                  <span className={styles.categoryTag}>{article.category}</span>
                  <span className={styles.readTime}>{article.readTime}</span>
                </div>
              </div>

              <div className={styles.content}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.excerpt}>{article.excerpt}</p>

                <div className={styles.footer}>
                  <span>By {article.author}</span>
                  <span className={styles.readLink}>
                    Read Article
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

