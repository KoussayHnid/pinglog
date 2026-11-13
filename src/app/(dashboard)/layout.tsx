import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getCurrentSubscription } from '@/app/actions/subscriptions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscription, error: subscriptionError } = await getCurrentSubscription()
  const isPro = subscription?.plan === 'pro' && subscription.status === 'active'
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL
  let personalizedCheckoutUrl: string | null = null

  if (checkoutUrl) {
    try {
      const url = new URL(checkoutUrl)
      if (url.protocol === 'https:') {
        url.searchParams.set('checkout[custom][user_id]', user.id)
        personalizedCheckoutUrl = url.toString()
      }
    } catch {
      personalizedCheckoutUrl = null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {!isPro && (
          <div className="border-b border-indigo-100 bg-indigo-50/80 px-6 py-3">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Unlock the full PingLog experience</p>
                {subscriptionError ? (
                  <p role="status" className="text-xs text-amber-800">{subscriptionError}</p>
                ) : (
                  <p className="text-xs text-slate-600">Unlimited projects and updates, custom colors, and no PingLog badge.</p>
                )}
              </div>
              {personalizedCheckoutUrl ? (
                <a
                  href={personalizedCheckoutUrl}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Upgrade to Pro ($19/mo) <span className="ml-1.5" aria-hidden="true">→</span>
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-500">
                  {checkoutUrl ? 'Checkout URL is invalid.' : 'Checkout is not configured.'}
                </span>
              )}
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
