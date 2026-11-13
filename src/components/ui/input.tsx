'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-slate-700 mb-1.5 block"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full border rounded-lg px-3 py-2 text-sm bg-white',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2',
            'focus:ring-indigo-500 focus:border-transparent transition',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-slate-200',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
