import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface LemonSqueezyEvent {
  meta?: {
    event_name?: unknown
    custom_data?: {
      user_id?: unknown
    }
  }
  data?: {
    id?: unknown
    attributes?: {
      customer_id?: unknown
      status?: unknown
    }
  }
}

function asExternalId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
    return String(value)
  }
  return null
}

function isUuid(value: string): boolean {
  return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value)
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secret || !serviceRoleKey) {
    console.error('[Lemon Squeezy webhook] Missing webhook secret or Supabase service role key.')
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 500 })
  }

  const signature = request.headers.get('x-signature')
  if (!signature || !/^[\da-f]{64}$/i.test(signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const rawBody = await request.text()
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest()
  const received = Buffer.from(signature, 'hex')

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: LemonSqueezyEvent
  try {
    event = JSON.parse(rawBody) as LemonSqueezyEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const eventName = event.meta?.event_name
  if (
    eventName !== 'subscription_created' &&
    eventName !== 'subscription_updated' &&
    eventName !== 'subscription_cancelled'
  ) {
    return NextResponse.json({ received: true, ignored: true })
  }

  const subscriptionId = asExternalId(event.data?.id)
  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: existingSubscription, error: lookupError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('lemon_squeezy_subscription_id', subscriptionId)
    .maybeSingle()

  if (lookupError) {
    console.error('[Lemon Squeezy webhook] Subscription lookup failed:', lookupError.message)
    return NextResponse.json({ error: 'Unable to resolve subscription' }, { status: 500 })
  }

  const customUserId = event.meta?.custom_data?.user_id
  const userId =
    typeof customUserId === 'string' && isUuid(customUserId)
      ? customUserId
      : existingSubscription?.user_id

  if (!userId || (existingSubscription && existingSubscription.user_id !== userId)) {
    return NextResponse.json({ error: 'Subscription user could not be verified' }, { status: 400 })
  }

  if (eventName !== 'subscription_created') {
    const { data: currentSubscription, error: currentError } = await supabase
      .from('subscriptions')
      .select('lemon_squeezy_subscription_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (currentError) {
      console.error('[Lemon Squeezy webhook] Current subscription lookup failed:', currentError.message)
      return NextResponse.json({ error: 'Unable to resolve subscription' }, { status: 500 })
    }

    if (
      currentSubscription?.lemon_squeezy_subscription_id &&
      currentSubscription.lemon_squeezy_subscription_id !== subscriptionId
    ) {
      return NextResponse.json({ received: true, ignored: true })
    }
  }

  const providerStatus = event.data?.attributes?.status
  const isCancelledEvent = eventName === 'subscription_cancelled' || providerStatus === 'cancelled'
  const isActive = providerStatus === 'active' || providerStatus === 'on_trial'
  const isPastDue = providerStatus === 'past_due'
  const status = isCancelledEvent ? 'cancelled' : isActive ? 'active' : isPastDue ? 'past_due' : 'cancelled'
  const plan = status === 'active' ? 'pro' : 'free'

  const { error: updateError } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan,
        status,
        lemon_squeezy_customer_id: asExternalId(event.data?.attributes?.customer_id),
        lemon_squeezy_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (updateError) {
    console.error('[Lemon Squeezy webhook] Subscription update failed:', updateError.message)
    return NextResponse.json({ error: 'Unable to update subscription' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
