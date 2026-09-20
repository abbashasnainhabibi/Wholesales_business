'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/admin/auth-provider'
import { useTheme } from '@/components/admin/theme-provider'

export default function LoginPage() {
  const router = useRouter()
  const { user, checking, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [lockSeconds, setLockSeconds] = useState(0)

  useEffect(() => {
    if (!lockedUntil) return
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000))
      setLockSeconds(remaining)
      if (!remaining) setLockedUntil(null)
    }, 250)
    return () => window.clearInterval(timer)
  }, [lockedUntil])

  useEffect(() => {
    if (!checking && user) {
      router.replace('/ts-portal')
    }
  }, [checking, user, router])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (lockedUntil && lockedUntil > Date.now()) return
    setLoading(true)
    try {
      const ok = await login(email, password, remember)
      setLoading(false)
      if (!ok) {
        setError('Invalid username or password.')
        return
      }
      router.replace('/ts-portal')
    } catch (error) {
      setLoading(false)
      setError(error instanceof Error ? error.message : 'Unable to sign in.')
    }
  }

  if (user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 p-4">
        <div className="flex items-center gap-3 text-sm font-semibold bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black">T</span>
          <span>Redirecting to Tahira Syndicate Portal...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black text-white shadow-xl shadow-indigo-600/20 ring-4 ring-indigo-50">
            T
          </div>
          <h1 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Tahira Syndicate Portal
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs">
            Direct database access for catalog, categories, company settings and reviews
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          <form onSubmit={submit} className="flex flex-col gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-xs sm:text-sm font-bold text-slate-700">
                Username / Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="login-username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin@tahirasyndicate.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 text-xs sm:text-sm text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2 placeholder:text-slate-400 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs sm:text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2 placeholder:text-slate-400 shadow-2xs"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>
              <span className="text-slate-400 text-[11px]">Authorized Access Only</span>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2"
              >
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 shadow-xs"
            >
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Log into Portal</span>
              )}
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-[11px] text-slate-400 font-medium">
          Tahira Syndicate Industrial B2B Management Suite • Direct DB Sync
        </p>
      </div>
    </main>
  )
}
