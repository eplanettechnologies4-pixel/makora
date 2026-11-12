import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  getSupabasePublicConfig,
  getSupabaseServiceRoleKey,
  isSupabaseAdminConfigured,
} from './config';

export function createAdminSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const { url } = getSupabasePublicConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

