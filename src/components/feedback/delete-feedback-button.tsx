'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { deleteFeedbackItem } from '@/app/actions/feedback'
import { Button } from '@/components/ui/button'

interface DeleteFeedbackButtonProps {
  id: string
  projectId: string
  title: string
}

export function DeleteFeedbackButton({
  id,
  projectId,
  title,
}: DeleteFeedbackButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Voulez-vous supprimer l'idée "${title}" et tous ses votes ?`
    )
    if (!confirmed) return

    setLoading(true)
    const res = await deleteFeedbackItem(id, projectId)
    setLoading(false)

    if (res.error) {
      alert(`Erreur: ${res.error}`)
    } else {
      router.refresh()
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      loading={loading}
      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 h-auto rounded-lg transition-colors"
      title="Supprimer cette idée"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </Button>
  )
}

