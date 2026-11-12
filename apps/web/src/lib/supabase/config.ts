export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabasePublicConfig();
  if (!url || !anonKey) return false;
  if (url.includes('your-project') || url.includes('YOUR_SUPABASE')) return false;
  if (anonKey.includes('your-anon-key') || anonKey.includes('YOUR_SUPABASE')) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
}

export function isSupabaseAdminConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const serviceKey = getSupabaseServiceRoleKey();
  if (!serviceKey) return false;
  if (serviceKey.includes('your-service-role-key') || serviceKey.includes('YOUR_SUPABASE')) {
    return false;
  }
  return true;
}

