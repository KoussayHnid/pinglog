'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { regenerateApiKey } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'

interface RegenerateApiKeyButtonProps {
  projectId: string
}

export function RegenerateApiKeyButton({ projectId }: RegenerateApiKeyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir régénérer votre clé API ? Les widgets actuellement déployés utilisant l\'ancienne clé cesseront immédiatement de fonctionner.'
    )
    if (!confirmed) return

    setLoading(true)
    const res = await regenerateApiKey(projectId)
    setLoading(false)

    if (res.error) {
      alert(`Erreur: ${res.error}`)
    } else {
      router.refresh()
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRegenerate}
      loading={loading}
      className="text-xs"
    >
      <svg
        className="w-3.5 h-3.5 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>Régénérer</span>
    </Button>
  )
}

