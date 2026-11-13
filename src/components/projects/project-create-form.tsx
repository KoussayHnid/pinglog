'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#0ea5e9', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#18181b', // Zinc
]

export function ProjectCreateForm({
  isPro = false,
  disabled = false,
}: {
  isPro?: boolean
  disabled?: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [domain, setDomain] = React.useState('')
  const [accentColor, setAccentColor] = React.useState('#4f46e5')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Veuillez entrer un nom de projet')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('domain', domain)
    formData.append('accent_color', accentColor)

    const result = await createProject(formData)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setOpen(false)
      setName('')
      setDomain('')
      setAccentColor('#4f46e5')
      router.push(`/dashboard/projects/${result.data.id}`)
      router.refresh()
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 shadow-xs"
        disabled={disabled}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nouveau projet</span>
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Créer un nouveau projet"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du projet"
            placeholder="ex: Mon Application SaaS"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Domaine (optionnel)"
            placeholder="ex: app.monsaas.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            hint="Permet de préconfigurer le domaine de votre widget."
          />

          {isPro ? (
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                Couleur principale du widget
              </label>
              <div className="flex items-center gap-2 flex-wrap mb-2">
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
                <div className="flex items-center gap-1.5 ml-2 border border-slate-200 rounded-lg px-2 py-1">
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

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Créer le projet
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
