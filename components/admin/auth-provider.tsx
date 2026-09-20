'use client'

import { createContext, useContext, useMemo } from 'react'
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type User = { name: string; email: string; initials: string; id?: string; role?: string }
type AuthContextValue = {
  user: User | null
  checking: boolean
  login: (email: string, password: string, remember: boolean) => Promise<boolean>
  logout: () => void
}
const AuthContext = createContext<AuthContextValue | null>(null)

function AuthBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? 'Admin',
        email: session.user.email ?? '',
        role: session.user.role,
        initials: (session.user.name ?? session.user.email ?? 'A')
          .split(' ')
          .map((part: string) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      }
    : null

  const checking = status === 'loading'

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      checking,
      login: async (email, password) => {
        try {
          const result = await signIn('credentials', {
            email: email.trim(),
            password,
            redirect: false,
            callbackUrl: '/ts-portal'
          })
          if (result?.error) {
            return false
          }
          return true
        } catch (err) {
          console.error('Login error:', err)
          return false
        }
      },
      logout: async () => {
        try {
          await signOut({ redirect: false })
        } catch {}
        window.location.href = '/ts-portal/login'
      },
    }),

    [user, checking]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <AuthBridge>{children}</AuthBridge>
    </SessionProvider>
  )
}


export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

export function AuthSplash() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-xs text-muted-foreground">Loading Tahira Syndicate Management Portal...</p>
    </main>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, checking } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!checking && !user) {
      router.replace('/ts-portal/login')
    }
  }, [checking, user, router])

  if (checking || !user) return <AuthSplash />
  return <>{children}</>
}

