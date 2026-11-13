import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/app/actions/projects'
import { getChangelogs } from '@/app/actions/changelog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ChangelogForm } from '@/components/changelog/changelog-form'
import { DeleteChangelogButton } from '@/components/changelog/delete-changelog-button'
import { formatDate } from '@/lib/utils'
import { getCurrentSubscription } from '@/app/actions/subscriptions'

interface ChangelogPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectChangelogPage({ params }: ChangelogPageProps) {
  const { id } = await params
  const { data: project, error: pError } = await getProject(id)

  if (pError || !project) {
    notFound()
  }

  const [{ data: changelogs = [], error: cError }, { data: subscription }] = await Promise.all([
    getChangelogs(id),
    getCurrentSubscription(),
  ])
  const isPro = subscription?.plan === 'pro' && subscription.status === 'active'
  const changelogLimitReached = !isPro && changelogs.length >= 10

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/dashboard/projects" className="hover:text-slate-700 transition-colors">
              Projets
            </Link>
            <span>/</span>
            <Link href={`/dashboard/projects/${project.id}`} className="hover:text-slate-700 transition-colors">
              {project.name}
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">Changelog</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Changelog & Mises à jour
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Partagez vos nouveautés, améliorations et correctifs directement sur votre widget.
          </p>
        </div>

        <ChangelogForm projectId={project.id} disabled={changelogLimitReached} />
      </div>

      {changelogLimitReached && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Le plan Free est limité à 10 entrées Changelog. Passez à Pro pour publier sans limite.
        </div>
      )}

      {cError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
          Erreur: {cError}
        </div>
      )}

      {/* Changelog Entries List */}
      {changelogs.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Aucune entrée pour le moment</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
            Publiez votre première note de version pour informer vos utilisateurs des dernières évolutions de votre produit.
          </p>
          <div className="inline-block">
            <ChangelogForm projectId={project.id} disabled={changelogLimitReached} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {changelogs.map((item) => (
            <Card key={item.id} className="hover:border-slate-300 transition-colors shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Badge variant={item.category}>{item.category}</Badge>
                      <span className="text-xs text-slate-400">
                        {item.published_at ? formatDate(item.published_at) : 'Brouillon'}
                      </span>
                    </div>

                    <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                      {item.title}
                    </h2>

                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pt-1 font-normal">
                      {item.content}
                    </div>
                  </div>

                  <DeleteChangelogButton
                    id={item.id}
                    projectId={project.id}
                    title={item.title}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
