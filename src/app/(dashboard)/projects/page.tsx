import Link from 'next/link'
import { getProjects } from '@/app/actions/projects'
import { ProjectCreateForm } from '@/components/projects/project-create-form'
import { formatDate } from '@/lib/utils'
import { getCurrentSubscription } from '@/app/actions/subscriptions'

export default async function ProjectsPage() {
  const [{ data: projects = [], error }, { data: subscription }] = await Promise.all([
    getProjects(),
    getCurrentSubscription(),
  ])
  const isPro = subscription?.plan === 'pro' && subscription.status === 'active'
  const projectLimitReached = !isPro && projects.length >= 1

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Projets
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos applications, intégrez votre widget et suivez les retours clients.
          </p>
        </div>
        <ProjectCreateForm isPro={isPro} disabled={projectLimitReached} />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
          Erreur de chargement: {error}
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Aucun projet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5 max-w-xs mx-auto">
            Vous n&apos;avez pas encore configuré de projet. Créez-en un pour obtenir votre clé API et installer votre widget.
          </p>
          <div className="inline-block">
            <ProjectCreateForm isPro={isPro} disabled={projectLimitReached} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group relative flex flex-col bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Top Accent Stripe */}
              <div
                className="h-1.5 w-full transition-opacity group-hover:opacity-90"
                style={{ backgroundColor: isPro ? project.accent_color || '#4f46e5' : '#4f46e5' }}
              />

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {project.name}
                    </h3>
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: isPro ? project.accent_color || '#4f46e5' : '#4f46e5' }}
                    />
                  </div>

                  {project.domain ? (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {project.domain}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      Aucun domaine spécifié
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-[11px] text-slate-600">
                    {project.api_key.slice(0, 10)}...
                  </span>
                  <span>{formatDate(project.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
