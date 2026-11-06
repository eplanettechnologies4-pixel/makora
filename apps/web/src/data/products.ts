// Centralized Makaura Luxury Beauty Marketplace Catalog Database
// Contains complete store-owner product specifications, multiple imagery angles,
// sizing, formulation specs, INCI declarations, and application videos.

export interface ProductReview {
  id: string;
  author: string;
  verified: boolean;
  date: string;
  stars: number;
  comment: string;
}

export interface StoreOwnerProductDetails {
  id: string;
  name: string;
  brandName: string;
  brandSlug: string;
  brandRating: number;
  brandItemsSold: number;
  sku: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: string;
  categoryLabel: string;
  images: string[];
  sizes: { volume: string; label: string; price: number; isPopular?: boolean }[];
  videos: { title: string; duration: string; thumb: string }[];
  specs: { label: string; value: string }[];
  description: string;
  ritualBullets: string[];
  inci: string;
  note: string;
  reviews?: ProductReview[];
}

export const PRODUCTS_DATABASE: Record<string, StoreOwnerProductDetails> = {
  'prod-saffron-rose': {
    id: 'prod-saffron-rose',
    name: 'Pure Saffron & Cold-Pressed Kashmiri Rosehip Cellular Elixir 50ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    brandRating: 4.9,
    brandItemsSold: 892,
    sku: 'MDR-SF-8021',
    price: 4850,
    compareAtPrice: 5500,
    rating: 4.9,
    reviewCount: 116,
    badge: 'Bestseller',
    category: 'skincare',
    categoryLabel: 'Active Serums & Elixirs',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '30 ml', label: '30ml Dropper', price: 3200 },
      { volume: '50 ml', label: '50ml Standard (Most Popular)', price: 4850, isPopular: true },
      { volume: '100 ml', label: '100ml Value Size', price: 8200 },
    ],
    videos: [
      { title: 'Glass Skin Ritual', duration: '0:42', thumb: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80' },
      { title: 'Dropper & Absorption Test', duration: '0:28', thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
      { title: 'Fresh Micro-Batch Harvest', duration: '0:55', thumb: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
      { title: 'Before & After 14 Days Skin Glow', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: 'Active Cold-Pressed Cellular Facial Elixir' },
      { label: 'Target Skin Types', value: 'Dry, Sensitive, Mature & Dull Skin' },
      { label: 'Key Ingredients', value: 'Kashmiri Saffron Stigmas, Wild Rosehip Seed Oil, CoQ10, Squalane' },
      { label: 'Texture / Finish', value: 'Weightless Golden Nectar, Instant Absorption, Non-Greasy' },
      { label: 'Volume / Net Weight', value: '50 ml / 1.69 fl. oz.' },
      { label: 'Shelf Life', value: '18 Months from Batch Date (PAO 6 Months)' },
      { label: 'Storehouse / Lab', value: 'Maison de Rose Atelier, Gulberg III, Lahore, Pakistan' },
      { label: 'Certifications', value: '100% Halal Certified, Cruelty-Free, Paraben-Free' },
      { label: 'Product SKU', value: 'MDR-SF-8021' },
    ],
    description: 'Handcrafted in micro-batches from high-altitude Kashmiri saffron stigmas and wild cold-pressed rosehip seeds. Restores skin barrier suppleness and imparts a radiant golden-hour glass skin finish.',
    ritualBullets: [
      'Morning: Dispense 3-4 drops onto cleansed damp skin. Gently press into face & neck before applying sunscreen.',
      'Evening: Warm 4-5 drops between palms and press onto skin as the final sealing step in your routine.',
    ],
    inci: 'Rosa Canina Seed Oil, Crocus Sativus Stigma Extract, Plant Squalane, Ubiquinone (CoQ10), Tocopherol (Vitamin E), Pelargonium Graveolens Flower Oil.',
    note: 'Each bottle contains hand-infused Kashmiri saffron threads that naturally macerate, imparting active crocin and rich antioxidants over time.',
    reviews: [
      { id: 'rev-s1', author: 'Ayesha M. (Lahore)', verified: true, date: 'Nov 2, 2026', stars: 5, comment: 'The golden saffron hue is 100% natural and absorbs effortlessly under Lahore humidity. Noticeable glow in 10 days.' },
      { id: 'rev-s2', author: 'Dr. Fatima K. (Karachi)', verified: true, date: 'Oct 29, 2026', stars: 5, comment: 'Cold-pressed rosehip with real saffron threads in the bottle. Authentic South Asian botanical formulation at its peak.' },
    ],
  },

  'prod-velvet-lip-rouge': {
    id: 'prod-velvet-lip-rouge',
    name: 'Velvet Matte Silk Lip Rouge in "Lahore Dahlia"',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    brandRating: 4.8,
    brandItemsSold: 1240,
    sku: 'NAC-LR-204',
    price: 3200,
    compareAtPrice: 3800,
    rating: 4.8,
    reviewCount: 42,
    badge: 'New Shade',
    category: 'makeup',
    categoryLabel: 'Artisanal Lip Rouges & Pigments',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '3.8 g', label: '3.8g Standard Bullet', price: 3200, isPopular: true },
      { volume: '1.8 g', label: '1.8g Handbag Travel Size', price: 1950 },
      { volume: 'Kit', label: 'Velvet Lip Kit (+ Precision Lip Liner)', price: 4600 },
    ],
    videos: [
      { title: 'Lahore Dahlia Lip Swatch', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
      { title: '8-Hour Smudge & Transfer Test', duration: '0:42', thumb: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80' },
      { title: 'Clean Pigment Compounding', duration: '0:50', thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: 'Silk Matte Botanical Lip Bullet' },
      { label: 'Color Family', value: 'Rich Warm Plum Rose (Tailored for South Asian Undertones)' },
      { label: 'Key Ingredients', value: 'Cold-Pressed Sweet Almond Oil, Organic Shea Butter, Vitamin E' },
      { label: 'Finish / Wear', value: 'Comfort Velvet Suede, 8-Hour Hydrating Wear, Non-Feathering' },
      { label: 'Net Weight', value: '3.8 g / 0.13 oz' },
      { label: 'Shelf Life', value: '24 Months (PAO 12 Months)' },
      { label: 'Storehouse / Lab', value: 'Noor Atelier, Sector F-7, Islamabad, Pakistan' },
      { label: 'Certifications', value: '100% Halal Certified, Lead-Free, Cruelty-Free, Paraben-Free' },
      { label: 'Product SKU', value: 'NAC-LR-204' },
    ],
    description: 'An artisanal silk-matte lipstick inspired by the autumnal blooming dahlias of Shalimar Gardens. Infused with sweet almond oil and pure mineral pigments to provide full-coverage velvet payoff without settling into fine lip lines.',
    ritualBullets: [
      'Apply directly from bullet to center of lips, pressing outward toward lip contours.',
      'For a diffused bridal tint, dab lightly with fingertip and blend outward.',
    ],
    inci: 'Ricinus Communis (Castor) Seed Oil, Octyldodecanol, Cera Alba (Beeswax), Prunus Amygdalus Dulcis (Sweet Almond) Oil, Butyrospermum Parkii (Shea) Butter, Tocopherol, Iron Oxides (CI 77491, CI 77492, CI 77499), Red 7 Lake (CI 15850).',
    note: 'Custom hand-blended in small seasonal runs in Islamabad. Contains zero synthetic petroleum waxes or animal derivatives.',
    reviews: [
      { id: 'rev-v1', author: 'Mahnoor Z. (Islamabad)', verified: true, date: 'Nov 3, 2026', stars: 5, comment: 'The most flattering Pakistani bridal rose shade. Stays on through dinner without feeling dry.' },
      { id: 'rev-v2', author: 'Saba T. (Lahore)', verified: true, date: 'Oct 28, 2026', stars: 5, comment: 'Texture is sheer velvet. The packaging feels weighty and luxurious.' },
    ],
  },

  'prod-oud-damascena': {
    id: 'prod-oud-damascena',
    name: 'Cambodian Oud & Damascena Attar Concentrée 12ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    brandRating: 5.0,
    brandItemsSold: 670,
    sku: 'ASH-OUD-991',
    price: 8900,
    compareAtPrice: 10500,
    rating: 5.0,
    reviewCount: 19,
    badge: 'Artisanal Batch',
    category: 'fragrance',
    categoryLabel: 'Pure Attars & Extrait de Parfum',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '6 ml', label: '6ml Hand-Cut Crystal Tola', price: 5200 },
      { volume: '12 ml', label: '12ml Grand Flacon (Most Popular)', price: 8900, isPopular: true },
      { volume: '50 ml', label: '50ml Extrait Spray Bottle', price: 16500 },
    ],
    videos: [
      { title: 'Wild Rose Otto Distillation', duration: '1:10', thumb: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80' },
      { title: 'Pulse-Point Glass Wand Application', duration: '0:30', thumb: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80' },
      { title: 'Vintage Cambodian Agarwood Inspection', duration: '0:45', thumb: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: '100% Pure Alcohol-Free Oil Extrait' },
      { label: 'Olfactory Family', value: 'Prestige Amber Woody Oriental' },
      { label: 'Key Notes', value: 'Aged Cambodian Agarwood, Syrian Damask Rose, Royal Amber, Saffron' },
      { label: 'Longevity / Sillage', value: '24+ Hours Longevity with Enveloping Royal Sillage' },
      { label: 'Volume / Net Weight', value: '12 ml / 0.4 fl. oz.' },
      { label: 'Maceration Period', value: '6 Months Barrel-Aged in Dark Glass' },
      { label: 'Storehouse / Lab', value: 'Aura Scents House, DHA Phase 6, Karachi, Pakistan' },
      { label: 'Certifications', value: 'Alcohol-Free, Pure Botanical Distillation, IFRA Certified' },
      { label: 'Product SKU', value: 'ASH-OUD-991' },
    ],
    description: 'An opulent distillation uniting 12-year cellar-macerated Cambodian agarwood with morning-picked Damascena rose petals. Zero alcohol, zero synthetics — just sheer oriental nobility that evolves richly over 24 hours.',
    ritualBullets: [
      'Using the glass wand applicator, touch a single drop onto pulse points (wrists, base of neck, collarbones).',
      'Gently touch pulse points together without rubbing vigorously to preserve the high-frequency floral notes.',
    ],
    inci: 'Pure Hydro-Distilled Aquilaria Crassna (Cambodian Agarwood) Oil, Rosa Damascena Flower Oil, Santalum Album (Sandalwood) Oil, Amber Accord.',
    note: 'Single-distillation harvest. Bottled in heavy crystal with a 24k gold-electroplated dip rod.',
    reviews: [
      { id: 'rev-o1', author: 'Zubair H. (Karachi)', verified: true, date: 'Nov 1, 2026', stars: 5, comment: 'One of the best natural Cambodian ouds available in Pakistan. The rose softens the smokiness wonderfully.' },
      { id: 'rev-o2', author: 'Nadia A. (Lahore)', verified: true, date: 'Oct 22, 2026', stars: 5, comment: 'Lasts more than 24 hours on silk fabric. Unbelievable longevity.' },
    ],
  },

  'prod-amla-rosemary': {
    id: 'prod-amla-rosemary',
    name: 'Botanical Amla & Wild Rosemary Scalp Tonic 100ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    brandRating: 4.9,
    brandItemsSold: 2150,
    sku: 'BRL-AM-100',
    price: 3650,
    compareAtPrice: 4200,
    rating: 4.9,
    reviewCount: 116,
    badge: 'Clean Halal',
    category: 'haircare',
    categoryLabel: 'Botanical Scalp & Hair Rituals',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '50 ml', label: '50ml Travel Bottle', price: 2100 },
      { volume: '100 ml', label: '100ml Standard Dropper (Most Popular)', price: 3650, isPopular: true },
      { volume: '250 ml', label: '250ml Eco-Refill Value Pack', price: 7200 },
    ],
    videos: [
      { title: 'Scalp Application Technique', duration: '0:40', thumb: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=400&q=80' },
      { title: 'Amla Cold-Steeping Process', duration: '0:55', thumb: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
      { title: '30-Day Density Transformation', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: 'Aqueous Botanical Follicle Clarifying Tonic' },
      { label: 'Target Concerns', value: 'Hair Thinning, Post-Partum Shedding, Scalp Flakiness' },
      { label: 'Key Actives', value: 'Wildcrafted Murree Rosemary Extract, Raw Amla Berry, Biotin, Red Clover' },
      { label: 'Texture / Scent', value: 'Weightless Water-Light Tonic, Crisp Herbal Rosemary Aroma' },
      { label: 'Volume / Net Weight', value: '100 ml / 3.38 fl. oz.' },
      { label: 'Shelf Life', value: '18 Months from Bottling Date' },
      { label: 'Storehouse / Lab', value: 'Botanica Labs, Industrial Area I-9, Islamabad, Pakistan' },
      { label: 'Certifications', value: 'Clean Halal, Silicone-Free, Sulfate-Free, Cruelty-Free' },
      { label: 'Product SKU', value: 'BRL-AM-100' },
    ],
    description: 'A non-greasy scalp elixir brewed with high-potency wild Himalayan rosemary and hand-steeped amla fruit. Clinically formulated to invigorate sluggish follicles, soothe dry scalps, and visibly reduce shower hair shedding.',
    ritualBullets: [
      'Fill dropper and apply 4-6 full pipettes along clean scalp partings.',
      'Massage firmly with fingertips in circular motions for 3-5 minutes. Leave on — no rinse required.',
    ],
    inci: 'Aqua (Purified Spring Water), Rosmarinus Officinalis (Rosemary) Leaf Extract, Phyllanthus Emblica (Amla) Fruit Extract, Glycerin, Biotinoyl Tripeptide-1, Trifolium Pratense (Clover) Flower Extract, Panthenol (Pro-Vitamin B5).',
    note: 'Cold-brewed for 72 hours under nitrogen purge to retain maximum vitamin C and rosmarinic acid potency.',
    reviews: [
      { id: 'rev-a1', author: 'Huma K. (Rawalpindi)', verified: true, date: 'Nov 4, 2026', stars: 5, comment: 'Unlike sticky oils, this is water-light! I can use it in the morning without washing my hair. Hair fall dropped significantly.' },
      { id: 'rev-a2', author: 'Dr. Bilal Q. (Lahore)', verified: true, date: 'Oct 30, 2026', stars: 5, comment: 'Legitimate clinical herbs. My hairline baby hairs have filled in nicely after 6 weeks.' },
    ],
  },

  'prod-bakuchiol-balm': {
    id: 'prod-bakuchiol-balm',
    name: 'Bakuchiol 2% Cellular Night Smoothing Nectar 50ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    brandRating: 4.9,
    brandItemsSold: 780,
    sku: 'MDR-BK-339',
    price: 5400,
    compareAtPrice: 6200,
    rating: 4.9,
    reviewCount: 63,
    badge: 'Formulator Pick',
    category: 'skincare',
    categoryLabel: 'Active Serums & Elixirs',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '30 ml', label: '30ml Intro Size', price: 3800 },
      { volume: '50 ml', label: '50ml Standard Night Serum (Most Popular)', price: 5400, isPopular: true },
      { volume: '100 ml', label: '100ml Value Size', price: 9200 },
    ],
    videos: [
      { title: 'Nighttime Smoothing Routine', duration: '0:38', thumb: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
      { title: 'Natural Retinol Alternative Guide', duration: '0:50', thumb: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: 'Cellular Botanical Retinol Alternative' },
      { label: 'Key Active', value: '2% Pure Babchi-Derived Bakuchiol, Blue Tansy, Sea Buckthorn' },
      { label: 'Target Concern', value: 'Fine Lines, Texture, Melasma, Sensitive Skin' },
      { label: 'Texture', value: 'Silky Indigo-Hued Botanical Lipid Serum' },
      { label: 'Volume', value: '50 ml / 1.69 fl. oz.' },
      { label: 'Storehouse / Lab', value: 'Maison de Rose Atelier, Gulberg III, Lahore, Pakistan' },
      { label: 'Certifications', value: '100% Halal, Safe for Sensitive Skin, Cruelty-Free' },
      { label: 'Product SKU', value: 'MDR-BK-339' },
    ],
    description: 'All the cellular cell-turnover benefits of clinical retinol without peeling, redness, or sun sensitivity. Blended with calming Moroccan blue tansy and omega-rich seabuckthorn oil.',
    ritualBullets: [
      'At night, warm 3-4 drops between clean fingers and press into face and neck.',
      'Gentle enough for daily evening use even on eczema-prone skin.',
    ],
    inci: 'Simmondsia Chinensis (Jojoba) Seed Oil, Bakuchiol (2%), Tanacetum Annuum (Blue Tansy) Flower Oil, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil, Tocopherol.',
    note: 'Sourced from verified Ayurvedic Psoralea Corylifolia farmers, refined under zero-heat distillation.',
    reviews: [
      { id: 'rev-b1', author: 'Rida S. (Lahore)', verified: true, date: 'Oct 25, 2026', stars: 5, comment: 'Retinol always irritated my skin barrier, but this Bakuchiol serum smoothed my forehead lines without any irritation!' },
    ],
  },

  'prod-pearl-tint': {
    id: 'prod-pearl-tint',
    name: 'Luminous Pearl Peptide Mineral Foundation Drops',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    brandRating: 4.8,
    brandItemsSold: 940,
    sku: 'NAC-PF-510',
    price: 4500,
    compareAtPrice: 5200,
    rating: 4.8,
    reviewCount: 57,
    badge: 'Weightless',
    category: 'makeup',
    categoryLabel: 'Skin-First Bases & Tinted Drops',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '30 ml', label: '30ml Dropper Flacon (Most Popular)', price: 4500, isPopular: true },
      { volume: '60 ml', label: '60ml Pro Studio Size', price: 7800 },
    ],
    videos: [
      { title: 'Pipette Glow Drops Application', duration: '0:32', thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
      { title: 'Dewy Skin Finish in Sunlight', duration: '0:45', thumb: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: 'Skincare-Infused Serum Foundation Drops' },
      { label: 'Coverage / Finish', value: 'Light-to-Medium Buildable Coverage, Fresh Pearl Glow' },
      { label: 'Key Ingredients', value: 'South Sea Pearl Powder, Copper Tripeptides, Hyaluronic Acid' },
      { label: 'Volume', value: '30 ml / 1.0 fl. oz.' },
      { label: 'Storehouse / Lab', value: 'Noor Atelier, Sector F-7, Islamabad, Pakistan' },
      { label: 'Certifications', value: 'Non-Comedogenic, Halal Certified, Fragrance-Free' },
      { label: 'Product SKU', value: 'NAC-PF-510' },
    ],
    description: 'A breathable serum foundation suspended with micro-milled real pearl powder and firming peptides. Evens redness instantly while feeling completely weightless in Pakistani warmth.',
    ritualBullets: [
      'Shake well before each use. Dispense 2-3 drops directly onto forehead and cheeks.',
      'Blend outward using fingertips, beauty sponge, or dense buffer brush.',
    ],
    inci: 'Water, Dimethicone, Squalane, Pearl Powder, Copper Tripeptide-1, Niacinamide, Sodium Hyaluronate, Titanium Dioxide, Iron Oxides.',
    note: 'Formulated specifically not to oxidize or turn orange throughout a hot summer day.',
    reviews: [
      { id: 'rev-p1', author: 'Anum L. (Faisalabad)', verified: true, date: 'Oct 29, 2026', stars: 5, comment: 'Looks like real skin! Does not cling to dry patches or melt off during outdoor events.' },
    ],
  },

  'prod-ambergris-extrait': {
    id: 'prod-ambergris-extrait',
    name: 'Wild Ambergris & Cardamom Extrait de Parfum 50ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    brandRating: 5.0,
    brandItemsSold: 410,
    sku: 'ASH-AMB-50',
    price: 11500,
    compareAtPrice: 13000,
    rating: 5.0,
    reviewCount: 28,
    badge: 'Limited',
    category: 'fragrance',
    categoryLabel: 'Niche Extrait de Parfum',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '15 ml', label: '15ml Discovery Atomizer', price: 4600 },
      { volume: '50 ml', label: '50ml Heavy Crystal Flacon (Most Popular)', price: 11500, isPopular: true },
      { volume: '100 ml', label: '100ml Private Reserve Flacon', price: 19800 },
    ],
    videos: [
      { title: 'The Mystique of Natural Ambergris', duration: '1:15', thumb: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80' },
      { title: 'Fine Mist Atomizer Experience', duration: '0:25', thumb: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Concentration', value: 'Extrait de Parfum (34% Pure Perfume Essence)' },
      { label: 'Scent Profile', value: 'Salty Marine Warm Amber, Crushed Green Cardamom, Tonka Bean' },
      { label: 'Longevity', value: 'Over 18 Hours with Sophisticated Atmospheric Projection' },
      { label: 'Volume', value: '50 ml / 1.7 fl. oz.' },
      { label: 'Storehouse / Lab', value: 'Aura Scents House, DHA Phase 6, Karachi, Pakistan' },
      { label: 'Product SKU', value: 'ASH-AMB-50' },
    ],
    description: 'A poetic marriage of ethically ocean-foraged ambergris tincture and organic emerald cardamom from coastal spice groves. Warm, salty, magnetic, and completely distinct.',
    ritualBullets: [
      'Spritz twice onto pulse points: collarbones and inside wrists.',
      'Avoid rubbing; allow the delicate spice accord to blossom naturally in body warmth.',
    ],
    inci: 'Alcohol Denat., Parfum (Fragrance), Ambrein (Natural Ambergris Tincture), Elettaria Cardamomum Seed Oil, Linalool, Limonene, Coumarin.',
    note: 'Aged in French oak mini-casks for 180 days prior to bottling.',
    reviews: [
      { id: 'rev-am1', author: 'Kamran F. (Islamabad)', verified: true, date: 'Oct 14, 2026', stars: 5, comment: 'True niche quality. Smells like ocean breeze meets expensive spice markets.' },
    ],
  },

  'prod-walnut-polish': {
    id: 'prod-walnut-polish',
    name: 'Kashmiri Walnut & Jasmine Whipped Body Soufflé 200g',
    brandName: 'Indisense Rituals',
    brandSlug: 'indisense-rituals',
    brandRating: 4.7,
    brandItemsSold: 620,
    sku: 'INR-WN-200',
    price: 4200,
    compareAtPrice: 4800,
    rating: 4.7,
    reviewCount: 31,
    badge: 'Rich Moisture',
    category: 'bath-body',
    categoryLabel: 'Artisanal Bath & Body Soufflés',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '100 g', label: '100g Petite Jar', price: 2400 },
      { volume: '200 g', label: '200g Standard Soufflé Jar (Most Popular)', price: 4200, isPopular: true },
      { volume: '400 g', label: '400g Double Size Family Jar', price: 7400 },
    ],
    videos: [
      { title: 'Whipped Soufflé Texture Reveal', duration: '0:30', thumb: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Post-Shower Body Glow Ritual', duration: '0:45', thumb: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: 'Air-Whipped Botanical Body Butter' },
      { label: 'Skin Feel', value: 'Velvety, Deep Hydration, Non-Greasy Fast Absorbing' },
      { label: 'Key Ingredients', value: 'Cold-Pressed Kashmiri Walnut Oil, Wild Jasmine Flower Wax, Shea Butter' },
      { label: 'Net Weight', value: '200 g / 7.05 oz' },
      { label: 'Storehouse / Lab', value: 'Indisense Rituals Lab, Model Town, Lahore, Pakistan' },
      { label: 'Product SKU', value: 'INR-WN-200' },
    ],
    description: 'Triple-whipped organic shea butter infused with rich cold-pressed Kashmiri walnut kernel oil and night-blooming jasmine enfleurage. Melts on contact with skin to restore moisture after bathing.',
    ritualBullets: [
      'Smooth generously over warm, towel-dried skin after bathing or showering.',
      'Pay special attention to dry areas like elbows, knees, and ankles.',
    ],
    inci: 'Butyrospermum Parkii (Shea Butter), Juglans Regia (Walnut) Seed Oil, Jasminum Sambac Flower Extract, Simmondsia Chinensis Seed Oil, Tocopherol.',
    note: 'Made with raw cold-pressed Kashmiri walnuts from Neelum Valley.',
    reviews: [
      { id: 'rev-w1', author: 'Zainab B. (Lahore)', verified: true, date: 'Oct 26, 2026', stars: 5, comment: 'The smell of real night-blooming jasmine is heavenly! My dry skin stays soft all 24 hours.' },
    ],
  },

  'prod-niacinamide-glow': {
    id: 'prod-niacinamide-glow',
    name: 'Niacinamide 10% & Pure Licorice Root Skin Clarifying Concentrate 30ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    brandRating: 4.9,
    brandItemsSold: 1450,
    sku: 'MDR-NC-103',
    price: 3450,
    compareAtPrice: 3950,
    rating: 4.9,
    reviewCount: 73,
    badge: 'Pore Refining',
    category: 'skincare',
    categoryLabel: 'Active Serums & Concentrates',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '30 ml', label: '30ml Dropper (Standard)', price: 3450, isPopular: true },
      { volume: '60 ml', label: '60ml Value Double Bottle', price: 5900 },
    ],
    videos: [
      { title: 'Pore Clarifying Water Test', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Actives', value: '10% Clinical Grade Niacinamide + 2% Zinc PCA + Licorice Extract' },
      { label: 'Targets', value: 'Enlarged Pores, Acne Blemishes, Uneven Skin Tone' },
      { label: 'Volume', value: '30 ml / 1.0 fl. oz.' },
      { label: 'Lab', value: 'Maison de Rose Atelier, Gulberg III, Lahore, Pakistan' },
      { label: 'Product SKU', value: 'MDR-NC-103' },
    ],
    description: 'A crystal-clear clarifying concentrate engineered to minimize pores, balance sebum production, and fade dark spots caused by acne or sun exposure.',
    ritualBullets: [
      'Apply 3-4 drops morning and evening to clean, dry skin before moisturizer.',
    ],
    inci: 'Aqua, Niacinamide (10%), Zinc PCA (2%), Glycyrrhiza Glabra (Licorice) Root Extract, Sodium Hyaluronate, Phenoxyethanol.',
    note: 'Formulated at skin-neutral pH 5.5 to avoid irritation or tingling.',
    reviews: [
      { id: 'rev-n1', author: 'Aleena K. (Karachi)', verified: true, date: 'Nov 4, 2026', stars: 5, comment: 'Pores on my nose and cheeks shrank significantly within 2 weeks!' },
    ],
  },

  'prod-kohl-noir': {
    id: 'prod-kohl-noir',
    name: 'Artisanal Almond Oil Kohl Kajal Noir Waterproof Gel Pencil',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    brandRating: 4.8,
    brandItemsSold: 1820,
    sku: 'NAC-KJ-01',
    price: 2150,
    compareAtPrice: 2600,
    rating: 4.8,
    reviewCount: 65,
    badge: 'Deepest Black',
    category: 'makeup',
    categoryLabel: 'Traditional Eyes & Kohl Pigments',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '1.2 g', label: '1.2g Precision Pencil (Most Popular)', price: 2150, isPopular: true },
      { volume: 'Duo Set', label: '2x Kohl Pencils + German Brass Sharpener', price: 3800 },
    ],
    videos: [
      { title: 'Waterline Waterproof Test', duration: '0:30', thumb: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Traditional Surma-Infused Waterproof Gel Kohl Pencil' },
      { label: 'Shade', value: 'Jet Carbon Black (Deepest Noir)' },
      { label: 'Wear', value: '16-Hour Waterproof, Smudge-Resistant on Waterline' },
      { label: 'Lab', value: 'Noor Atelier, Sector F-7, Islamabad, Pakistan' },
      { label: 'Product SKU', value: 'NAC-KJ-01' },
    ],
    description: 'An ancient Mughlai beauty staple reborn: carbon-black kohl fortified with cold-pressed sweet almond oil and cooling camphor for intense, irritation-free waterline definition.',
    ritualBullets: [
      'Glide smoothly across the inner waterline and upper lash line.',
      'Smudge with fingertips within 30 seconds for a smoky Mughal look.',
    ],
    inci: 'Isododecane, Synthetic Wax, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Camphor, Carbon Black (CI 77266), Iron Oxides.',
    note: 'Ophthalmologically tested and certified safe for contact lens wearers.',
    reviews: [
      { id: 'rev-k1', author: 'Sarah N. (Multan)', verified: true, date: 'Oct 31, 2026', stars: 5, comment: 'Finally a kajal that stays black on the waterline through humid weddings without raccoon eyes!' },
    ],
  },

  'prod-jasmine-sambac': {
    id: 'prod-jasmine-sambac',
    name: 'Night-Blooming Motia & Jasmine Sambac Pure Attar Extrait 10ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    brandRating: 5.0,
    brandItemsSold: 830,
    sku: 'ASH-MOT-10',
    price: 7200,
    compareAtPrice: 8500,
    rating: 5.0,
    reviewCount: 34,
    badge: 'Single-Harvest',
    category: 'fragrance',
    categoryLabel: 'Pure Botanical Attars',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '5 ml', label: '5ml Crystal Vial', price: 4200 },
      { volume: '10 ml', label: '10ml Velvet Boxed Flacon (Most Popular)', price: 7200, isPopular: true },
    ],
    videos: [
      { title: 'Midnight Motia Flower Harvesting', duration: '0:50', thumb: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: '100% Pure Sandalwood-Based Deg-Bhapka Attar' },
      { label: 'Harvest', value: 'Single-Night Harvested Motia (Jasminum Sambac)' },
      { label: 'Lab', value: 'Aura Scents House, DHA Phase 6, Karachi, Pakistan' },
      { label: 'Product SKU', value: 'ASH-MOT-10' },
    ],
    description: 'Distilled using the centuries-old copper Deg-Bhapka hydro-distillation method. Fresh midnight motia petals hydro-condensed directly into pure Mysore sandalwood oil.',
    ritualBullets: [
      'Touch a single drop to wrists, earlobes, or traditional cotton swabs in the chest pocket.',
    ],
    inci: 'Jasminum Sambac Flower Extract, Santalum Album (Sandalwood) Oil.',
    note: 'Zero alcohol, zero synthetic fixatives.',
    reviews: [
      { id: 'rev-j1', author: 'Bushra P. (Lahore)', verified: true, date: 'Oct 20, 2026', stars: 5, comment: 'Pure nostalgia. Smells like a moonlit monsoon night in Lahore with blooming motia trees.' },
    ],
  },

  'prod-bhringraj-oil': {
    id: 'prod-bhringraj-oil',
    name: 'Cold-Pressed Ayurvedic Bhringraj & Black Seed Root Treatment 120ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    brandRating: 4.9,
    brandItemsSold: 1690,
    sku: 'BRL-BHR-120',
    price: 3850,
    compareAtPrice: 4400,
    rating: 4.9,
    reviewCount: 92,
    badge: 'Hair Fall Care',
    category: 'haircare',
    categoryLabel: 'Root Fortifying Treatments',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '60 ml', label: '60ml Intro Dropper', price: 2300 },
      { volume: '120 ml', label: '120ml Glass Applicator Bottle (Most Popular)', price: 3850, isPopular: true },
      { volume: '250 ml', label: '250ml Family Ritual Bottle', price: 6800 },
    ],
    videos: [
      { title: 'Warm Oil Scalp Champi Massage', duration: '0:45', thumb: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Cold-Pressed Herb-Macerated Scalp Oil' },
      { label: 'Key Herbs', value: 'Raw Bhringraj (Eclipta Alba), Kalonji (Black Seed), Fenugreek, Sesame' },
      { label: 'Lab', value: 'Botanica Labs, Industrial Area I-9, Islamabad, Pakistan' },
      { label: 'Product SKU', value: 'BRL-BHR-120' },
    ],
    description: 'An ancient ayurvedic hair fortifier simmered with fresh bhringraj leaves, organic black cumin (kalonji), and cold-pressed sesame oil. Strengthens hair shafts from root to tip.',
    ritualBullets: [
      'Warm oil slightly, part hair in sections, and massage deeply into roots for 10 minutes.',
      'Leave on for at least 1 hour or overnight before washing with mild sulfate-free shampoo.',
    ],
    inci: 'Sesamum Indicum (Sesame) Seed Oil, Eclipta Alba (Bhringraj) Extract, Nigella Sativa (Black Cumin) Seed Oil, Trigonella Foenum-Graecum (Fenugreek) Extract, Tocopherol.',
    note: 'Small batch infused under sunlight for 21 days according to traditional Ayurvedic Kshirapak methods.',
    reviews: [
      { id: 'rev-bh1', author: 'Fatima R. (Peshawar)', verified: true, date: 'Oct 18, 2026', stars: 5, comment: 'Restored thickness to my postpartum thinning hair. The kalonji and bhringraj combo is magic.' },
    ],
  },

  'prod-ceramide-barrier': {
    id: 'prod-ceramide-barrier',
    name: '5-Ceramide & Oat Milk Barrier Repair Whipped Moisturizer 60g',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    brandRating: 4.9,
    brandItemsSold: 2100,
    sku: 'MDR-CR-60',
    price: 4100,
    compareAtPrice: 4700,
    rating: 4.9,
    reviewCount: 88,
    badge: 'Bestseller',
    category: 'skincare',
    categoryLabel: 'Barrier Repair Creams & Balms',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '30 g', label: '30g Travel Pot', price: 2400 },
      { volume: '60 g', label: '60g Luxury Ceramic Jar (Most Popular)', price: 4100, isPopular: true },
      { volume: '120 g', label: '120g Jumbo Refill', price: 7200 },
    ],
    videos: [
      { title: 'Whipped Texture & Barrier Protection Test', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Lipid-Replenishing Whipped Barrier Cream' },
      { label: 'Actives', value: '5 Essential Ceramides (EOP, NS, NP, AS, AP), Colloidal Oat, Centella' },
      { label: 'Skin Type', value: 'Compromised, Dehydrated, Sensitive, Dry' },
      { label: 'Lab', value: 'Maison de Rose Atelier, Gulberg III, Lahore, Pakistan' },
      { label: 'Product SKU', value: 'MDR-CR-60' },
    ],
    description: 'A cloud-like whipped cream formulated with the golden 3:1:1 skin lipid ratio of ceramides, cholesterol, and fatty acids. Instantly relieves stinging, burning, and dryness.',
    ritualBullets: [
      'Scoop a pearl-sized amount onto fingertips and gently press into face, neck, and chest.',
      'Can be used morning and evening as the final hydrating step.',
    ],
    inci: 'Water, Caprylic/Capric Triglyceride, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Colloidal Oatmeal, Centella Asiatica Extract.',
    note: 'Fragrance-free, essential-oil free, and safe for post-chemical-peel recovery.',
    reviews: [
      { id: 'rev-c1', author: 'Mariam D. (Lahore)', verified: true, date: 'Nov 5, 2026', stars: 5, comment: 'Repaired my severely damaged barrier in 3 days after an over-exfoliation mishap!' },
    ],
  },

  'prod-rose-petal-blush': {
    id: 'prod-rose-petal-blush',
    name: 'Velvet Crème-to-Powder Cheek & Lip Flush in "Gulab Glow"',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    brandRating: 4.8,
    brandItemsSold: 1310,
    sku: 'NAC-BL-402',
    price: 2850,
    compareAtPrice: 3300,
    rating: 4.8,
    reviewCount: 54,
    badge: 'Multi-Use',
    category: 'makeup',
    categoryLabel: 'Crème Cheek & Lip Pigments',
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '5 g', label: '5g Compact with Mirror (Most Popular)', price: 2850, isPopular: true },
      { volume: 'Duo Pot', label: 'Dual Pot: Gulab Glow + Saffron Highlighter', price: 4600 },
    ],
    videos: [
      { title: 'Fingertip Cheek Blending Demo', duration: '0:28', thumb: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Multi-Use Crème-to-Powder Flush' },
      { label: 'Shade', value: 'Petal Rose with Subtle Gold Micro-Luminescence' },
      { label: 'Lab', value: 'Noor Atelier, Sector F-7, Islamabad, Pakistan' },
      { label: 'Product SKU', value: 'NAC-BL-402' },
    ],
    description: 'A blendable, melting multi-use pot that gives cheeks, lips, and eyelids an effortless healthy flush of naturally sunlit Pakistani rose.',
    ritualBullets: [
      'Warm product with clean fingers and tap gently onto high points of apples of cheeks and center of lips.',
    ],
    inci: 'Coco-Caprylate, Cera Alba, Ricinus Communis Seed Oil, Mica, Iron Oxides (CI 77491), Red 7 (CI 15850).',
    note: 'Clean mineral formulation free from carmine or synthetic talc.',
    reviews: [
      { id: 'rev-rp1', author: 'Aimen T. (Karachi)', verified: true, date: 'Oct 27, 2026', stars: 5, comment: 'Gives the most natural post-workout glow. Fits easily in small clutches.' },
    ],
  },

  'prod-saffron-oud-perfume': {
    id: 'prod-saffron-oud-perfume',
    name: 'Royal Kashmiri Saffron & Smoked Oud Eau de Parfum 100ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    brandRating: 5.0,
    brandItemsSold: 540,
    sku: 'ASH-SFO-100',
    price: 12800,
    compareAtPrice: 14500,
    rating: 5.0,
    reviewCount: 41,
    badge: 'Signature Scent',
    category: 'fragrance',
    categoryLabel: 'Royal Prestige Fragrances',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '50 ml', label: '50ml Crystal Bottle', price: 7900 },
      { volume: '100 ml', label: '100ml Grand Presentation Box (Most Popular)', price: 12800, isPopular: true },
    ],
    videos: [
      { title: 'The Royal Saffron Accord Story', duration: '1:02', thumb: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Eau de Parfum (28% Concentration)' },
      { label: 'Notes', value: 'Top: Kashmiri Saffron, Bergamot; Heart: Smoked Agarwood; Base: Amber, Musk' },
      { label: 'Lab', value: 'Aura Scents House, DHA Phase 6, Karachi, Pakistan' },
      { label: 'Product SKU', value: 'ASH-SFO-100' },
    ],
    description: 'A regal evening fragrance paying homage to Mughal court perfumery. Hand-distilled Kashmiri saffron threads and smoldering Cambodian agarwood produce an unforgettable aristocratic aura.',
    ritualBullets: [
      'Spritz 3-4 times onto collarbones, wrists, and over outerwear for majestic all-night projection.',
    ],
    inci: 'Alcohol Denat., Parfum, Crocus Sativus Stigma Extract, Aquilaria Wood Extract, Limonene, Eugenol.',
    note: 'Presented in a velvet-lined magnetic wooden box with a certificate of batch authenticity.',
    reviews: [
      { id: 'rev-so1', author: 'Daniyal N. (Lahore)', verified: true, date: 'Oct 19, 2026', stars: 5, comment: 'Gets compliments everywhere I go. True royalty in a bottle.' },
    ],
  },

  'prod-hibiscus-hair-mask': {
    id: 'prod-hibiscus-hair-mask',
    name: 'Raw Hibiscus & Organic Argan Butter Deep Moisture Hair Butter 200g',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    brandRating: 4.7,
    brandItemsSold: 950,
    sku: 'BRL-HIB-200',
    price: 3400,
    compareAtPrice: 3900,
    rating: 4.7,
    reviewCount: 69,
    badge: 'Frizz Defense',
    category: 'haircare',
    categoryLabel: 'Deep Conditioning Masks',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '100 g', label: '100g Trial Jar', price: 1950 },
      { volume: '200 g', label: '200g Standard Tub (Most Popular)', price: 3400, isPopular: true },
      { volume: '400 g', label: '400g Salon Tub', price: 5900 },
    ],
    videos: [
      { title: 'Deep Conditioning Treatment Application', duration: '0:42', thumb: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Restorative Hair & Keratin Conditioning Mask' },
      { label: 'Key Actives', value: 'Cold-Pressed Argan Butter, Hibiscus Flower Mucilage, Hydrolyzed Wheat Protein' },
      { label: 'Lab', value: 'Botanica Labs, Industrial Area I-9, Islamabad, Pakistan' },
      { label: 'Product SKU', value: 'BRL-HIB-200' },
    ],
    description: 'An intensive hair restorative whipped with cold-pressed Moroccan argan butter and antioxidant-rich red hibiscus petal mucilage to smooth rough cuticles and reverse chemical bleach damage.',
    ritualBullets: [
      'Apply generously to clean, damp mid-lengths and ends after shampooing.',
      'Leave on for 15-20 minutes, then rinse thoroughly with cool water.',
    ],
    inci: 'Water, Cetearyl Alcohol, Argania Spinosa Kernel Oil, Hibiscus Sabdariffa Flower Extract, Behentrimonium Methosulfate, Panthenol.',
    note: '100% silicone-free for natural slip without heavy product buildup.',
    reviews: [
      { id: 'rev-h1', author: 'Sara W. (Islamabad)', verified: true, date: 'Oct 15, 2026', stars: 5, comment: 'Transformed my bleached frizzy curls into soft, glossy ringlets!' },
    ],
  },

  'prod-sandalwood-glow-polish': {
    id: 'prod-sandalwood-glow-polish',
    name: 'Mysore Sandalwood & Raw Honey Clarifying Body Glow Polish 250g',
    brandName: 'Indisense Rituals',
    brandSlug: 'indisense-rituals',
    brandRating: 4.9,
    brandItemsSold: 710,
    sku: 'INR-SW-250',
    price: 3950,
    compareAtPrice: 4500,
    rating: 4.9,
    reviewCount: 48,
    badge: 'Artisanal Ritual',
    category: 'bath-body',
    categoryLabel: 'Exfoliating Body Polishes',
    images: [
      'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '125 g', label: '125g Travel Pouch', price: 2200 },
      { volume: '250 g', label: '250g Glass Jar (Most Popular)', price: 3950, isPopular: true },
    ],
    videos: [
      { title: 'Sandalwood & Honey Buffing Polish', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Physical Micro-Exfoliating Body Polish' },
      { label: 'Key Ingredients', value: 'Pure Mysore Sandalwood Powder, Raw Wild Honey, Jojoba Beads' },
      { label: 'Lab', value: 'Indisense Rituals Lab, Model Town, Lahore, Pakistan' },
      { label: 'Product SKU', value: 'INR-SW-250' },
    ],
    description: 'Formulated with fine micro-milled sandalwood bark and wild mountain raw honey. Gently exfoliates dead surface cells, soothes strawberry skin, and leaves limbs silky and luminous.',
    ritualBullets: [
      'Massage in gentle circular motions over wet skin in the shower, focusing on rough areas.',
      'Rinse with warm water to reveal instantaneous satiny skin.',
    ],
    inci: 'Sucrose, Mel (Raw Honey), Santalum Album Wood Powder, Prunus Amygdalus Dulcis Oil, Tocopherol.',
    note: 'Infused with 100% natural pure sandalwood essential oil.',
    reviews: [
      { id: 'rev-sw1', author: 'Sadia M. (Lahore)', verified: true, date: 'Oct 24, 2026', stars: 5, comment: 'Skin feels silky like baby skin right after shower. The real sandalwood scent is so calming.' },
    ],
  },

  'prod-peptide-eye-balm': {
    id: 'prod-peptide-eye-balm',
    name: 'Tri-Peptide & Green Tea Depuffing Eye Awakening Elixir 15ml',
    brandName: 'Maison de Rose',
    brandSlug: 'maison-de-rose',
    brandRating: 4.8,
    brandItemsSold: 1140,
    sku: 'MDR-EYE-15',
    price: 3600,
    compareAtPrice: 4200,
    rating: 4.8,
    reviewCount: 76,
    badge: 'Anti-Fatigue',
    category: 'skincare',
    categoryLabel: 'Targeted Eye Care',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '15 ml', label: '15ml Cooling Ceramic Tip Tube (Most Popular)', price: 3600, isPopular: true },
      { volume: '30 ml', label: '30ml Double Value Size', price: 6200 },
    ],
    videos: [
      { title: 'Cooling Ceramic Tip Eye Massage', duration: '0:30', thumb: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Cooling Depuffing Peptide Eye Gel-Balm' },
      { label: 'Actives', value: 'Matrixyl 3000, Haloxyl, Green Tea EGCG, Caffeine 5%' },
      { label: 'Lab', value: 'Maison de Rose Atelier, Gulberg III, Lahore, Pakistan' },
      { label: 'Product SKU', value: 'MDR-EYE-15' },
    ],
    description: 'An awakening eye concentrate fitted with a medical-grade cooling ceramic tip. Targets stubborn genetic dark circles, under-eye morning fluid retention, and crow’s feet.',
    ritualBullets: [
      'Gently squeeze tube and glide the cooling ceramic applicator around the orbital bone morning and night.',
    ],
    inci: 'Water, Caffeine, Palmitoyl Tripeptide-1, Camellia Sinensis (Green Tea) Leaf Extract, Niacinamide, Sodium Hyaluronate.',
    note: 'Safe for sensitive eyelids and wearers of eyelash extensions.',
    reviews: [
      { id: 'rev-e1', author: 'Nida H. (Karachi)', verified: true, date: 'Nov 1, 2026', stars: 5, comment: 'The cooling applicator instantly wakes up my puffy morning eyes! Dark circles faded in a few weeks.' },
    ],
  },

  'prod-peptide-tint': {
    id: 'prod-peptide-tint',
    name: 'Tinted Peptide Lip Cushion in "Peshawar Nude"',
    brandName: 'Noor Artisanal Cosmetics',
    brandSlug: 'noor-artisanal',
    brandRating: 4.7,
    brandItemsSold: 830,
    sku: 'NAC-PLC-30',
    price: 3950,
    compareAtPrice: 4600,
    rating: 4.7,
    reviewCount: 38,
    badge: 'Trending',
    category: 'makeup',
    categoryLabel: 'Peptide Lip Treatments',
    images: [
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '10 ml', label: '10ml Cushion Squeeze Tube (Standard)', price: 3950, isPopular: true },
    ],
    videos: [
      { title: 'Plumping Peptide Cushion Gloss Test', duration: '0:25', thumb: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Plumping Peptide Gloss-Balm Hybrid' },
      { label: 'Shade', value: 'Peshawar Nude (Warm Terracotta Rosy Nude)' },
      { label: 'Lab', value: 'Noor Atelier, Sector F-7, Islamabad, Pakistan' },
      { label: 'Product SKU', value: 'NAC-PLC-30' },
    ],
    description: 'A restorative lip cushion packed with tri-peptides and babassu seed oil. Plumps fine lines, leaves a mirror-glaze cushion finish, and never feels sticky.',
    ritualBullets: ['Apply directly to bare lips throughout the day or layer over lip pencils.'],
    inci: 'Polybutene, Diisostearyl Malate, Palmitoyl Tripeptide-38, Orbignya Oleifera Seed Oil, Shea Butter, Iron Oxides.',
    note: 'Non-burning peptide formulation without painful chili or cinnamon irritation.',
    reviews: [
      { id: 'rev-pt1', author: 'Zoha S. (Peshawar)', verified: true, date: 'Oct 28, 2026', stars: 5, comment: 'The Peshawar Nude shade is perfection! Plumps without stinging.' },
    ],
  },

  'prod-rose-clay-mask': {
    id: 'prod-rose-clay-mask',
    name: 'Rose & Pink Himalayan Clay Purifying Mask 100ml',
    brandName: 'Botanica Raw Labs',
    brandSlug: 'botanica-raw-labs',
    brandRating: 4.9,
    brandItemsSold: 1280,
    sku: 'BRL-RCM-100',
    price: 2950,
    compareAtPrice: 3400,
    rating: 4.9,
    reviewCount: 77,
    badge: 'Purifying',
    category: 'skincare',
    categoryLabel: 'Clay Facial Treatments',
    images: [
      'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '50 ml', label: '50ml Intro Pot', price: 1750 },
      { volume: '100 ml', label: '100ml Glass Jar with Application Brush (Most Popular)', price: 2950, isPopular: true },
    ],
    videos: [
      { title: 'Pink Clay Brush Application', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: 'Creamy Mineral Clay Detoxifying Face Mask' },
      { label: 'Key Minerals', value: 'Kewra Rose Water, Pink Himalayan Clay, Kaolin, Allantoin' },
      { label: 'Lab', value: 'Botanica Labs, Industrial Area I-9, Islamabad, Pakistan' },
      { label: 'Product SKU', value: 'BRL-RCM-100' },
    ],
    description: 'Blended with pure pink Himalayan mineral clay and steam-distilled kewra rose water. Unclogs urban pollution and clears blackheads without stripping your natural skin barrier.',
    ritualBullets: ['Apply an even layer using the brush. Leave on for 10 minutes until touch-dry, then rinse with warm water.'],
    inci: 'Kaolin (Pink Clay), Rosa Damascena Flower Water, Glycerin, Sodium Hyaluronate, Allantoin.',
    note: 'Infused with soothing allantoin so the clay does not crack or feel uncomfortably tight.',
    reviews: [
      { id: 'rev-rc1', author: 'Kiran A. (Lahore)', verified: true, date: 'Oct 23, 2026', stars: 5, comment: 'Left my skin glowing and clean without any dryness. The rose water scent is divine.' },
    ],
  },

  'prod-amber-attar': {
    id: 'prod-amber-attar',
    name: 'Imperial White Amber & Taif Rose Attar 6ml',
    brandName: 'Aura Scents House',
    brandSlug: 'aura-scents',
    brandRating: 5.0,
    brandItemsSold: 460,
    sku: 'ASH-TAIF-06',
    price: 6500,
    compareAtPrice: 7500,
    rating: 5.0,
    reviewCount: 29,
    badge: 'Pure Extrait',
    category: 'fragrance',
    categoryLabel: 'Rare Amber & Rose Attars',
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: '3 ml', label: '3ml Crystal Flaconette', price: 3800 },
      { volume: '6 ml', label: '6ml Hand-Cut Crystal Tola (Most Popular)', price: 6500, isPopular: true },
      { volume: '12 ml', label: '12ml Grand Crystal Decanter', price: 11900 },
    ],
    videos: [
      { title: 'Taif Rose Essence Hydro-Distillation', duration: '0:48', thumb: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Type', value: '100% Pure Concentrated Perfume Oil' },
      { label: 'Notes', value: 'White Amber Crystals, Rare Mountain Taif Rose, White Musk, Sandalwood' },
      { label: 'Lab', value: 'Aura Scents House, DHA Phase 6, Karachi, Pakistan' },
      { label: 'Product SKU', value: 'ASH-TAIF-06' },
    ],
    description: 'An ethereal creation marrying luminous white amber with high-altitude Taif rose petals. Crisp, uplifting, crystalline, and delicately powdered.',
    ritualBullets: ['Apply a drop to inner wrists and touch lightly behind the ears.'],
    inci: 'Pure Hydro-Distilled Taif Rose Otto, Ambergris Extract, Santalum Album Oil, White Musk Accord.',
    note: 'Alcohol-free and presented in a velvet gift box.',
    reviews: [
      { id: 'rev-ta1', author: 'Dr. Shahzad E. (Karachi)', verified: true, date: 'Oct 17, 2026', stars: 5, comment: 'Clean, aristocratic, and long-lasting without being overpowering.' },
    ],
  },
};

