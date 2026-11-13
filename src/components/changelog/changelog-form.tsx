'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createChangelog } from '@/app/actions/changelog'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Category } from '@/types/database'

interface ChangelogFormProps {
  projectId: string
  disabled?: boolean
}

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'New', label: 'Nouveau', icon: '✨' },
  { value: 'Improvement', label: 'Amélioration', icon: '⚡' },
  { value: 'Fix', label: 'Correction', icon: '🐛' },
]

export function ChangelogForm({ projectId, disabled = false }: ChangelogFormProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [category, setCategory] = React.useState<Category>('New')
  const [content, setContent] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Le titre est obligatoire.')
      return
    }

    if (!content.trim()) {
      setError('La description est obligatoire.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('project_id', projectId)
    formData.append('title', title)
    formData.append('category', category)
    formData.append('content', content)

    const res = await createChangelog(formData)
    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      setOpen(false)
      setTitle('')
      setContent('')
      setCategory('New')
      router.refresh()
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-1.5 shadow-xs" disabled={disabled}>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>{disabled ? 'Limite Free atteinte' : 'Publier une mise à jour'}</span>
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Publier une entrée Changelog"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre de la mise à jour"
            placeholder="ex: Lancement du mode sombre et refonte des exports CSV"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div>
            <Select
              label="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label} ({cat.value})
                </option>
              ))}
            </Select>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Aperçu du badge :</span>
              <Badge variant={category}>{category}</Badge>
            </div>
          </div>

          <Textarea
            label="Détails / Description (Markdown / Texte)"
            placeholder="Expliquez ce qui a changé, les bénéfices pour vos utilisateurs..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

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
              Publier maintenant
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
