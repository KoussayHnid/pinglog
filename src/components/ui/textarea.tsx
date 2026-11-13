import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white',
            'placeholder:text-slate-400 min-h-[80px] resize-y',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'transition-colors',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
