import { prisma, json, badRequest, notFound, serverError, parseBody, requireAdmin } from '@/lib/api'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'

const updateReviewSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  name: z.string().trim().min(1).max(180).optional(),
  message: z.string().trim().min(1).max(3000).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const reviewId = parseInt(id, 10)
    if (isNaN(reviewId)) return badRequest('Invalid review id')

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: { select: { id: true, name: true } } },
    })

    if (!review) return notFound('Review not found')
    return json(review)
  } catch (error) {
    return error instanceof Response ? error : serverError()
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const reviewId = parseInt(id, 10)
    if (isNaN(reviewId)) return badRequest('Invalid review id')

    const body = await parseBody(request, updateReviewSchema)

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: body,
      include: { product: { select: { id: true, name: true } } },
    })

    return json(updated)
  } catch (error) {
    return error instanceof Response ? error : serverError()
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const reviewId = parseInt(id, 10)
    if (isNaN(reviewId)) return badRequest('Invalid review id')

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) return notFound('Review not found')

    // Archive review image to unused_media/reviews
    if (review.imageUrl && review.imageUrl.startsWith('/uploads/')) {
      const relativePath = review.imageUrl.replace(/^\/+/, '')
      const fileName = path.basename(relativePath)
      const targetDir = path.join(process.cwd(), 'public', 'unused_media', 'reviews')
      await fs.mkdir(targetDir, { recursive: true }).catch(() => {})

      const srcPath = path.join(process.cwd(), 'public', relativePath)
      try {
        await fs.access(srcPath)
        await fs.rename(srcPath, path.join(targetDir, fileName)).catch(async () => {
          await fs.copyFile(srcPath, path.join(targetDir, fileName))
          await fs.unlink(srcPath).catch(() => {})
        })
      } catch {}
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return json({ success: true, message: 'Review deleted successfully' })
  } catch (error) {
    return error instanceof Response ? error : serverError()
  }
}
