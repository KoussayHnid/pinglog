import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      // fall through to error redirect
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', request.url))
}
