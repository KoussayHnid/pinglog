'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Subscription } from '@/types/database'

export async function getCurrentSubscription(): Promise<{
  data?: Subscription
  error?: string
}> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return { error: `Impossible de charger votre abonnement : ${error.message}` }
  }

  if (!data) {
    return { error: 'Abonnement introuvable. Vérifiez la migration subscriptions.' }
  }

  return { data }
}
