import fs from 'fs';
import path from 'path';

export interface StoreProduct {
  id: string;
  brandSlug: string;
  brandName: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
  images: string[];
  description: string;
  fabricDetails?: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface StoreCategory {
  id: string;
  brandSlug?: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  icon?: string;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  brandSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: {
    productId: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'COD' | 'ONLINE';
  codStatus: 'PENDING' | 'COLLECTED' | 'REMITTED';
  fulfillmentStatus: 'PENDING' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface StoreCustomer {
  id: string;
  brandSlug: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  tier: 'VIP' | 'Regular' | 'New';
}

interface StoreCatalogData {
  products: StoreProduct[];
  categories: StoreCategory[];
  orders: StoreOrder[];
  customers: StoreCustomer[];
}

const STORAGE_FILE = path.join(process.cwd(), 'src', 'data', 'store_catalog.json');

// Initial seed data matching the LAAM reference image
const SEED_DATA: StoreCatalogData = {
  categories: [
    { id: 'cat-lawn', name: 'Lawn Collection', slug: 'lawn', description: 'Breezy summer & festive printed lawn suites' },
    { id: 'cat-pret', name: 'Ready To Wear (Pret)', slug: 'pret', description: 'Contemporary daily & semi-formal stitched tunics' },
    { id: 'cat-lux-pret', name: 'Luxury Pret', slug: 'luxury-pret', description: 'Hand-embellished silk and organza formal wear' },
    { id: 'cat-formals', name: 'Festive Formals', slug: 'festive-formals', description: 'Bridal and festive embroidered ensembles' },
    { id: 'cat-unstitched', name: 'Unstitched 3-Piece', slug: 'unstitched', description: 'Pure chiffon, jacquard, and lawn fabrics' },
    { id: 'cat-skincare', name: 'Botanical Skincare', slug: 'skincare', description: 'Cold-pressed serums, elixirs & hydrosols' },
  ],
  products: [
    {
      id: 'prod-adan-01',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Scarlet Heritage Chiffon Dupatta & Embroidered Raw Silk Kurta',
      slug: 'scarlet-heritage-chiffon-kurta',
      category: 'luxury-pret',
      categoryLabel: 'Luxury Pret',
      sku: 'ADAN-SH-101',
      price: 14850,
      compareAtPrice: 19800,
      costPrice: 9200,
      stock: 24,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Stunning crimson-red pure raw silk kurta enriched with detailed hand zardozi and thread embroidery, paired with a featherlight chiffon dupatta.',
      fabricDetails: 'Pure Raw Silk Shirt, Pure Chiffon Dupatta, Cotton Silk Pants',
      rating: 4.9,
      reviewCount: 38,
      isFeatured: true,
      createdAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 'prod-adan-02',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Crimson Velvet Zari Embroidered Festive 3-Piece Ensemble',
      slug: 'crimson-velvet-zari-festive',
      category: 'festive-formals',
      categoryLabel: 'Festive Formals',
      sku: 'ADAN-CV-102',
      price: 18500,
      compareAtPrice: 24500,
      costPrice: 11000,
      stock: 15,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Opulent micro-velvet shirt embellished with heritage gold tilla and sequin work, tailored for winter soirees and weddings.',
      fabricDetails: 'Micro-Velvet Shirt, Embroidered Net Dupatta, Raw Silk Trouser',
      rating: 5.0,
      reviewCount: 42,
      isFeatured: true,
      createdAt: '2026-11-02T11:00:00Z',
    },
    {
      id: 'prod-adan-03',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Sage Bloom Handcrafted Lawn Pret 2-Piece Set',
      slug: 'sage-bloom-lawn-pret',
      category: 'pret',
      categoryLabel: 'Ready To Wear (Pret)',
      sku: 'ADAN-SB-103',
      price: 8900,
      compareAtPrice: 11500,
      costPrice: 4800,
      stock: 45,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Cool sage-green premium digital printed lawn kurta paired with matching tailored culottes and delicate lace trimmings.',
      fabricDetails: '100% Breathable Pima Lawn',
      rating: 4.8,
      reviewCount: 29,
      isFeatured: false,
      createdAt: '2026-11-03T12:00:00Z',
    },
    {
      id: 'prod-adan-04',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Teal Zari Embroidered Festive Organza Anarkali Set',
      slug: 'teal-zari-festive-organza',
      category: 'festive-formals',
      categoryLabel: 'Festive Formals',
      sku: 'ADAN-TZ-104',
      price: 22000,
      compareAtPrice: 28000,
      costPrice: 13500,
      stock: 8,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Royal deep teal flare Anarkali in sheer organza with hand-cut cutwork borders and shimmering silver metallic tilla work.',
      fabricDetails: 'Pure Korean Organza with Silk Lining and Jamawar Trouser',
      rating: 4.9,
      reviewCount: 19,
      isFeatured: true,
      createdAt: '2026-11-04T14:00:00Z',
    },
    {
      id: 'prod-adan-05',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Rust Sunset Raw Silk Tunic with Mirror Work',
      slug: 'rust-sunset-raw-silk-tunic',
      category: 'pret',
      categoryLabel: 'Ready To Wear (Pret)',
      sku: 'ADAN-RS-105',
      price: 11200,
      compareAtPrice: 14000,
      costPrice: 6500,
      stock: 18,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'A vibrant terracotta rust tunic crafted from pure raw silk, highlighted with authentic Rajasthani mirror-work on the neckline.',
      fabricDetails: 'Pure Raw Silk with Crepe Dupatta',
      rating: 4.7,
      reviewCount: 15,
      isFeatured: false,
      createdAt: '2026-11-05T09:00:00Z',
    },
    {
      id: 'prod-adan-06',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Mustard Gold Hand-Embellished Festive Kurta & Culottes',
      slug: 'mustard-gold-festive-kurta',
      category: 'luxury-pret',
      categoryLabel: 'Luxury Pret',
      sku: 'ADAN-MG-106',
      price: 16500,
      compareAtPrice: 21000,
      costPrice: 9800,
      stock: 12,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Radiant mustard gold silhouette enriched with gota patti and resham embroidery along sleeves and hemlines.',
      fabricDetails: 'Chanderi Silk Shirt with Organza Dupatta',
      rating: 5.0,
      reviewCount: 31,
      isFeatured: true,
      createdAt: '2026-11-06T15:00:00Z',
    },
    {
      id: 'prod-adan-07',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Midnight Aubergine Heavy Embroidered Velvet Kaftan',
      slug: 'midnight-aubergine-velvet-kaftan',
      category: 'luxury-pret',
      categoryLabel: 'Luxury Pret',
      sku: 'ADAN-MA-107',
      price: 19800,
      compareAtPrice: 26000,
      costPrice: 12000,
      stock: 6,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Floor-length plum aubergine velvet kaftan featuring intricate floral thread-work and shimmering bead borders.',
      fabricDetails: '100% Pure Silk Micro Velvet',
      rating: 4.9,
      reviewCount: 22,
      isFeatured: false,
      createdAt: '2026-11-07T16:00:00Z',
    },
    {
      id: 'prod-adan-08',
      brandSlug: 'adans-libas',
      brandName: "Adan's Libas",
      title: 'Pastel Mint Embroidered Lawn 3-Piece Suite with Chiffon Dupatta',
      slug: 'pastel-mint-embroidered-lawn',
      category: 'lawn',
      categoryLabel: 'Lawn Collection',
      sku: 'ADAN-PM-108',
      price: 7800,
      compareAtPrice: 9500,
      costPrice: 4200,
      stock: 50,
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Subtle mint green luxury lawn with schiffli front embroidery, digital printed sleeves, and soft chiffon dupatta.',
      fabricDetails: 'Luxury Schiffli Embroidered Lawn',
      rating: 4.8,
      reviewCount: 47,
      isFeatured: false,
      createdAt: '2026-11-08T11:00:00Z',
    },
  ],
  orders: [
    {
      id: 'ord-adan-101',
      orderNumber: 'ORD-2026-9481',
      brandSlug: 'adans-libas',
      customerName: 'Ayesha Siddiqui',
      customerEmail: 'ayesha.s@gmail.com',
      customerPhone: '+92 321 8847291',
      shippingAddress: 'House 42-B, Sector F-7/2',
      city: 'Islamabad',
      items: [
        {
          productId: 'prod-adan-01',
          title: 'Scarlet Heritage Chiffon Dupatta & Embroidered Raw Silk Kurta',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
          price: 14850,
          quantity: 1,
          size: 'Medium',
        },
      ],
      subtotal: 14850,
      shippingFee: 250,
      total: 15100,
      paymentMethod: 'COD',
      codStatus: 'COLLECTED',
      fulfillmentStatus: 'DELIVERED',
      courierName: 'Trax Logistics',
      trackingNumber: 'TRX-78291048',
      createdAt: '2026-11-09T14:22:00Z',
    },
    {
      id: 'ord-adan-102',
      orderNumber: 'ORD-2026-9504',
      brandSlug: 'adans-libas',
      customerName: 'Zainab Tariq',
      customerEmail: 'zainab.t@yahoo.com',
      customerPhone: '+92 300 4429182',
      shippingAddress: 'Apartment 4B, Creek Vistas, Phase 8 DHA',
      city: 'Karachi',
      items: [
        {
          productId: 'prod-adan-02',
          title: 'Crimson Velvet Zari Embroidered Festive 3-Piece Ensemble',
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
          price: 18500,
          quantity: 1,
          size: 'Small',
        },
      ],
      subtotal: 18500,
      shippingFee: 250,
      total: 18750,
      paymentMethod: 'COD',
      codStatus: 'PENDING',
      fulfillmentStatus: 'DISPATCHED',
      courierName: 'Leopards Courier',
      trackingNumber: 'LEO-99482103',
      createdAt: '2026-11-11T10:15:00Z',
    },
    {
      id: 'ord-adan-103',
      orderNumber: 'ORD-2026-9529',
      brandSlug: 'adans-libas',
      customerName: 'Maryam Farooq',
      customerEmail: 'maryam.f@gmail.com',
      customerPhone: '+92 333 7719283',
      shippingAddress: '18-L, Gulberg II, near Home Economics College',
      city: 'Lahore',
      items: [
        {
          productId: 'prod-adan-03',
          title: 'Sage Bloom Handcrafted Lawn Pret 2-Piece Set',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
          price: 8900,
          quantity: 2,
          size: 'Large',
        },
      ],
      subtotal: 17800,
      shippingFee: 0,
      total: 17800,
      paymentMethod: 'COD',
      codStatus: 'PENDING',
      fulfillmentStatus: 'PROCESSING',
      courierName: 'TCS Express',
      trackingNumber: 'TCS-10293847',
      createdAt: '2026-11-12T16:45:00Z',
    },
    {
      id: 'ord-adan-104',
      orderNumber: 'ORD-2026-9560',
      brandSlug: 'adans-libas',
      customerName: 'Hania Bilal',
      customerEmail: 'hania.bilal@outlook.com',
      customerPhone: '+92 312 9948201',
      shippingAddress: 'Villa 12, Canal View Housing Society',
      city: 'Lahore',
      items: [
        {
          productId: 'prod-adan-06',
          title: 'Mustard Gold Hand-Embellished Festive Kurta & Culottes',
          image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
          price: 16500,
          quantity: 1,
          size: 'Medium',
        },
      ],
      subtotal: 16500,
      shippingFee: 250,
      total: 16750,
      paymentMethod: 'COD',
      codStatus: 'PENDING',
      fulfillmentStatus: 'PENDING',
      createdAt: '2026-11-13T09:20:00Z',
    },
  ],
  customers: [
    {
      id: 'cust-101',
      brandSlug: 'adans-libas',
      name: 'Ayesha Siddiqui',
      email: 'ayesha.s@gmail.com',
      phone: '+92 321 8847291',
      city: 'Islamabad',
      totalOrders: 3,
      totalSpend: 46500,
      lastOrderDate: '2026-11-09',
      tier: 'VIP',
    },
    {
      id: 'cust-102',
      brandSlug: 'adans-libas',
      name: 'Zainab Tariq',
      email: 'zainab.t@yahoo.com',
      phone: '+92 300 4429182',
      city: 'Karachi',
      totalOrders: 2,
      totalSpend: 31200,
      lastOrderDate: '2026-11-11',
      tier: 'Regular',
    },
    {
      id: 'cust-103',
      brandSlug: 'adans-libas',
      name: 'Maryam Farooq',
      email: 'maryam.f@gmail.com',
      phone: '+92 333 7719283',
      city: 'Lahore',
      totalOrders: 1,
      totalSpend: 17800,
      lastOrderDate: '2026-11-12',
      tier: 'New',
    },
    {
      id: 'cust-104',
      brandSlug: 'adans-libas',
      name: 'Hania Bilal',
      email: 'hania.bilal@outlook.com',
      phone: '+92 312 9948201',
      city: 'Lahore',
      totalOrders: 4,
      totalSpend: 62400,
      lastOrderDate: '2026-11-13',
      tier: 'VIP',
    },
  ],
};

function readStoreData(): StoreCatalogData {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const content = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read store catalog file, using memory seed:', err);
  }
  // Initialize storage file
  writeStoreData(SEED_DATA);
  return SEED_DATA;
}

function writeStoreData(data: StoreCatalogData): void {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store catalog data:', err);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS
// -----------------------------------------------------------------------------

export function getStoreProducts(brandSlug?: string): StoreProduct[] {
  const data = readStoreData();
  if (!brandSlug) return data.products;
  return data.products.filter((p) => p.brandSlug === brandSlug);
}

export function getStoreProductById(id: string): StoreProduct | undefined {
  const data = readStoreData();
  return data.products.find((p) => p.id === id);
}

export function saveStoreProduct(product: Partial<StoreProduct> & { brandSlug: string; title: string; price: number }): StoreProduct {
  const data = readStoreData();
  const now = new Date().toISOString();

  if (product.id) {
    const index = data.products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      data.products[index] = {
        ...data.products[index],
        ...product,
      } as StoreProduct;
      writeStoreData(data);
      return data.products[index];
    }
  }

  // Create new product
  const id = `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const slug = (product.slug || product.title)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const newProduct: StoreProduct = {
    id,
    brandSlug: product.brandSlug,
    brandName: product.brandName || "Adan's Libas",
    title: product.title,
    slug,
    category: product.category || 'pret',
    categoryLabel: product.categoryLabel || 'Ready To Wear',
    sku: product.sku || `SKU-${Date.now().toString().slice(-4)}`,
    price: Number(product.price) || 0,
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    costPrice: product.costPrice ? Number(product.costPrice) : undefined,
    stock: product.stock !== undefined ? Number(product.stock) : 10,
    status: product.status || 'ACTIVE',
    images: product.images && product.images.length > 0 ? product.images : [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: product.description || '',
    fabricDetails: product.fabricDetails || '',
    rating: 5.0,
    reviewCount: 0,
    isFeatured: !!product.isFeatured,
    createdAt: now,
  };

  data.products.unshift(newProduct);
  writeStoreData(data);
  return newProduct;
}

export function deleteStoreProduct(id: string): boolean {
  const data = readStoreData();
  const initialLength = data.products.length;
  data.products = data.products.filter((p) => p.id !== id);
  if (data.products.length !== initialLength) {
    writeStoreData(data);
    return true;
  }
  return false;
}

export function getStoreCategories(brandSlug?: string): StoreCategory[] {
  const data = readStoreData();
  // Count products for each category
  return data.categories.map((c) => ({
    ...c,
    productCount: data.products.filter(
      (p) => (!brandSlug || p.brandSlug === brandSlug) && p.category === c.slug
    ).length,
  }));
}

export function saveStoreCategory(category: { name: string; slug?: string; description?: string; brandSlug?: string }): StoreCategory {
  const data = readStoreData();
  const slug = (category.slug || category.name)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existing = data.categories.find((c) => c.slug === slug);
  if (existing) {
    existing.name = category.name;
    existing.description = category.description;
    writeStoreData(data);
    return existing;
  }

  const newCat: StoreCategory = {
    id: `cat-${Date.now().toString(36)}`,
    name: category.name,
    slug,
    description: category.description,
    brandSlug: category.brandSlug,
    productCount: 0,
  };

  data.categories.push(newCat);
  writeStoreData(data);
  return newCat;
}

export function deleteStoreCategory(slug: string): boolean {
  const data = readStoreData();
  const initial = data.categories.length;
  data.categories = data.categories.filter((c) => c.slug !== slug);
  if (data.categories.length !== initial) {
    writeStoreData(data);
    return true;
  }
  return false;
}

export function getStoreOrders(brandSlug?: string): StoreOrder[] {
  const data = readStoreData();
  if (!brandSlug) return data.orders;
  return data.orders.filter((o) => o.brandSlug === brandSlug);
}

export function updateStoreOrderStatus(
  orderId: string,
  updates: {
    fulfillmentStatus?: StoreOrder['fulfillmentStatus'];
    codStatus?: StoreOrder['codStatus'];
    courierName?: string;
    trackingNumber?: string;
  }
): StoreOrder | null {
  const data = readStoreData();
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) return null;

  if (updates.fulfillmentStatus) order.fulfillmentStatus = updates.fulfillmentStatus;
  if (updates.codStatus) order.codStatus = updates.codStatus;
  if (updates.courierName) order.courierName = updates.courierName;
  if (updates.trackingNumber) order.trackingNumber = updates.trackingNumber;

  writeStoreData(data);
  return order;
}

export function getStoreCustomers(brandSlug?: string): StoreCustomer[] {
  const data = readStoreData();
  if (!brandSlug) return data.customers;
  return data.customers.filter((c) => c.brandSlug === brandSlug);
}

