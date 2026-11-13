'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Project } from '@/types/database'

export async function getProjects(): Promise<{ data?: Project[]; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data: (data as Project[]) || [] }
}

export async function getProject(id: string): Promise<{ data?: Project; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data: data as Project }
}

export async function createProject(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const name = formData.get('name') as string
  const domain = (formData.get('domain') as string) || null
  const requestedAccentColor = (formData.get('accent_color') as string) || '#4f46e5'

  if (!name || name.trim().length === 0) {
    return { error: 'Le nom du projet est requis' }
  }

  if (!/^#[\da-f]{6}$/i.test(requestedAccentColor)) {
    return { error: 'La couleur du widget est invalide' }
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (subscriptionError || !subscription) {
    return { error: subscriptionError?.message || 'Abonnement introuvable' }
  }

  const isPro = subscription.plan === 'pro' && subscription.status === 'active'
  if (!isPro && requestedAccentColor.toLowerCase() !== '#4f46e5') {
    return { error: 'La personnalisation des couleurs est réservée au plan Pro.' }
  }

  if (!isPro) {
    const { count, error: countError } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      return { error: countError.message }
    }
    if ((count || 0) >= 1) {
      return { error: 'Le plan Free est limité à un projet. Passez à Pro pour en créer davantage.' }
    }
  }

  // Generate 24-byte random hex key in Node/Web crypto
  const randomBytes = new Uint8Array(24)
  crypto.getRandomValues(randomBytes)
  const api_key = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: name.trim(),
      domain: domain ? domain.trim() : null,
      accent_color: requestedAccentColor,
      api_key,
    })
    .select()
    .single()

  if (error) {
    if (error.message.includes('FREE_PROJECT_LIMIT')) {
      return { error: 'Le plan Free est limité à un projet. Passez à Pro pour en créer davantage.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/projects')
  return { data: data as Project }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const name = formData.get('name') as string
  const domain = (formData.get('domain') as string) || null
  const accent_color = (formData.get('accent_color') as string) || '#4f46e5'

  if (!name || name.trim().length === 0) {
    return { error: 'Le nom du projet est requis' }
  }

  if (!/^#[\da-f]{6}$/i.test(accent_color)) {
    return { error: 'La couleur du widget est invalide' }
  }

  const { data: existingProject, error: projectError } = await supabase
    .from('projects')
    .select('accent_color')
    .eq('id', id)
    .single()

  if (projectError || !existingProject) {
    return { error: projectError?.message || 'Projet introuvable' }
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (subscriptionError || !subscription) {
    return { error: subscriptionError?.message || 'Abonnement introuvable' }
  }

  const isPro = subscription.plan === 'pro' && subscription.status === 'active'
  if (!isPro && accent_color.toLowerCase() !== existingProject.accent_color.toLowerCase()) {
    return { error: 'La personnalisation des couleurs est réservée au plan Pro.' }
  }

  const { error } = await supabase
    .from('projects')
    .update({
      name: name.trim(),
      domain: domain ? domain.trim() : null,
      accent_color,
    })
    .eq('id', id)

  if (error) {
    if (error.message.includes('PRO_CUSTOM_BRANDING_REQUIRED')) {
      return { error: 'La personnalisation des couleurs est réservée au plan Pro.' }
    }
    return { error: error.message }
  }

  revalidatePath(`/dashboard/projects/${id}`)
  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function regenerateApiKey(projectId: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const randomBytes = new Uint8Array(24)
  crypto.getRandomValues(randomBytes)
  const newApiKey = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const { data, error } = await supabase
    .from('projects')
    .update({ api_key: newApiKey })
    .eq('id', projectId)
    .select('api_key')
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { data: { api_key: data.api_key } }
}
