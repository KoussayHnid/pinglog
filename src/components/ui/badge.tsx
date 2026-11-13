import * as React from 'react'
import { cn } from '@/lib/utils'

const variantMap: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700 border border-blue-200',
  Improvement: 'bg-violet-50 text-violet-700 border border-violet-200',
  Fix: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Under Review': 'bg-amber-50 text-amber-700 border border-amber-200',
  Planned: 'bg-orange-50 text-orange-700 border border-orange-200',
  'In Progress': 'bg-sky-50 text-sky-700 border border-sky-200',
  Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

interface BadgeProps {
  variant?: string
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  const variantClass =
    variant && variantMap[variant]
      ? variantMap[variant]
      : 'bg-slate-100 text-slate-600'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClass,
        className
      )}
    >
      {children}
    </span>
  )
}
