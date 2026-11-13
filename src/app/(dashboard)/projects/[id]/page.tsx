import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/app/actions/projects'
import { getChangelogs } from '@/app/actions/changelog'
import { getFeedbackItems } from '@/app/actions/feedback'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/ui/copy-button'
import { ProjectSettingsForm } from '@/components/projects/project-settings-form'
import { RegenerateApiKeyButton } from '@/components/projects/regenerate-api-key-button'
import { DeleteProjectButton } from '@/components/projects/delete-project-button'
import { getCurrentSubscription } from '@/app/actions/subscriptions'
import { headers } from 'next/headers'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectOverviewPage({ params }: ProjectPageProps) {
  const { id } = await params
  const { data: project, error } = await getProject(id)

  if (error || !project) {
    notFound()
  }

  const [{ data: changelogs = [] }, { data: feedbackItems = [] }, { data: subscription }] = await Promise.all([
    getChangelogs(id),
    getFeedbackItems(id),
    getCurrentSubscription(),
  ])
  const isPro = subscription?.plan === 'pro' && subscription.status === 'active'

  const totalVotes = feedbackItems.reduce((acc, curr) => acc + (curr.votes_count || 0), 0)

  const requestHeaders = await headers()
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL
  const forwardedHost = requestHeaders.get('x-forwarded-host')?.split(',')[0].trim()
  const host = forwardedHost || requestHeaders.get('host')
  const forwardedProtocol = requestHeaders.get('x-forwarded-proto')?.split(',')[0].trim()
  const protocol = forwardedProtocol || (host?.startsWith('localhost') ? 'http' : 'https')
  const appUrl = configuredAppUrl || (host ? `${protocol}://${host}` : null)
  const normalizedAppUrl = appUrl ? appUrl.replace(/\/+$/, '') : null
  const snippet = normalizedAppUrl
    ? `<script src="${normalizedAppUrl}/widget.js" data-key="${project.api_key}" async></script>`
    : 'Set NEXT_PUBLIC_APP_URL to generate your widget installation snippet.'

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/dashboard/projects" className="hover:text-slate-700 transition-colors">
              Projets
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">{project.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {project.name}
            </h1>
            <div
              className="w-3 h-3 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: isPro ? project.accent_color || '#4f46e5' : '#4f46e5' }}
              title={`Couleur d'accent: ${project.accent_color}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/dashboard/projects/${project.id}/changelog`}
          className="group block p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Entrées Changelog</span>
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {changelogs.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Mises à jour et versions publiées
          </div>
        </Link>

        <Link
          href={`/dashboard/projects/${project.id}/feedback`}
          className="group block p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Suggestions / Idées</span>
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {feedbackItems.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Retours et propositions soumises
          </div>
        </Link>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 mb-2">Total des votes</div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {totalVotes}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Votes cumulés de vos utilisateurs
          </div>
        </div>
      </div>

      {/* Snippet & API Key Section */}
      <Card className="border-indigo-100/80 shadow-xs">
        <CardHeader className="bg-indigo-50/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-indigo-950 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Snippet d&apos;intégration en 1 clic
              </CardTitle>
              <CardDescription>
                Copiez et collez ce script dans la balise &lt;head&gt; ou juste avant la fermeture de &lt;/body&gt; sur votre site.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {/* 1-click script snippet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-700">Code à intégrer</span>
              <CopyButton text={snippet} label="Copier le script" />
            </div>
            <div className="relative rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
              <code>{snippet}</code>
            </div>
          </div>

          {/* API Key Details */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-700">Clé API Publique (X-Api-Key)</div>
              <div className="text-[11px] text-slate-400">
                Identifiant unique utilisé par le widget pour charger les changelogs et enregistrer les votes.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 select-all">
                {project.api_key}
              </span>
              <CopyButton text={project.api_key} label="Copier" />
              <RegenerateApiKeyButton projectId={project.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du projet</CardTitle>
          <CardDescription>
            Modifiez le nom, le domaine associé ou la couleur principale du thème.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectSettingsForm project={project} isPro={isPro} />
        </CardContent>
      </Card>
    </div>
  )
}
