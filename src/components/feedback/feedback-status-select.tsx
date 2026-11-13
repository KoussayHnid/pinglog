'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { updateFeedbackStatus } from '@/app/actions/feedback'
import type { FeedbackStatus } from '@/types/database'

const STATUSES: { value: FeedbackStatus; label: string }[] = [
  { value: 'Under Review', label: 'En revue' },
  { value: 'Planned', label: 'Planifié' },
  { value: 'In Progress', label: 'En cours' },
  { value: 'Completed', label: 'Terminé' },
]

interface FeedbackStatusSelectProps {
  id: string
  projectId: string
  currentStatus: FeedbackStatus
}

export function FeedbackStatusSelect({
  id,
  projectId,
  currentStatus,
}: FeedbackStatusSelectProps) {
  const router = useRouter()
  const [status, setStatus] = React.useState<FeedbackStatus>(currentStatus)
  const [loading, setLoading] = React.useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as FeedbackStatus
    setStatus(newStatus)
    setLoading(true)

    const res = await updateFeedbackStatus(id, projectId, newStatus)
    setLoading(false)

    if (res.error) {
      alert(`Erreur: ${res.error}`)
      setStatus(currentStatus)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          status === 'Completed'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : status === 'In Progress'
            ? 'bg-sky-50 text-sky-700 border-sky-200'
            : status === 'Planned'
            ? 'bg-orange-50 text-orange-700 border-orange-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        } ${loading ? 'opacity-60 cursor-wait' : ''}`}
      >
        {STATUSES.map((st) => (
          <option key={st.value} value={st.value}>
            {st.label} ({st.value})
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-70">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  )
}

