import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_KEY = 'placeholder'

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Uses cookies for session management (Auth).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY

  return createServerClient<Database, 'public'>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll called from a Server Component – safe to ignore
        }
      },
    },
  })
}

/**
 * Supabase client with the service role key (bypasses RLS).
 * Use ONLY in trusted server-side code (Route Handlers, cron jobs).
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_KEY

  return createClient<Database, 'public'>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
