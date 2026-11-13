'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({
  text,
  label,
  className,
  size = 'sm',
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <svg
            className="w-3.5 h-3.5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-700">Copié !</span>
        </>
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{label || 'Copier'}</span>
        </>
      )}
    </Button>
  )
}

