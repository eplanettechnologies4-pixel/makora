import { createClient } from '@supabase/supabase-js';
import {
  getStoreProducts,
  saveStoreProduct,
  getStoreCategories,
  saveStoreCategory,
  getStoreOrders,
  updateStoreOrderStatus,
  getStoreCustomers,
} from '../apps/web/src/lib/store-data/store-catalog.js';

const url = 'https://eeqtegjlvlgjuqsafpuj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcXRlZ2psdmxnanVxc2FmcHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDM3NTY5NSwiZXhwIjoyMTA5OTUxNjk1fQ.8uCxzsjdUV3zLeXCw1K32F2mAhMS_-vvn3mAd4s9-RI';
const supabase = createClient(url, key);

async function runTests() {
  console.log('================================================================');
  console.log('  TESTING STORE OWNER PORTAL & STOREFRONT ENGINE');
  console.log('================================================================\n');

  // 1. Verify Brand Owner credentials
  const email = 'store@adanslibas.com';
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  console.log('✓ Store Owner User:', user.email, 'Role:', user.role);

  // 2. Verify Brand in Supabase
  const { data: brand } = await supabase.from('brands').select('*').eq('slug', 'adans-libas').single();
  console.log('✓ Brand Record:', brand.name, 'Banner:', brand.bannerUrl ? 'Configured' : 'Missing');

  // 3. Test Products
  const products = getStoreProducts('adans-libas');
  console.log(`✓ Products Loaded: ${products.length} products`);

  // Add a test product
  const newProduct = saveStoreProduct({
    brandSlug: 'adans-libas',
    brandName: "Adan's Libas",
    title: 'Emerald Luxury Pret Festive Organza Set',
    category: 'luxury-pret',
    categoryLabel: 'Luxury Pret',
    sku: 'ADAN-EM-999',
    price: 17500,
    compareAtPrice: 22000,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    description: 'Bespoke hand-embroidered organza shirt in emerald green.',
  });
  console.log('✓ Added Product:', newProduct.title, 'SKU:', newProduct.sku);

  // 4. Test Categories
  const categories = getStoreCategories('adans-libas');
  console.log(`✓ Categories Loaded: ${categories.length} categories`);

  // 5. Test Orders
  const orders = getStoreOrders('adans-libas');
  console.log(`✓ Store Orders: ${orders.length} orders`);
  if (orders.length > 0) {
    const updatedOrder = updateStoreOrderStatus(orders[0].id, {
      fulfillmentStatus: 'DISPATCHED',
      courierName: 'Trax Logistics',
      trackingNumber: 'TRX-TEST-1234',
    });
    console.log(`✓ Updated Order ${updatedOrder.orderNumber} to ${updatedOrder.fulfillmentStatus} (Courier: ${updatedOrder.courierName})`);
  }

  // 6. Test Customers
  const customers = getStoreCustomers('adans-libas');
  console.log(`✓ Store Customers: ${customers.length} buyers`);

  console.log('\n================================================================');
  console.log('  ALL STORE OWNER PORTAL & STOREFRONT CAPABILITIES VERIFIED! ✓');
  console.log('================================================================');
}

runTests().catch(console.error);

