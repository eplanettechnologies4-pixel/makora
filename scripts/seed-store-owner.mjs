import { createClient } from '@supabase/supabase-js';

const url = 'https://eeqtegjlvlgjuqsafpuj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcXRlZ2psdmxnanVxc2FmcHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDM3NTY5NSwiZXhwIjoyMTA5OTUxNjk1fQ.8uCxzsjdUV3zLeXCw1K32F2mAhMS_-vvn3mAd4s9-RI';
const supabase = createClient(url, key);

async function seed() {
  const email = 'store@adanslibas.com';
  const password = 'StoreOwner2026!Secure';

  console.log('Seeding demo store owner...');

  // 1. Check if user exists in auth
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('List users error:', listError);
  }
  let user = listData?.users?.find((u) => u.email === email);

  if (!user) {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { firstName: 'Adan', lastName: 'Khan' },
    });
    if (createError) {
      console.error('Error creating user in auth:', createError);
      return;
    }
    user = newUser.user;
    console.log('Created auth user:', user.id);
  } else {
    console.log('User already exists in auth:', user.id);
  }

  // 2. Insert into public.users if not present
  const { data: publicUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!publicUser) {
    const { error: insError } = await supabase.from('users').insert({
      id: user.id,
      email,
      firstName: 'Adan',
      lastName: 'Khan',
      phone: '+92 300 9876543',
      role: 'BRAND_OWNER',
      isActive: true,
      emailVerified: true,
    });
    console.log('Insert public user result:', insError || 'SUCCESS');
  } else {
    await supabase
      .from('users')
      .update({ role: 'BRAND_OWNER', isActive: true, emailVerified: true })
      .eq('id', user.id);
    console.log('Updated existing public user to BRAND_OWNER');
  }

  // 3. Insert into public.brands if not present
  const slug = 'adans-libas';
  const { data: existingBrand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!existingBrand) {
    const { data: newBrand, error: brandError } = await supabase
      .from('brands')
      .insert({
        name: "Adan's Libas",
        slug,
        description: 'Luxury Embroidered and Luxury Pret Couture Collection 2026',
        story:
          "Adan's Libas brings timeless Pakistani craftsmanship, hand-embroidered silhouettes, and contemporary luxury design together for the modern woman.",
        logoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
        status: 'APPROVED',
        businessType: 'PRIVATE_LIMITED',
        businessAddress: 'M.M. Alam Road, Gulberg III',
        city: 'Lahore',
        country: 'Pakistan',
        websiteUrl: 'https://adanslibas.pk',
        socialLinks: {
          instagram: 'https://instagram.com/adanslibas',
          facebook: 'https://facebook.com/adanslibas',
        },
        ownerId: user.id,
      })
      .select()
      .single();
    console.log('Created brand:', newBrand?.name, brandError || 'SUCCESS');
  } else {
    // Ensure it is approved and has banner/logo
    await supabase
      .from('brands')
      .update({
        status: 'APPROVED',
        bannerUrl:
          existingBrand.bannerUrl ||
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
        logoUrl:
          existingBrand.logoUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      })
      .eq('id', existingBrand.id);
    console.log('Brand already exists and is updated to APPROVED:', existingBrand.id);
  }

  console.log('\n--- Demo Store Owner Credentials ---');
  console.log('Email: store@adanslibas.com');
  console.log('Password: StoreOwner2026!Secure');
  console.log('Brand: Adan\'s Libas (slug: adans-libas)');
}

seed().catch(console.error);

