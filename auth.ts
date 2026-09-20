import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 60 * 60 }, // Exactly 1 hour session lifetime
  pages: { signIn: '/ts-portal/login' },

  providers: [Credentials({
    credentials: { email: {}, password: {} },
    async authorize(credentials, request) {
      const input = String(credentials?.email ?? '').trim().toLowerCase()
      const password = String(credentials?.password ?? '')
      
      let ip = '127.0.0.1'
      try {
        if (request?.headers && typeof (request.headers as any).get === 'function') {
          ip = (request.headers as any).get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
        }
      } catch {}

      const since = new Date(Date.now() - 15 * 60 * 1000)
      const failures = await prisma.loginAttempt.count({ where: { OR: [{ email: input }, { ipAddress: ip }], failedAt: { gte: since } } })
      if (failures >= 15) throw new Error('Too many failed attempts. Try again in 15 minutes.')
      
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: input },
            { name: input },
            { email: `${input}@tahirasyndicate.com` },
            { email: `${input}@gmail.com` },
          ],
        },
      })
      if (!user) {
        throw new Error('User not found.')
      }

      // Enforce strict bcrypt hash verification
      let isMatch = false
      if (user.passwordHash && (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2y$') || user.passwordHash.startsWith('$2'))) {
        try {
          isMatch = await bcrypt.compare(password, user.passwordHash)
        } catch {
          isMatch = false
        }
      }

      if (!isMatch) {
        try {
          await prisma.loginAttempt.create({ data: { email: input, ipAddress: ip, userId: user.id } })
        } catch {}
        throw new Error('Invalid password.')
      }
      return { id: user.id, name: user.name ?? 'Admin', email: user.email, role: user.role }
    },
  })],

  callbacks: { async jwt({ token, user }) { if (user) { token.id = user.id; token.role = user.role } return token }, async session({ session, token }) { if (session.user) { session.user.id = String(token.id ?? ''); session.user.role = String(token.role ?? 'User') } return session } },
})

declare module 'next-auth' { interface Session { user: { id: string; role: string; name?: string | null; email?: string | null; image?: string | null } } interface User { role?: string } }
