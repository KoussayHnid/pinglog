import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-5">
          <Logo />
          <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <Link className="transition-colors hover:text-slate-900" href="/#features">Features</Link>
            <Link className="transition-colors hover:text-slate-900" href="/#demo">Live Demo</Link>
            <Link className="transition-colors hover:text-slate-900" href="/#pricing">Pricing</Link>
            <Link className="transition-colors hover:text-slate-900" href="/#installation">Docs</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 lg:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Start for free <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <nav aria-label="Mobile navigation" className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 py-3 text-xs font-medium text-slate-600 lg:hidden">
          <Link className="transition-colors hover:text-slate-900" href="/#features">Features</Link>
          <Link className="transition-colors hover:text-slate-900" href="/#demo">Live Demo</Link>
          <Link className="transition-colors hover:text-slate-900" href="/#pricing">Pricing</Link>
          <Link className="transition-colors hover:text-slate-900" href="/#installation">Docs</Link>
          <Link className="transition-colors hover:text-slate-900" href="/login">Sign in</Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Logo iconClassName="size-6" />
          <span>© {new Date().getFullYear()} PingLog. All rights reserved.</span>
        </div>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link className="transition-colors hover:text-slate-900" href="/terms">Terms</Link>
          <Link className="transition-colors hover:text-slate-900" href="/privacy">Privacy</Link>
          <Link className="transition-colors hover:text-slate-900" href="/refund">Refunds</Link>
        </nav>
      </div>
    </footer>
  )
}

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string
  updatedAt: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8 sm:py-20">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Back to PingLog
        </Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {updatedAt}</p>
        <div className="legal-content mt-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
