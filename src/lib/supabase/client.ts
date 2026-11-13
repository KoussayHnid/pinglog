import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Supabase client for Client Components.
 * Singleton pattern – call once and reuse.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  return createBrowserClient<Database, 'public'>(url, key)
}
