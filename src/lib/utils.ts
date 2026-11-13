import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a date to a human-readable string (FR locale by default) */
export function formatDate(date: string | Date, locale = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/** Category badge colour mapping */
export const CATEGORY_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  Improvement: 'bg-purple-100 text-purple-800',
  Fix: 'bg-green-100 text-green-800',
} as const

/** Feedback status badge colour mapping */
export const STATUS_COLORS = {
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Planned: 'bg-orange-100 text-orange-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
} as const

/**
 * Generate a lightweight browser fingerprint for anonymous vote deduplication.
 * NOT suitable for security purposes; only used to prevent accidental double-votes.
 */
export async function getVoterFingerprint(): Promise<string> {
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|')

  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(raw)
  )
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

