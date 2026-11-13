'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Changelog, Category } from '@/types/database'

export async function getChangelogs(projectId: string): Promise<{ data?: Changelog[]; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('changelogs')
    .select('*')
    .eq('project_id', projectId)
    .order('published_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data: (data as Changelog[]) || [] }
}

export async function createChangelog(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const projectId = formData.get('project_id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = (formData.get('category') as Category) || 'New'

  if (!projectId) {
    return { error: 'Identifiant de projet manquant' }
  }
  if (!title || title.trim().length === 0) {
    return { error: 'Le titre est requis' }
  }
  if (!content || content.trim().length === 0) {
    return { error: 'Le contenu est requis' }
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    return { error: projectError?.message || 'Projet introuvable' }
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', project.user_id)
    .maybeSingle()

  if (subscriptionError || !subscription) {
    return { error: subscriptionError?.message || 'Abonnement introuvable' }
  }

  const isPro = subscription.plan === 'pro' && subscription.status === 'active'
  if (!isPro) {
    const { count, error: countError } = await supabase
      .from('changelogs')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)

    if (countError) {
      return { error: countError.message }
    }
    if ((count || 0) >= 10) {
      return { error: 'Le plan Free est limité à 10 entrées Changelog. Passez à Pro pour continuer.' }
    }
  }

  const { error } = await supabase.from('changelogs').insert({
    project_id: projectId,
    title: title.trim(),
    content: content.trim(),
    category,
    published_at: new Date().toISOString(),
  })

  if (error) {
    if (error.message.includes('FREE_CHANGELOG_LIMIT')) {
      return { error: 'Le plan Free est limité à 10 entrées Changelog. Passez à Pro pour continuer.' }
    }
    return { error: error.message }
  }

  revalidatePath(`/dashboard/projects/${projectId}/changelog`)
  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function deleteChangelog(id: string, projectId: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase.from('changelogs').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/projects/${projectId}/changelog`)
  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}
