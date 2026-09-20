import type { Metadata } from 'next'
import { AuthProvider } from '@/components/admin/auth-provider'
import { ThemeProvider } from '@/components/admin/theme-provider'

export const metadata: Metadata = {
  title: 'Tahira Syndicate Portal',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
