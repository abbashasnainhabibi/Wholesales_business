import { prisma, json, badRequest, serverError, pagination, parseBody, requireAdmin } from '@/lib/api'
import { z } from 'zod'

// Rate limiting in-memory store: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  
  if (validTimestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps)
    return true
  }

  validTimestamps.push(now)
  rateLimitMap.set(ip, validTimestamps)
  return false
}

// Zod validation schema
const reviewSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(180),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(1).max(3000),
  contact: z.string().trim().max(255).optional().nullable(),
  imageUrl: z.string().trim().max(1000).optional().nullable(),
  productId: z.coerce.number().int().optional().nullable(),
  serviceId: z.string().trim().max(100).optional().nullable(),
  // Anti-spam fields
  honeypot: z.string().optional().nullable(),
  clientTimestamp: z.coerce.number().optional().nullable(),
  turnstileToken: z.string().optional().nullable(),
})

const genericSpamError = 'Unable to process review submission'

async function verifyTurnstileToken(token?: string | null, clientIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return true // Bypass if secret key is not configured
  if (!token) return false

  try {
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', token)
    if (clientIp) {
      formData.append('remoteip', clientIp)
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const data = await response.json()
    return !!data.success
  } catch (err) {
    console.error('Error contacting Cloudflare Turnstile siteverify:', err)
    return true
  }
}

// GET /api/reviews - Public fetch or Admin listing
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const isAdminView = url.searchParams.get('admin') === 'true'
    const productIdParam = url.searchParams.get('productId')
    const serviceIdParam = url.searchParams.get('serviceId')
    const typeParam = url.searchParams.get('type') // 'general'
    const statusParam = url.searchParams.get('status') // 'All' | 'Pending' | 'Approved' | 'Rejected'
    const search = url.searchParams.get('search')?.trim()

    if (isAdminView) {
      // Must be authenticated mock/real admin
      await requireAdmin(request)
      const { skip, pageSize } = pagination(request.url)

      const where: any = {}
      if (statusParam && statusParam !== 'All') {
        where.status = statusParam
      }
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { message: { contains: search } },
          { contact: { contains: search } },
        ]
      }

      const [data, total, pendingCount] = await prisma.$transaction([
        prisma.review.findMany({
          where,
          skip,
          take: pageSize,
          include: { product: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({ where }),
        prisma.review.count({ where: { status: 'Pending' } }),
      ])

      return json({
        data,
        meta: {
          page: Math.floor(skip / pageSize) + 1,
          pageSize,
          total,
          pendingCount,
        },
      })
    }

    // Public view: ONLY Approved reviews are EVER returned
    const where: any = { status: 'Approved' }

    if (productIdParam) {
      where.productId = parseInt(productIdParam, 10)
    } else if (serviceIdParam) {
      where.serviceId = serviceIdParam
    } else if (typeParam === 'general') {
      where.productId = null
      where.serviceId = null
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        rating: true,
        message: true,
        imageUrl: true,
        productId: true,
        serviceId: true,
        createdAt: true,
      },
    })

    return json({ data: reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return error instanceof Response ? error : serverError()
  }
}

// POST /api/reviews - Public review submission with 4-layer defense
export async function POST(request: Request) {
  try {
    // 1. Determine client IP for Rate-Limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1')

    // Layer 1: Rate Limit check
    if (isRateLimited(clientIp)) {
      return json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse incoming payload
    const body = await parseBody(request, reviewSubmissionSchema)

    // Layer 2: Honeypot check
    if (body.honeypot && body.honeypot.trim().length > 0) {
      // Silent rejection - identical generic response
      return badRequest(genericSpamError)
    }

    // Layer 3: Timing check (must take at least 3 seconds)
    const now = Date.now()
    if (body.clientTimestamp && (now - body.clientTimestamp < 3000 || body.clientTimestamp > now + 60000)) {
      return badRequest(genericSpamError)
    }

    // Layer 4: Cloudflare Turnstile Verification
    const isHuman = await verifyTurnstileToken(body.turnstileToken, clientIp)
    if (!isHuman) {
      return badRequest(genericSpamError)
    }

    // Save strictly as Pending
    const newReview = await prisma.review.create({
      data: {
        name: body.name,
        rating: body.rating,
        message: body.message,
        contact: body.contact || null,
        imageUrl: body.imageUrl || null,
        productId: body.productId || null,
        serviceId: body.serviceId || null,
        status: 'Pending',
      },
    })

    return json(
      {
        success: true,
        message: 'Thank you! Your review has been received and will appear on the website shortly after verification.',
        reviewId: newReview.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error creating review:', error)
    return serverError()
  }
}
