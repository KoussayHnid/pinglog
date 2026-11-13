import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
}

function withCors(response: Response): Response {
  for (const [name, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(name, value)
  }
  return response
}

// Public widget API endpoint
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = request.headers.get('x-api-key') || searchParams.get('key')

  if (!apiKey) {
    return withCors(NextResponse.json({ error: 'API key is required' }, { status: 400 }))
  }

  const supabase = createSupabaseAdminClient()

  // Find project by api_key
  const { data: project, error: pErr } = await supabase
    .from('projects')
    .select('id, name, domain, accent_color, user_id')
    .eq('api_key', apiKey)
    .single()

  if (pErr || !project) {
    return withCors(NextResponse.json({ error: 'Projet introuvable pour cette clé API' }, { status: 404 }))
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', project.user_id)
    .maybeSingle()

  if (subscriptionError || !subscription) {
    return withCors(NextResponse.json({ error: 'Abonnement du projet indisponible' }, { status: 500 }))
  }

  const isPro = subscription.plan === 'pro' && subscription.status === 'active'

  // Fetch published changelogs
  const { data: changelogs } = await supabase
    .from('changelogs')
    .select('*')
    .eq('project_id', project.id)
    .order('published_at', { ascending: false })

  // Fetch feedback items
  const { data: feedback } = await supabase
    .from('feedback_items')
    .select('*')
    .eq('project_id', project.id)
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })

  return withCors(NextResponse.json(
    {
      project: {
        id: project.id,
        name: project.name,
        domain: project.domain,
        accent_color: isPro ? project.accent_color : '#4F46E5',
      },
      plan: isPro ? 'pro' : 'free',
      changelogs: changelogs || [],
      feedback: feedback || [],
    },
  ))
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = request.headers.get('x-api-key') || searchParams.get('key')

  if (!apiKey) {
    return withCors(NextResponse.json({ error: 'API key is required' }, { status: 400 }))
  }

  const supabase = createSupabaseAdminClient()

  const { data: project, error: pErr } = await supabase
    .from('projects')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (pErr || !project) {
    return withCors(NextResponse.json({ error: 'Projet introuvable' }, { status: 404 }))
  }

  try {
    const body = await request.json()
    const { action } = body

    // Action 1: Submit new feedback
    if (action === 'submit_feedback') {
      const { title, description } = body
      if (!title || !title.trim()) {
        return withCors(NextResponse.json({ error: 'Titre requis' }, { status: 400 }))
      }

      const { data, error } = await supabase
        .from('feedback_items')
        .insert({
          project_id: project.id,
          title: title.trim(),
          description: description?.trim() || null,
          status: 'Under Review',
          votes_count: 0,
        })
        .select()
        .single()

      if (error) {
        return withCors(NextResponse.json({ error: error.message }, { status: 500 }))
      }

      return withCors(NextResponse.json({ success: true, item: data }))
    }

    // Action 2: Upvote a feedback item
    if (action === 'vote') {
      const { feedback_id, voter_fingerprint } = body
      if (!feedback_id || !voter_fingerprint) {
        return withCors(NextResponse.json({ error: 'Données manquantes pour le vote' }, { status: 400 }))
      }

      const { error } = await supabase.from('votes').insert({
        feedback_id,
        voter_fingerprint,
      })

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation (already voted)
          return withCors(NextResponse.json(
            { error: 'Vous avez déjà voté pour cette suggestion' },
            { status: 409 }
          ))
        }
        return withCors(NextResponse.json({ error: error.message }, { status: 500 }))
      }

      return withCors(NextResponse.json({ success: true }))
    }

    return withCors(NextResponse.json({ error: 'Action non reconnue' }, { status: 400 }))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected widget API error'
    return withCors(NextResponse.json({ error: message }, { status: 500 }))
  }
}

export async function OPTIONS() {
  return withCors(new Response(null, {
    status: 204,
  }))
}
