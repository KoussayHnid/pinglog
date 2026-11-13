'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

interface SidebarProps {
  projectId?: string
}

export function Sidebar({ projectId: propProjectId }: SidebarProps) {
  const pathname = usePathname()

  // Extract projectId from path /dashboard/projects/[id]
  const match = pathname.match(/\/dashboard\/projects\/([^\/]+)/)
  const currentProjectId = propProjectId || (match ? match[1] : undefined)

  return (
    <aside className="w-56 h-full flex flex-col bg-white border-r border-slate-200 select-none">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-100">
        <Logo iconClassName="size-7" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          <Link
            href="/dashboard/projects"
            className={cn(
              'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
              pathname === '/dashboard/projects'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Tous les projets
          </Link>
        </div>

        {currentProjectId && (
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Projet actif
            </div>
            <div className="space-y-0.5">
              <Link
                href={`/dashboard/projects/${currentProjectId}`}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  pathname === `/dashboard/projects/${currentProjectId}`
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Vue d&apos;ensemble
              </Link>

              <Link
                href={`/dashboard/projects/${currentProjectId}/changelog`}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  pathname.includes('/changelog')
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Changelog
              </Link>

              <Link
                href={`/dashboard/projects/${currentProjectId}/feedback`}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  pathname.includes('/feedback')
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Feedback & Roadmap
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Footer / User info */}
      <div className="p-3 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Accueil
        </Link>
      </div>
    </aside>
  )
}
