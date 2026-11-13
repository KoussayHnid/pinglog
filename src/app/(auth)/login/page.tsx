'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/ui/logo'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (isSignUp) {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      setLoading(false)
      if (err) {
        setError(err.message)
      } else if (data.session) {
        router.push('/dashboard/projects')
        router.refresh()
      } else {
        setMessage('Vérifiez votre boîte mail pour confirmer votre inscription.')
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setLoading(false)
      if (err) {
        setError(err.message)
      } else {
        router.push('/dashboard/projects')
        router.refresh()
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-1">
          <Logo className="mb-2" iconClassName="size-10" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {isSignUp ? 'Créer un compte PingLog' : 'Connexion à PingLog'}
          </h1>
          <p className="text-xs text-slate-500">
            Gérez votre changelog et vos feedbacks utilisateurs
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs rounded-lg px-4 py-2 text-xs font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.0 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.316 0-9.828-3.418-11.421-8.168l-6.515 5.021C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            Continuer avec Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="w-full flex items-center justify-center gap-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs rounded-lg px-4 py-2 text-xs font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continuer avec GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-2 text-[11px] text-slate-400 absolute">ou email</span>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          <Input
            label="Email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {isSignUp ? 'Créer mon compte' : 'Se connecter'}
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
            }}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
          >
            {isSignUp
              ? 'Déjà un compte ? Se connecter'
              : 'Pas encore de compte ? S’inscrire'}
          </button>
        </div>
      </div>
    </div>
  )
}
