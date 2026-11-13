'use client'

import * as React from 'react'
import { deleteProject } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    const confirmation = window.confirm(
      `Êtes-vous certain de vouloir supprimer le projet "${projectName}" ? Tous les changelogs, feedbacks et votes associés seront définitivement effacés.`
    )
    if (!confirmation) return

    setLoading(true)
    await deleteProject(projectId)
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      loading={loading}
      className="text-xs"
    >
      <svg
        className="w-3.5 h-3.5"
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
      <span>Supprimer le projet</span>
    </Button>
  )
}

