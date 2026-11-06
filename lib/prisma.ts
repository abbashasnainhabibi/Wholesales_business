import { PrismaClient } from '@prisma/client'

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL
    if (!url.includes('connection_limit=')) {
      const sep = url.includes('?') ? '&' : '?'
      return `${url}${sep}connection_limit=5&pool_timeout=10`
    }
    return url
  }
  const host = process.env.DB_HOST || 'localhost'
  const port = process.env.DB_PORT || '3306'
  const user = process.env.DB_USER || 'root'
  const pass = process.env.DB_PASSWORD || ''
  const name = process.env.DB_NAME || 'habibi_crm'
  const encodedPass = pass ? encodeURIComponent(pass) : ''
  return `mysql://${encodeURIComponent(user)}:${encodedPass}@${host}:${port}/${name}?connection_limit=5&pool_timeout=10`
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: getDatabaseUrl()
})
globalForPrisma.prisma = prisma

