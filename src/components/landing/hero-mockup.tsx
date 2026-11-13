'use client'

import * as React from 'react'

const SNIPPET_CODE =
  '<script src="https://pinglog.app/widget.js" data-key="pl_live_98a7f" async></script>'

export function HeroMockup() {
  const [copied, setCopied] = React.useState(false)
  const [copyError, setCopyError] = React.useState(false)
  const [votes, setVotes] = React.useState({ roadmap: 42, webhooks: 28, exports: 19 })
  const [voted, setVoted] = React.useState<string | null>(null)

  const copySnippet = async () => {
    setCopyError(false)
    try {
      await navigator.clipboard.writeText(SNIPPET_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
    }
  }

  const toggleVote = (key: 'roadmap' | 'webhooks' | 'exports') => {
    setVotes((current) => ({
      ...current,
      [key]: current[key] + (voted === key ? -1 : 1),
    }))
    setVoted((current) => (current === key ? null : key))
  }

  return (
    <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10">
      <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 sm:px-5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500 sm:flex">
          <svg className="size-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5 8V6a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm8-2v2H7V6a3 3 0 1 1 6 0Z" clipRule="evenodd" />
          </svg>
          your-saas.com
        </div>
        <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
          LIVE PREVIEW
        </span>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between bg-slate-950 p-5 text-slate-100 sm:p-7">
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span className="size-2 rounded-full bg-indigo-400" />
                index.html
              </span>
              <button
                type="button"
                onClick={copySnippet}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {copied ? (
                  <>
                    <svg className="size-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42.003L3.3 9.17a1 1 0 1 1 1.4-1.43l4.08 3.997 6.51-6.44a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="size-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="7" y="7" width="10" height="10" rx="2" />
                      <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="mb-4 text-xs leading-5 text-slate-400">
              Add this one line to your site. That&apos;s the whole setup.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-[11px] leading-6 sm:text-xs">
              <code>
                <span className="text-pink-300">&lt;script</span>{' '}
                <span className="text-sky-300">src</span>=
                <span className="text-emerald-300">&quot;https://pinglog.app/widget.js&quot;</span>{' '}
                <span className="text-sky-300">data-key</span>=
                <span className="text-emerald-300">&quot;pl_live_98a7f&quot;</span>{' '}
                <span className="text-sky-300">async</span>
                <span className="text-pink-300">&gt;&lt;/script&gt;</span>
              </code>
            </pre>
            {copyError && (
              <p role="status" className="mt-2 text-xs text-rose-300">
                Clipboard access failed. Select and copy the snippet instead.
              </p>
            )}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-slate-800 pt-5 text-center">
            <div>
              <p className="text-xs font-semibold text-indigo-300">&lt; 15 KB</p>
              <p className="mt-1 text-[10px] text-slate-500">Lightweight</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-300">Shadow DOM</p>
              <p className="mt-1 text-[10px] text-slate-500">No CSS conflicts</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-300">30 seconds</p>
              <p className="mt-1 text-[10px] text-slate-500">To go live</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 p-4 sm:p-7">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="10" cy="11" r="7" />
                    <circle cx="10" cy="11" r="3" />
                    <path d="M15.5 16.5h5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H19l-2 1v-2h-1.5A1.5 1.5 0 0 1 14 19v-1a1.5 1.5 0 0 1 1.5-1.5Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Acme Cloud</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Product updates</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                All systems live
              </span>
            </div>
            <div className="flex border-b border-slate-100 bg-slate-50/70 text-xs font-medium">
              <button type="button" className="border-b-2 border-indigo-600 bg-white px-4 py-2.5 font-semibold text-indigo-700">
                Changelog
                <span className="ml-1.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px]">3</span>
              </button>
              <button type="button" className="border-b-2 border-transparent px-4 py-2.5 text-slate-500">
                Roadmap
              </button>
            </div>
            <div className="space-y-3 p-3 sm:p-4">
              {[
                {
                  badge: 'NEW',
                  badgeClass: 'border-blue-200 bg-blue-50 text-blue-700',
                  date: 'May 14',
                  title: 'AI Autocomplete & Instant Search',
                  text: 'Find what you need in a flash with semantic search.',
                },
                {
                  badge: 'IMPROVEMENT',
                  badgeClass: 'border-violet-200 bg-violet-50 text-violet-700',
                  date: 'May 10',
                  title: 'Faster exports for everyone',
                  text: 'Large reports now export up to 5× faster.',
                },
                {
                  badge: 'FIX',
                  badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
                  date: 'May 08',
                  title: 'A smoother sign-in experience',
                  text: 'We fixed an issue with expired sessions.',
                },
              ].map((item) => (
                <article key={item.badge} className="rounded-lg border border-slate-100 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="text-[11px] font-semibold text-slate-900 sm:text-xs">{item.title}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">{item.text}</p>
                </article>
              ))}
              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Popular ideas</p>
                {[
                  { key: 'roadmap' as const, label: 'Native Raycast extension' },
                  { key: 'webhooks' as const, label: 'Webhooks on deployments' },
                  { key: 'exports' as const, label: 'More export formats' },
                ].map((idea) => (
                  <div key={idea.key} className="flex items-center gap-2 border-b border-slate-50 py-2 last:border-0">
                    <button
                      type="button"
                      aria-label={`${voted === idea.key ? 'Remove vote from' : 'Vote for'} ${idea.label}`}
                      aria-pressed={voted === idea.key}
                      onClick={() => toggleVote(idea.key)}
                      className={`flex shrink-0 flex-col items-center rounded-md border px-2 py-1 transition ${
                        voted === idea.key
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      <span className="text-[9px] leading-3">▲</span>
                      <span className="text-[10px] font-semibold leading-3">{votes[idea.key]}</span>
                    </button>
                    <span className="text-[10px] font-medium text-slate-700">{idea.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-center text-[9px] text-slate-400">
              Powered by <span className="font-semibold text-indigo-600">PingLog</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