export function getProductById(id: string): StoreOwnerProductDetails {
  if (!id) return PRODUCTS_DATABASE['prod-saffron-rose'];

  // 1. Direct match
  if (PRODUCTS_DATABASE[id]) {
    return PRODUCTS_DATABASE[id];
  }

  // 2. Normalized match (e.g. without prod- prefix or lowercase)
  const normId = id.toLowerCase().trim();
  const withPrefix = normId.startsWith('prod-') ? normId : `prod-${normId}`;
  if (PRODUCTS_DATABASE[withPrefix]) {
    return PRODUCTS_DATABASE[withPrefix];
  }

  // Find by partial key
  for (const key of Object.keys(PRODUCTS_DATABASE)) {
    if (key.includes(normId) || normId.includes(key.replace('prod-', ''))) {
      return PRODUCTS_DATABASE[key];
    }
  }

  // 3. Dynamic synthesis fallback matching category & name from slug
  const titleWords = normId
    .replace('prod-', '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  let category = 'skincare';
  let categoryLabel = 'Curated Beauty Formulation';
  let brandName = 'Maison de Rose';
  let brandSlug = 'maison-de-rose';
  let defaultPrice = 4500;

  if (normId.includes('lip') || normId.includes('kohl') || normId.includes('rouge') || normId.includes('tint') || normId.includes('blush') || normId.includes('foundation')) {
    category = 'makeup';
    categoryLabel = 'Artisanal Cosmetics';
    brandName = 'Noor Artisanal Cosmetics';
    brandSlug = 'noor-artisanal';
    defaultPrice = 3200;
  } else if (normId.includes('oud') || normId.includes('attar') || normId.includes('perfume') || normId.includes('fragrance') || normId.includes('scent')) {
    category = 'fragrance';
    categoryLabel = 'Niche Fragrance & Rare Attars';
    brandName = 'Aura Scents House';
    brandSlug = 'aura-scents';
    defaultPrice = 8500;
  } else if (normId.includes('hair') || normId.includes('scalp') || normId.includes('tonic') || normId.includes('rosemary') || normId.includes('amla')) {
    category = 'haircare';
    categoryLabel = 'Botanical Scalp & Hair Rituals';
    brandName = 'Botanica Raw Labs';
    brandSlug = 'botanica-raw-labs';
    defaultPrice = 3600;
  } else if (normId.includes('body') || normId.includes('polish') || normId.includes('souffle') || normId.includes('bath')) {
    category = 'bath-body';
    categoryLabel = 'Bath & Body Rituals';
    brandName = 'Indisense Rituals';
    brandSlug = 'indisense-rituals';
    defaultPrice = 4200;
  }

  return {
    id: normId,
    name: `${titleWords} Formulation`,
    brandName,
    brandSlug,
    brandRating: 4.9,
    brandItemsSold: 650,
    sku: `MAK-${normId.slice(0, 6).toUpperCase()}-01`,
    price: defaultPrice,
    compareAtPrice: Math.round(defaultPrice * 1.15),
    rating: 4.9,
    reviewCount: 38,
    badge: 'Artisanal Batch',
    category,
    categoryLabel,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=95',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=95',
    ],
    sizes: [
      { volume: 'Standard', label: 'Standard Size (Most Popular)', price: defaultPrice, isPopular: true },
      { volume: 'Deluxe', label: 'Deluxe Value Size', price: Math.round(defaultPrice * 1.7) },
    ],
    videos: [
      { title: 'Formulator Batch Inspection', duration: '0:35', thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
      { title: 'Application Ritual', duration: '0:42', thumb: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
    ],
    specs: [
      { label: 'Formulation Type', value: `${categoryLabel} Handcrafted Batch` },
      { label: 'Origin', value: `${brandName} Atelier, Pakistan` },
      { label: 'Certifications', value: '100% Halal Certified, Cruelty-Free, Paraben-Free' },
      { label: 'Shelf Life', value: '18 Months from Handcraft Date' },
    ],
    description: `An authentic formulation handcrafted by certified Pakistani formulators at ${brandName}. Pure botanicals and high-performance actives compounded under strict quality control.`,
    ritualBullets: [
      'Dispense desired amount onto clean skin or hair.',
      'Massage gently in circular motions until fully absorbed.',
    ],
    inci: 'Aqua, Botanical Extracts, Plant Squalane, Tocopherol (Vitamin E), Natural Essential Oils.',
    note: 'Crafted in limited small batches. Store in a cool dry place away from direct sunlight.',
    reviews: [
      { id: 'rev-d1', author: 'Verified Patron (Lahore)', verified: true, date: 'Nov 1, 2026', stars: 5, comment: `Exceptional quality from ${brandName}. Delivered securely via Cash on Delivery in 2 days.` },
    ],
  };
}

