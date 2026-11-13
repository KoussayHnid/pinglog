'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { updateProject } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Project } from '@/types/database'

const PRESET_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#18181b',
]

interface ProjectSettingsFormProps {
  project: Project
  isPro?: boolean
}

export function ProjectSettingsForm({ project, isPro = false }: ProjectSettingsFormProps) {
  const router = useRouter()
  const [name, setName] = React.useState(project.name)
  const [domain, setDomain] = React.useState(project.domain || '')
  const [accentColor, setAccentColor] = React.useState(project.accent_color || '#4f46e5')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('domain', domain)
    formData.append('accent_color', accentColor)

    const res = await updateProject(project.id, formData)
    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nom du projet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Domaine du site"
          placeholder="ex: app.monsaas.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          hint="Utilisé pour générer l'URL exacte du widget."
        />
      </div>

      {isPro ? (
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1.5 block">
            Couleur d&apos;accent (thème du widget)
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-6 h-6 rounded-full transition-transform border ${
                  accentColor.toLowerCase() === color.toLowerCase()
                    ? 'scale-125 ring-2 ring-offset-2 ring-slate-800'
                    : 'hover:scale-110 border-black/10'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <div className="flex items-center gap-1.5 ml-2 border border-slate-200 rounded-lg px-2 py-1 bg-white">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-600 uppercase">
                {accentColor}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          La personnalisation des couleurs est disponible avec le plan Pro.
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <div>
          {success && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Modifications enregistrées !
            </span>
          )}
          {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        </div>
        <Button type="submit" size="sm" loading={loading}>
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  )
}
