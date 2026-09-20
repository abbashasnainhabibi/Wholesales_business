import { prisma, json, pagination, parseBody, requireAdmin, notFound } from '@/lib/api'
import { z } from 'zod'

import { promises as fs } from 'fs'
import path from 'path'
import { getCrmUploadsDir, getFrontendUploadsDir } from '@/lib/utils'

export async function sanitizeImagePayload(image?: string | null): Promise<string | null> {
  if (!image) return null
  if (!image.startsWith('data:image/')) return image

  try {
    const match = image.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/)
    if (!match) return null
    const subtype = match[1].toLowerCase()
    const ext = subtype.includes('svg') ? '.svg' : subtype.includes('png') ? '.png' : subtype.includes('webp') ? '.webp' : '.jpg'
    const buffer = Buffer.from(match[2], 'base64')

    const uniqueName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const crmUploadDir = getCrmUploadsDir()
    await fs.mkdir(crmUploadDir, { recursive: true })
    await fs.writeFile(path.join(crmUploadDir, uniqueName), buffer)

    try {
      const frontendUploadDir = getFrontendUploadsDir()
      if (frontendUploadDir) {
        await fs.mkdir(frontendUploadDir, { recursive: true })
        await fs.writeFile(path.join(frontendUploadDir, uniqueName), buffer)
      }
    } catch {
      // Ignore
    }

    return `/uploads/${uniqueName}`
  } catch (err) {
    console.error('Failed to convert base64 image:', err)
    return null
  }
}


export const catalogBody = z.object({
  name: z.string().min(1).max(180),
  slug: z.string().min(1).max(180).optional(),
  image: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  status: z.enum(['Active', 'Draft']).optional(),
  attributeIds: z.array(z.coerce.number()).optional(),
  type: z.string().optional(),
  options: z.any().optional(),
  required: z.boolean().optional(),
  id: z.any().optional(),
})

export const catalogPatch = catalogBody.partial().refine(value => Object.keys(value).length > 0, 'At least one field is required')
type CatalogModel = 'category' | 'attribute'
type Delegate = {
  findMany: (args: unknown) => Promise<unknown>
  findFirst: (args: unknown) => Promise<unknown>
  findUnique: (args: unknown) => Promise<unknown>
  count: (args: unknown) => Promise<number>
  create: (args: unknown) => Promise<unknown>
  update: (args: unknown) => Promise<unknown>
  delete: (args: unknown) => Promise<unknown>
}
const delegate = (model: CatalogModel) => prisma[model] as unknown as Delegate

export async function listCatalog(request: Request, model: CatalogModel) {
  const { skip, pageSize, search } = pagination(request.url)
  const where = search ? { name: { contains: search } } : undefined
  const d = delegate(model)
  const include = model === 'category'
    ? { attributes: { include: { attribute: true } }, _count: { select: { products: true } } }
    : undefined
  const [data, total] = await Promise.all([
    d.findMany({ where, skip, take: pageSize, orderBy: { name: 'asc' }, include }),
    d.count({ where }),
  ])
  return json({ data, meta: { page: Math.floor(skip / pageSize) + 1, pageSize, total } })
}

