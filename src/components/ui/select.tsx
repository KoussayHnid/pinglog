'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-slate-700 mb-1.5 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none border rounded-lg px-3 py-2 pr-9 text-sm bg-white',
              'placeholder:text-slate-400 focus:outline-none focus:ring-2',
              'focus:ring-indigo-500 focus:border-transparent transition',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-200',
              className
            )}
            {...props}
          >
            {children}
          </select>
          {/* Chevron icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
