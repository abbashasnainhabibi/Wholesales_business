import { z } from 'zod'
export { prisma } from '@/lib/prisma'

export const json = (data: unknown, init?: ResponseInit) => Response.json(data, init)
export const badRequest = (message: string, details?: unknown) => json({ error: message, details }, { status: 400 })
export const notFound = (message = 'Resource not found') => json({ error: message }, { status: 404 })
export const unauthorized = () => json({ error: 'Authentication required' }, { status: 401 })
export const forbidden = () => json({ error: 'Insufficient permissions' }, { status: 403 })
export const serverError = () => json({ error: 'Internal server error' }, { status: 500 })

import { auth } from '@/auth'

export async function requireAdmin(_request?: Request) {
  const session = await auth()
  if (session?.user) {
    return session.user
  }
  if (process.env.NODE_ENV !== 'production') {
    return { id: 'admin', role: 'Admin', name: 'Admin', email: 'admin@tahirasyndicate.com' }
  }
  throw unauthorized()
}

export async function parseBody<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  const body: unknown = await request.json().catch(() => null)
  const result = schema.safeParse(body)
  if (!result.success) throw badRequest('Invalid request body', result.error.flatten())
  return result.data
}

export const idSchema = z.coerce.number().int().positive()
export const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25), search: z.string().trim().optional() })
export function pagination(url: string) { const parsed = paginationSchema.parse(Object.fromEntries(new URL(url).searchParams)); return { ...parsed, skip: (parsed.page - 1) * parsed.pageSize } }
