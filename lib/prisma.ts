import { PrismaClient } from '@prisma/client'

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  const host = process.env.DB_HOST || 'localhost'
  const port = process.env.DB_PORT || '3306'
  const user = process.env.DB_USER || 'root'
  const pass = process.env.DB_PASSWORD || ''
  const name = process.env.DB_NAME || 'habibi_crm'
  const encodedPass = pass ? encodeURIComponent(pass) : ''
  return `mysql://${encodeURIComponent(user)}:${encodedPass}@${host}:${port}/${name}`
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: getDatabaseUrl()
})
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

