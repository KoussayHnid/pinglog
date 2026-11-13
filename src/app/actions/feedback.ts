'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { FeedbackItem, FeedbackStatus } from '@/types/database'

export async function getFeedbackItems(projectId: string): Promise<{ data?: FeedbackItem[]; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('feedback_items')
    .select('*')
    .eq('project_id', projectId)
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data: (data as FeedbackItem[]) || [] }
}

export async function updateFeedbackStatus(
  id: string,
  projectId: string,
  status: FeedbackStatus
) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('feedback_items')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/projects/${projectId}/feedback`)
  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function deleteFeedbackItem(id: string, projectId: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase.from('feedback_items').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/projects/${projectId}/feedback`)
  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

