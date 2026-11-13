import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/app/actions/projects'
import { getFeedbackItems } from '@/app/actions/feedback'
import { Card, CardContent } from '@/components/ui/card'
import { FeedbackStatusSelect } from '@/components/feedback/feedback-status-select'
import { DeleteFeedbackButton } from '@/components/feedback/delete-feedback-button'
import { formatDate } from '@/lib/utils'

interface FeedbackPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectFeedbackPage({ params }: FeedbackPageProps) {
  const { id } = await params
  const { data: project, error: pError } = await getProject(id)

  if (pError || !project) {
    notFound()
  }

  const { data: feedbackItems = [], error: fError } = await getFeedbackItems(id)

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
            <span className="text-slate-600 font-medium">Feedback & Roadmap</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Roadmap & Suggestions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualisez les idées soumises par vos clients, gérez leur avancement et priorisez selon les votes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{feedbackItems.length} suggestion(s) enregistrée(s)</span>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-xs text-indigo-950 space-y-0.5">
          <span className="font-semibold">Comment ça fonctionne ?</span>
          <p className="text-indigo-800/90 leading-relaxed">
            Vos utilisateurs peuvent soumettre des propositions et voter anonymement directement depuis le widget PingLog intégré sur votre site. En tant qu&apos;administrateur, vous pouvez faire évoluer leur statut pour tenir votre communauté informée de votre roadmap.
          </p>
        </div>
      </div>

      {fError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
          Erreur: {fError}
        </div>
      )}

      {/* Feedback List */}
      {feedbackItems.length === 0 ? (
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Aucune idée soumise</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Dès que le widget PingLog sera intégré à votre produit, les suggestions et votes de vos visiteurs apparaîtront ici automatiquement.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbackItems.map((item) => (
            <Card key={item.id} className="hover:border-slate-300 transition-colors shadow-xs">
              <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                {/* Vote Counter Pill */}
                <div className="flex flex-col items-center justify-center min-w-[50px] py-2 px-1.5 rounded-xl border border-slate-200 bg-slate-50 shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-slate-600 mb-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-sm font-bold tracking-tight text-slate-900">
                    {item.votes_count || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    votes
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                      {item.title}
                    </h2>
                  </div>

                  {item.description ? (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Aucune description fournie.</p>
                  )}

                  <div className="pt-2 text-[11px] text-slate-400">
                    Proposé le {formatDate(item.created_at)}
                  </div>
                </div>

                {/* Status Dropdown & Actions */}
                <div className="flex items-center gap-2 shrink-0 self-center">
                  <FeedbackStatusSelect
                    id={item.id}
                    projectId={project.id}
                    currentStatus={item.status}
                  />
                  <DeleteFeedbackButton
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
