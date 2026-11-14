export interface MarketplaceBrandCard {
  name: string;
  slug: string;
  origin: string;
  category: string;
  focus: string;
  productCount: number;
  image: string;
  logoUrl?: string;
  isReal?: boolean;
}

export const DUMMY_STORE_BRANDS: MarketplaceBrandCard[] = [
  {
    name: "Adan's Libas",
    slug: 'adans-libas',
    origin: 'Lahore, PK',
    category: 'Luxury Pret Couture',
    focus: 'Timeless Pakistani craftsmanship, hand-embroidered silhouettes, and contemporary luxury festive formals.',
    productCount: 48,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Maison de Rose',
    slug: 'maison-de-rose',
    origin: 'Lahore, PK',
    category: 'Botanical Skincare',
    focus: 'Cold-pressed Kashmiri rosehip & pure saffron cellular elixirs.',
    productCount: 18,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Noor Artisanal Cosmetics',
    slug: 'noor-artisanal',
    origin: 'Islamabad, PK',
    category: 'Velvet Color Cosmetics',
    focus: 'Halal silk lip rouges, mineral foundation drops & soft blushes.',
    productCount: 24,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Aura Scents House',
    slug: 'aura-scents',
    origin: 'Karachi, PK',
    category: 'Niche Perfumery',
    focus: 'Hand-distilled Cambodian oud, ambergris & Damascena attars.',
    productCount: 14,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Botanica Raw Labs',
    slug: 'botanica-raw-labs',
    origin: 'Gilgit-Baltistan',
    category: 'Scalp & Hair Rituals',
    focus: 'High-altitude rosemary scalp oils & cold-extracted wild amla.',
    productCount: 16,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Indisense Rituals',
    slug: 'indisense-rituals',
    origin: 'Peshawar, KP',
    category: 'Artisanal Bath & Body',
    focus: 'Restorative body scrubs, Kashmiri walnut polishes, and soothing night butters.',
    productCount: 12,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Amber & Silk Apothecary',
    slug: 'amber-silk',
    origin: 'Faisalabad, PK',
    category: 'Pure Distillates & Hydrosols',
    focus: 'Small-batch steam distilled neroli, vetiver, and steam-extracted mogra waters.',
    productCount: 7,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
  },
];

export interface MarketplaceCategoryCircle {
  id: string;
  name: string;
  image: string;
  href: string;
  isReal?: boolean;
}

export const DUMMY_CATEGORY_CIRCLES: MarketplaceCategoryCircle[] = [
  { id: 'serums', name: 'Active Serums', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=95', href: '/categories/skincare' },
  { id: 'lip-tints', name: 'Lip Tints', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=95', href: '/categories/makeup' },
  { id: 'niche-perfumes', name: 'Niche Perfumes', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=95', href: '/categories/fragrance' },
  { id: 'haircare', name: 'Hair & Scalp', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=95', href: '/categories/haircare' },
  { id: 'face-creams', name: 'Face Creams', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=95', href: '/categories/skincare' },
  { id: 'cleansers', name: 'Cleansers', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=95', href: '/categories/skincare' },
  { id: 'eye-makeup', name: 'Eye Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=95', href: '/categories/makeup' },
  { id: 'sunscreen', name: 'Sun Care SPF', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=95', href: '/categories/skincare' },
  { id: 'blush-glow', name: 'Blush & Glow', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=95', href: '/categories/makeup' },
  { id: 'artisanal-attar', name: 'Artisanal Attar', image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=95', href: '/categories/fragrance' },
  { id: 'body-rituals', name: 'Body Rituals', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=95', href: '/categories/bath-body' },
  { id: 'face-masks', name: 'Face Masks', image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=95', href: '/categories/skincare' },
  { id: 'foundations', name: 'Foundations', image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=95', href: '/categories/makeup' },
  { id: 'tools', name: 'Beauty Tools', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=95', href: '/categories/tools' },
];

export interface MarketplaceProductCard {
  id: string;
  name: string;
  brandName: string;
  brandSlug: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  category?: string;
  image: string;
  href: string;
  isReal?: boolean;
}

export const DUMMY_FEATURED_PRODUCTS: MarketplaceProductCard[] = [
  {
    id: 'prod-saffron-rose',
    name: 'Pure Saffron & Cold-Pressed Kashmiri Rosehip Cellular Elixir',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    price: 4850,
    compareAtPrice: 5500,
    rating: 4.9,
    reviewCount: 84,
    badge: 'Bestseller',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-saffron-rose',
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
    id: 'prod-pearl-tint',
    name: 'Luminous Pearl Peptide Mineral Foundation Drops',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    price: 4500,
    rating: 4.8,
    reviewCount: 57,
    badge: 'Weightless',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-pearl-tint',
  },
  {
    id: 'prod-ambergris-extrait',
    name: 'Wild Ambergris & Cardamom Extrait de Parfum 50ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    price: 11500,
    compareAtPrice: 13000,
    rating: 5.0,
    reviewCount: 28,
    badge: 'Limited',
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80',
    href: '/product/prod-ambergris-extrait',
  },
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
];

