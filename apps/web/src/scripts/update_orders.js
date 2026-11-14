const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/store_catalog.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const brandDir = {
  'adans-libas': { brandName: "Adan's Libas", ownerName: 'Adan Khan', ownerEmail: 'store@adanslibas.com' },
  'maison-de-rose': { brandName: 'Maison de Rose', ownerName: 'Zainab Qureshi', ownerEmail: 'store@maisonderose.com' },
  'aura-scents': { brandName: 'Aura Scents House', ownerName: 'Bilal Ahmed', ownerEmail: 'store@aurascents.pk' },
  'noor-artisanal': { brandName: 'Noor Artisanal Cosmetics', ownerName: 'Noor Fatima', ownerEmail: 'store@noorcosmetics.com' },
  'botanica-raw-labs': { brandName: 'Botanica Raw Labs', ownerName: 'Hamza Baig', ownerEmail: 'store@botanicaraw.pk' }
};

// Update existing orders
data.orders = data.orders.map(o => {
  const meta = brandDir[o.brandSlug] || brandDir['adans-libas'];
  return {
    ...o,
    brandName: meta.brandName,
    storeOwnerName: meta.ownerName,
    storeOwnerEmail: meta.ownerEmail,
  };
});

// Add diverse multi-store orders so main admin sees multiple stores
const extraOrders = [
  {
    id: 'ord-mdr-201',
    orderNumber: 'MAK-2026-8812',
    brandSlug: 'maison-de-rose',
    brandName: 'Maison de Rose',
    storeOwnerName: 'Zainab Qureshi',
    storeOwnerEmail: 'store@maisonderose.com',
    customerName: 'Khadija Rehman',
    customerEmail: 'khadija.r@gmail.com',
    customerPhone: '+92 322 9182341',
    shippingAddress: 'House 88, Street 14, Cavalry Ground',
    city: 'Lahore',
    items: [
      {
        productId: 'prod-mdr-01',
        title: 'High-Altitude Saffron and Rosehip Restorative Night Elixir 30ml',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
        price: 8400,
        quantity: 1
      }
    ],
    subtotal: 8400,
    shippingFee: 250,
    total: 8650,
    paymentMethod: 'COD',
    codStatus: 'PENDING',
    fulfillmentStatus: 'PENDING',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'ord-aura-301',
    orderNumber: 'MAK-2026-8845',
    brandSlug: 'aura-scents',
    brandName: 'Aura Scents House',
    storeOwnerName: 'Bilal Ahmed',
    storeOwnerEmail: 'store@aurascents.pk',
    customerName: 'Muhammad Hamza',
    customerEmail: 'hamza.m@yahoo.com',
    customerPhone: '+92 301 5567821',
    shippingAddress: 'Flat 12, Ocean View Towers, Clifton Block 4',
    city: 'Karachi',
    items: [
      {
        productId: 'prod-aura-01',
        title: 'Cambodian Oud and Damask Rose Extrait de Parfum 50ml',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        price: 24500,
        quantity: 1
      }
    ],
    subtotal: 24500,
    shippingFee: 0,
    total: 24500,
    paymentMethod: 'ONLINE',
    codStatus: 'COLLECTED',
    fulfillmentStatus: 'PROCESSING',
    courierName: 'Trax Logistics',
    trackingNumber: 'TRX-94810294',
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString()
  },
  {
    id: 'ord-noor-401',
    orderNumber: 'MAK-2026-8877',
    brandSlug: 'noor-artisanal',
    brandName: 'Noor Artisanal Cosmetics',
    storeOwnerName: 'Noor Fatima',
    storeOwnerEmail: 'store@noorcosmetics.com',
    customerName: 'Anum Jahangir',
    customerEmail: 'anum.j@hotmail.com',
    customerPhone: '+92 334 1123987',
    shippingAddress: 'House 19-C, Sector G-11/3',
    city: 'Islamabad',
    items: [
      {
        productId: 'prod-noor-01',
        title: 'Halal Silk Peptide Radiant Tint and Lip Lacquer Bundle',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        price: 9200,
        quantity: 1
      }
    ],
    subtotal: 9200,
    shippingFee: 250,
    total: 9450,
    paymentMethod: 'COD',
    codStatus: 'PENDING',
    fulfillmentStatus: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  }
];

for (const eo of extraOrders) {
  if (!data.orders.find(o => o.id === eo.id)) {
    data.orders.unshift(eo);
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated store_catalog.json! Total orders:', data.orders.length);

