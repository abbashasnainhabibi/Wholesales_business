import { prisma, json, idSchema, parseBody, requireAdmin, notFound } from '@/lib/api'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import { getFrontendPublicDir } from '@/lib/utils'
import { sanitizeImagePayload } from '@/app/api/catalog-routes'


const patch = z.record(z.string(), z.unknown())

// Helper to preserve images by moving them to unused_media folder
async function preserveProductMedia(product: {
  slug: string
  category?: { slug: string } | null
  images: { src: string }[]
}) {
  const categorySlug = product.category?.slug || 'uncategorized'
  const productSlug = product.slug || 'product'

  const crmTargetDir = path.join(process.cwd(), 'public', 'unused_media', 'products', categorySlug, productSlug)
  await fs.mkdir(crmTargetDir, { recursive: true }).catch(() => {})

  for (const img of product.images) {
    if (!img.src || !img.src.startsWith('/uploads/')) continue
    const relativePath = img.src.replace(/^\/+/, '') // e.g. "uploads/products/nets/safety-net/..."
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
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numeric = /^\d+$/.test(id)
    const where = numeric ? { id: Number(id) } : { slug: id }
    const item = await prisma.product.findFirst({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        faqs: { orderBy: { sortOrder: 'asc' } },
        attributeValues: { include: { attribute: true } },
      },
    })
    return item ? json(item) : notFound('Product not found')
  } catch (error) {
    return error instanceof Response ? error : json({ error: 'Unable to read product' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const numericId = idSchema.parse(id)
    const body = await parseBody(request, patch)

    const {
      name,
      sku,
      categoryId,
      brandId,
      price,
      availability,
      status,
      seoStatus,
      metaTitle,
      metaDescription,
      slug,
      barcode,
      moq,
      bulkPricing,
      weight,
      length,
      width,
      height,
      countryOfOrigin,
      relatedProductIds,
      ogTitle,
      ogDescription,
      ogImage,
      shortDescription,
      longDescription,
      tradeAliases,
      usage,
      benefits,
      suitedFor,
      notSuitedFor,
      images,
      faqs,
      attributeValues,
      content,
    } = body as any

    // Prepare direct updates
    const dataToUpdate: any = {}
    if (name !== undefined) dataToUpdate.name = String(name)
    if (sku !== undefined) dataToUpdate.sku = String(sku)
    if (categoryId !== undefined) dataToUpdate.categoryId = Number(categoryId)
    if (price !== undefined) dataToUpdate.price = Number(price) || 0
    if (availability !== undefined) {
      dataToUpdate.availability = availability === 'Out of Stock' || availability === 'OutOfStock' ? 'OutOfStock' : 'InStock'
    }
    if (status !== undefined) dataToUpdate.status = status === 'Active' ? 'Active' : 'Draft'
    if (seoStatus !== undefined) dataToUpdate.seoStatus = seoStatus === 'Complete' ? 'Complete' : 'NeedsReview'
    if (metaTitle !== undefined) dataToUpdate.metaTitle = String(metaTitle || '')
    if (metaDescription !== undefined) dataToUpdate.metaDescription = String(metaDescription || '')
    if (slug !== undefined) dataToUpdate.slug = String(slug || '')
    if (barcode !== undefined) dataToUpdate.barcode = barcode ? String(barcode) : null
    if (moq !== undefined) dataToUpdate.moq = Number(moq) || 1
    if (shortDescription !== undefined) dataToUpdate.shortDescription = String(shortDescription || '')
    if (longDescription !== undefined) dataToUpdate.longDescription = longDescription ? String(longDescription) : null
    if (tradeAliases !== undefined) dataToUpdate.tradeAliases = tradeAliases ? String(tradeAliases) : null
    if (bulkPricing !== undefined) dataToUpdate.bulkPricing = Array.isArray(bulkPricing) ? bulkPricing : []
    if (weight !== undefined) dataToUpdate.weight = weight !== null && weight !== '' ? Number(weight) : null
    if (length !== undefined) dataToUpdate.length = length !== null && length !== '' ? Number(length) : null
    if (width !== undefined) dataToUpdate.width = width !== null && width !== '' ? Number(width) : null
    if (height !== undefined) dataToUpdate.height = height !== null && height !== '' ? Number(height) : null
    if (countryOfOrigin !== undefined) dataToUpdate.countryOfOrigin = countryOfOrigin ? String(countryOfOrigin) : null
    if (relatedProductIds !== undefined) dataToUpdate.relatedProductIds = Array.isArray(relatedProductIds) ? relatedProductIds : []
    if (ogTitle !== undefined) dataToUpdate.ogTitle = ogTitle ? String(ogTitle) : null
    if (ogDescription !== undefined) dataToUpdate.ogDescription = ogDescription ? String(ogDescription) : null
    if (ogImage !== undefined) dataToUpdate.ogImage = ogImage ? String(ogImage) : null

    // Handle content object fallback or direct fields
    const contentObj = typeof content === 'object' && content !== null ? content : {}
    if (usage !== undefined || contentObj.usage !== undefined) {
      dataToUpdate.usage = String(usage !== undefined ? usage : contentObj.usage || '')
    }
    if (benefits !== undefined || contentObj.benefits !== undefined) {
      dataToUpdate.benefits = Array.isArray(benefits) ? benefits : Array.isArray(contentObj.benefits) ? contentObj.benefits : []
    }
    if (suitedFor !== undefined || contentObj.suitedFor !== undefined) {
      dataToUpdate.suitedFor = Array.isArray(suitedFor) ? suitedFor : Array.isArray(contentObj.suitedFor) ? contentObj.suitedFor : []
    }
    if (notSuitedFor !== undefined || contentObj.notSuitedFor !== undefined) {
      dataToUpdate.notSuitedFor = Array.isArray(notSuitedFor) ? notSuitedFor : Array.isArray(contentObj.notSuitedFor) ? contentObj.notSuitedFor : []
    }

    // Run in transaction for relational updates
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update direct product scalar fields
      await tx.product.update({
        where: { id: numericId },
        data: dataToUpdate,
      })

    // 2. Update images if provided
      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: numericId } })
        if (images.length > 0) {
          const sanitizedImages: { productId: number; src: string; alt: string; sortOrder: number }[] = []
          for (let idx = 0; idx < images.length; idx++) {
            const img = images[idx]
            if (!img || !img.src) continue
            let imgSrc = String(img.src).trim()
            if (imgSrc.startsWith('data:image/')) {
              const converted = await sanitizeImagePayload(imgSrc)
              if (!converted) continue
              imgSrc = converted
            }
            sanitizedImages.push({
              productId: numericId,
              src: imgSrc,
              alt: String(img.alt || name || ''),
              sortOrder: typeof img.sortOrder === 'number' ? img.sortOrder : idx,
            })
          }

          if (sanitizedImages.length > 0) {
            await tx.productImage.createMany({
              data: sanitizedImages,
            })
          }
        }
      }


      // 3. Update FAQs if provided (or in content.faqs)
      const targetFaqs = Array.isArray(faqs) ? faqs : Array.isArray(contentObj.faqs) ? contentObj.faqs : null
      if (targetFaqs !== null) {
        await tx.productFaq.deleteMany({ where: { productId: numericId } })
        const validFaqs = targetFaqs.filter((f: any) => f && (f.question || f.answer))
        if (validFaqs.length > 0) {
          await tx.productFaq.createMany({
            data: validFaqs.map((f: any, idx: number) => ({
              productId: numericId,
              question: String(f.question || ''),
              answer: String(f.answer || ''),
              sortOrder: typeof f.sortOrder === 'number' ? f.sortOrder : idx,
            })),
          })
        }
      }

      // 4. Update attribute values if provided (or in content.attributeValues)
      const targetAttrValues = Array.isArray(attributeValues)
        ? attributeValues
        : typeof contentObj.attributeValues === 'object' && contentObj.attributeValues !== null
        ? Object.entries(contentObj.attributeValues).map(([attrId, val]) => ({ attributeId: Number(attrId), value: String(val) }))
        : null

      if (targetAttrValues !== null) {
        await tx.productAttributeValue.deleteMany({ where: { productId: numericId } })
        const validAttrs = targetAttrValues.filter((av: any) => av && av.attributeId && av.value)
        if (validAttrs.length > 0) {
          await tx.productAttributeValue.createMany({
            data: validAttrs.map((av: any) => ({
              productId: numericId,
              attributeId: Number(av.attributeId),
              value: String(av.value),
            })),
          })
        }
      }

      return tx.product.findUnique({
        where: { id: numericId },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          faqs: { orderBy: { sortOrder: 'asc' } },
          attributeValues: { include: { attribute: true } },
        },
      })
    })

    return json(updated)
  } catch (error: any) {
    console.error('PUT /api/products/[id] error:', error)
    return error instanceof Response ? error : json({ error: error?.message || 'Unable to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const numericId = idSchema.parse(id)

    // Find product with images and category before deleting
    const product = await prisma.product.findUnique({
      where: { id: numericId },
      include: { images: true, category: true },
    })

    if (!product) {
      return notFound('Product not found')
    }

    // Preserve media safely to unused-media directory
    await preserveProductMedia(product)

    // Delete product relations and product in DB
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: numericId } }),
      prisma.productFaq.deleteMany({ where: { productId: numericId } }),
      prisma.productAttributeValue.deleteMany({ where: { productId: numericId } }),
      prisma.product.delete({ where: { id: numericId } }),
    ])

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error('DELETE /api/products/[id] error:', error)
    return error instanceof Response ? error : json({ error: error?.message || 'Unable to delete product' }, { status: 500 })
  }
}
