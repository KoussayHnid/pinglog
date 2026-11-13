import Link from 'next/link'
import Script from 'next/script'
import { HeroMockup } from '@/components/landing/hero-mockup'
import { SiteFooter, SiteHeader } from '@/components/landing/site-chrome'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Everything you need to start listening to your users.',
    features: ['1 project', 'Up to 10 posts', 'Public changelog and roadmap', 'Powered by PingLog'],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'More room to grow, with a fully branded experience.',
    features: [
      'Unlimited projects and posts',
      'Custom widget colors',
      'Remove the Powered by PingLog badge',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    featured: true,
  },
]

const features = [
  {
    title: '1-Line Installation',
    description:
      'One script tag gets you live in 30 seconds. Under 15 KB, with Shadow DOM isolation to keep your styles conflict-free.',
    note: 'Lightweight by design · Zero CSS conflicts',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m13 2-3 8h7L9 22l2-9H5l8-11Z" />
      </svg>
    ),
    iconStyle: 'border-amber-100 bg-amber-50 text-amber-600',
  },
  {
    title: 'Public Roadmap & Voting',
    description:
      'Give customers a voice. Collect suggestions, let users vote on upcoming features, and keep everyone in the loop as you ship.',
    note: 'Customer-powered · Always transparent',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10M7 17 17 7M5 5v.01M19 19v.01" />
      </svg>
    ),
    iconStyle: 'border-indigo-100 bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Custom Branding',
    description:
      'Match the widget to your product in a click with custom accent colors, and remove PingLog branding when you move to Pro.',
    note: 'Your brand, your product',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-1.2a1.8 1.8 0 0 1-1.4-3 2 2 0 0 0-1.5-3.3H12Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h.01M10 7.5h.01M15.5 14h.01" />
      </svg>
    ),
    iconStyle: 'border-violet-100 bg-violet-50 text-violet-600',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-indigo-50/50 to-white">
          <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 size-[34rem] -translate-x-1/2 rounded-full bg-indigo-200/20 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span aria-hidden="true">✨</span>
              Ship faster, keep users in the loop
            </div>
            <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-extrabold leading-[1.06] tracking-tight text-slate-900 md:text-6xl">
              The 1-line Changelog &amp; Roadmap widget for modern SaaS.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Announce product updates, collect user feedback, and prioritize your roadmap without bloating your app.
              Installs in 30 seconds.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
              >
                Get started free
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                <svg className="size-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 10 6-10 6V6Z" />
                </svg>
                View Live Demo
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>✓ Free forever plan</span>
              <span>✓ No credit card required</span>
              <span>✓ Setup in 30 seconds</span>
            </div>
            <div id="installation" className="scroll-mt-24">
              <HeroMockup />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-b border-slate-100 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Built for product teams</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Product feedback, without the overhead.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Everything you need to share progress and build the right things next.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-md"
                >
                  <span className={`flex size-11 items-center justify-center rounded-lg border ${feature.iconStyle}`}>
                    {feature.icon}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                    {feature.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-24 border-b border-slate-100 bg-slate-50/70 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Try it live</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your users are already part of the roadmap.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Open the floating PingLog button in the bottom-right corner to explore product updates, submit an idea,
              and vote. This live demo runs locally in your browser.
            </p>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Pricing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Simple plans. No surprises.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border bg-white p-7 sm:p-8 ${
                    plan.featured
                      ? 'border-indigo-600 shadow-xl shadow-indigo-900/5'
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-slate-900">{plan.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                  <p className="mt-7 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-950">{plan.price}</span>
                    <span className="text-sm text-slate-500">/mo</span>
                  </p>
                  <ul className="mt-7 flex-1 space-y-3.5 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="mt-px text-sm font-bold text-emerald-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className={`mt-8 inline-flex justify-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      plan.featured
                        ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50 py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Ready to ship in public?</h2>
              <p className="mt-2 text-sm text-slate-600">Start sharing updates with your users today.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex shrink-0 items-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Start for free <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <Script src="/widget.js?demo=1" data-demo="true" strategy="afterInteractive" />
    </div>
  )
}