export async function createCatalog(request: Request, model: CatalogModel) {
  await requireAdmin(request)
  const body = await parseBody(request, catalogBody)
  const { attributeIds, id: _id, origin: _origin, ...rest } = body

  if (model === 'category') {
    let targetSlug = (rest.slug || rest.name || 'category').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    if (!targetSlug) targetSlug = `cat-${Date.now()}`
    
    // Check for slug collision and auto-suffix if needed
    const existing = await prisma.category.findUnique({ where: { slug: targetSlug } })
    if (existing) {
      targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`
    }

    // Filter only valid attribute IDs that exist in MySQL
    let validAttributeIds: number[] = []
    if (attributeIds && attributeIds.length > 0) {
      const existingAttrs = await prisma.attribute.findMany({
        where: { id: { in: attributeIds.map(Number) } },
        select: { id: true }
      })
      validAttributeIds = existingAttrs.map(a => a.id)
    }

    const sanitizedImage = await sanitizeImagePayload(rest.image)
    const created = await prisma.category.create({
      data: {
        name: rest.name.trim(),
        slug: targetSlug,
        image: sanitizedImage,
        status: rest.status || 'Active',
        metaTitle: rest.metaTitle || rest.name,
        metaDescription: rest.metaDescription || '',
        description: rest.description || '',
        attributes: validAttributeIds.length > 0 ? {
          create: validAttributeIds.map(id => ({ attributeId: id }))
        } : undefined,
      },
      include: { attributes: { include: { attribute: true } } }
    })
    return json(created, { status: 201 })
  }

  if (model === 'attribute') {
    const options = Array.isArray(rest.options) ? rest.options : []
    const created = await prisma.attribute.create({
      data: {
        name: rest.name,
        type: (rest.type as any) || 'text',
        options,
        status: rest.status || 'Active',
        required: Boolean(rest.required),
      }
    })
    return json(created, { status: 201 })
  }

  return json(await delegate(model).create({ data: rest }), { status: 201 })
}

export async function getCatalog(request: Request, model: 'category', key: string) {
  const decoded = decodeURIComponent(key).trim()
  const numeric = /^\d+$/.test(decoded)
  const where = numeric ? { id: Number(decoded) } : { OR: [{ slug: decoded }, { slug: decoded.toLowerCase() }, { name: decoded }] }
  const include = { attributes: { include: { attribute: true } }, products: { include: { images: true } } }
  const record = await delegate(model).findFirst({ where, include })
  if (!record) return notFound(`${model} not found`)
  return json(record)
}

export async function updateCatalog(request: Request, model: CatalogModel, id: string) {
  await requireAdmin(request)
  const input = await parseBody(request, catalogPatch)
  const { attributeIds, id: _id, origin: _origin, ...rest } = input
  const numericId = Number(id)

  if (model === 'category') {
    if (attributeIds !== undefined) {
      await prisma.categoryAttribute.deleteMany({ where: { categoryId: numericId } })
      if (attributeIds.length > 0) {
        const existingAttrs = await prisma.attribute.findMany({
          where: { id: { in: attributeIds.map(Number) } },
          select: { id: true }
        })
        if (existingAttrs.length > 0) {
          await prisma.categoryAttribute.createMany({
            data: existingAttrs.map(a => ({ categoryId: numericId, attributeId: a.id }))
          })
        }
      }
    }
    const sanitizedImage = rest.image !== undefined ? await sanitizeImagePayload(rest.image) : undefined
    const updated = await prisma.category.update({
      where: { id: numericId },
      data: {
        ...(rest.name ? { name: rest.name } : {}),
        ...(rest.slug ? { slug: rest.slug } : {}),
        ...(sanitizedImage !== undefined ? { image: sanitizedImage } : {}),
        ...(rest.status ? { status: rest.status } : {}),
        ...(rest.metaTitle !== undefined ? { metaTitle: rest.metaTitle || '' } : {}),
        ...(rest.metaDescription !== undefined ? { metaDescription: rest.metaDescription || '' } : {}),
        ...(rest.description !== undefined ? { description: rest.description || '' } : {}),
      },
      include: { attributes: { include: { attribute: true } } }
    })
    return json(updated)
  }

  if (model === 'attribute') {
    const updated = await prisma.attribute.update({
      where: { id: numericId },
      data: {
        ...(rest.name ? { name: rest.name } : {}),
        ...(rest.type ? { type: rest.type as any } : {}),
        ...(rest.options !== undefined ? { options: Array.isArray(rest.options) ? rest.options : [] } : {}),
        ...(rest.status ? { status: rest.status } : {}),
        ...(rest.required !== undefined ? { required: Boolean(rest.required) } : {}),
      }
    })
    return json(updated)
  }

  return json(await delegate(model).update({ where: { id: numericId }, data: rest }))
}

// Helper to preserve category media by moving files to unused_media folder
async function preserveCategoryMedia(category: { slug: string; image?: string | null }) {
  if (!category.image || !category.image.startsWith('/uploads/')) return
  const categorySlug = category.slug || 'category'

  const crmTargetDir = path.join(process.cwd(), 'public', 'unused_media', 'categories', categorySlug)
  await fs.mkdir(crmTargetDir, { recursive: true }).catch(() => {})

  const relativePath = category.image.replace(/^\/+/, '')
  const fileName = path.basename(relativePath)

  // Move from CRM uploads to CRM unused_media
  const crmSource = path.join(process.cwd(), 'public', relativePath)
  try {
    await fs.access(crmSource)
    await fs.rename(crmSource, path.join(crmTargetDir, fileName)).catch(async () => {
      await fs.copyFile(crmSource, path.join(crmTargetDir, fileName))
      await fs.unlink(crmSource).catch(() => {})
    })
  } catch {}
}

export async function deleteCatalog(request: Request, model: CatalogModel, id: string) {
  await requireAdmin(request)
  const numericId = Number(id)
  
  if (model === 'category') {
    const category = await prisma.category.findUnique({
      where: { id: numericId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    if (!category) return notFound('Category not found')

    // 1. Guard against deleting categories that still have assigned products
    if (category._count.products > 0) {
      return json(
        {
          error: `Cannot delete category: ${category._count.products} product(s) are currently assigned to this category. Please reassign or delete the products first.`
        },
        { status: 400 }
      )
    }

    // 2. Preserve category media safely to unused_media directory
    await preserveCategoryMedia(category)

    // 3. Delete category attributes & category record from MySQL
    await prisma.categoryAttribute.deleteMany({ where: { categoryId: numericId } })
    const deleted = await prisma.category.delete({ where: { id: numericId } })
    return json(deleted)
  }

  if (model === 'attribute') {
    const [categoriesCount, valuesCount] = await Promise.all([
      prisma.categoryAttribute.count({ where: { attributeId: numericId } }),
      prisma.productAttributeValue.count({ where: { attributeId: numericId } }),
    ])
    const count = categoriesCount + valuesCount
    if (count > 0) {
      await prisma.categoryAttribute.deleteMany({ where: { attributeId: numericId } })
      await prisma.productAttributeValue.deleteMany({ where: { attributeId: numericId } })
    }
    const deleted = await prisma.attribute.delete({ where: { id: numericId } })
    return json(deleted)
  }

  return json(await delegate(model).delete({ where: { id: numericId } }))
}
