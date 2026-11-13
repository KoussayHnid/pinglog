import Link from 'next/link'

interface LogoProps {
  className?: string
  iconClassName?: string
  href?: string
}

export function Logo({
  className = '',
  iconClassName = 'size-8',
  href = '/',
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="PingLog home"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <svg
        aria-hidden="true"
        className={`${iconClassName} shrink-0 text-indigo-600`}
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle cx="14" cy="15" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="15" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="15" r="1.5" fill="currentColor" />
        <path
          d="M14 5v4m10 6h-4M7 22l2.8-2.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 20h7a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2l-3 2v-2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="21.5" cy="23.5" r=".8" fill="currentColor" />
        <circle cx="24" cy="23.5" r=".8" fill="currentColor" />
        <circle cx="26.5" cy="23.5" r=".8" fill="currentColor" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        PingLog
      </span>
    </Link>
  )
}
