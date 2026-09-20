import { prisma, json, pagination, parseBody, requireAdmin } from '@/lib/api'
import { z } from 'zod'
import { sanitizeImagePayload } from '@/app/api/catalog-routes'


const productSchema = z.object({
  name: z.string().min(1).max(180),
  sku: z.string().min(1).max(80),
  categoryId: z.number().int().positive(),
  price: z.coerce.number().nonnegative().optional().default(0),
  availability: z.enum(['In Stock', 'Out of Stock']).default('In Stock'),
  status: z.enum(['Active', 'Draft']).default('Draft'),
  seoStatus: z.enum(['Complete', 'Needs Review']).default('Needs Review'),
  metaTitle: z.string().max(255).default(''),
  metaDescription: z.string().max(500).default(''),
  slug: z.string().max(255).default(''),
  content: z.record(z.string(), z.unknown()).default({}),
})

export async function GET(request: Request) {
  try {
    const { skip, pageSize, search } = pagination(request.url)
    const url = new URL(request.url)
    const categorySlug = url.searchParams.get('categorySlug')
    const categoryId = url.searchParams.get('categoryId')

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [{ name: { contains: search } }, { sku: { contains: search } }]
    }
    if (categorySlug) {
      where.category = { slug: categorySlug }
    } else if (categoryId) {
      where.categoryId = Number(categoryId)
    }

    const [data, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          category: true,
          images: true,
          faqs: true,
          attributeValues: { include: { attribute: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])
    return json({ data, meta: { page: Math.floor(skip / pageSize) + 1, pageSize, total } })
  } catch (error: any) {
    console.error('GET /api/products error:', error)
    return error instanceof Response ? error : json({ error: error?.message || 'Unable to list products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request)
    const body = await request.json()
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
    } = body

    if (!name || !categoryId) {
      return json({ error: 'Product name and category are required' }, { status: 400 })
    }

    const contentObj = typeof content === 'object' && content !== null ? content : {}
    const finalSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `prod-${Date.now()}`
    const finalSku = sku || `TS-${Date.now().toString().slice(-6)}`

    // Sanitize incoming images to ensure NO raw Base64 is stored in MySQL ProductImage.src
    let sanitizedImages: { src: string; alt: string; sortOrder: number }[] = []
    if (Array.isArray(images) && images.length > 0) {
      for (let idx = 0; idx < images.length; idx++) {
        const img = images[idx]
        if (!img || !img.src) continue
        let imgSrc = String(img.src).trim()
        if (imgSrc.startsWith('data:image/')) {
          const converted = await sanitizeImagePayload(imgSrc)
          if (!converted) continue // Skip failed base64 conversions
          imgSrc = converted
        }
        sanitizedImages.push({
          src: imgSrc,
          alt: String(img.alt || name || ''),
          sortOrder: typeof img.sortOrder === 'number' ? img.sortOrder : idx,
        })
      }
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: String(name).trim(),
          sku: finalSku,
          categoryId: Number(categoryId),
          price: Number(price) || 0,
          availability: availability === 'Out of Stock' || availability === 'OutOfStock' ? 'OutOfStock' : 'InStock',
          status: status === 'Active' ? 'Active' : 'Draft',
          seoStatus: seoStatus === 'Complete' ? 'Complete' : 'NeedsReview',
          metaTitle: metaTitle || name,
          metaDescription: metaDescription || '',
          slug: finalSlug,
          barcode: barcode || null,
          moq: Number(moq) || 1,
          bulkPricing: Array.isArray(bulkPricing) ? bulkPricing : [],
          weight: weight !== null && weight !== '' && weight !== undefined ? Number(weight) : null,
          length: length !== null && length !== '' && length !== undefined ? Number(length) : null,
          width: width !== null && width !== '' && width !== undefined ? Number(width) : null,
          height: height !== null && height !== '' && height !== undefined ? Number(height) : null,
          countryOfOrigin: countryOfOrigin || null,
          relatedProductIds: Array.isArray(relatedProductIds) ? relatedProductIds : [],
          ogTitle: ogTitle || null,
          ogDescription: ogDescription || null,
          ogImage: ogImage ? (ogImage.startsWith('data:') ? await sanitizeImagePayload(ogImage) : ogImage) : null,
          usage: String(usage !== undefined ? usage : contentObj.usage || ''),
          shortDescription: shortDescription !== undefined && shortDescription !== null ? String(shortDescription) : '',
          longDescription: longDescription !== undefined && longDescription !== null ? String(longDescription) : null,
          tradeAliases: tradeAliases !== undefined && tradeAliases !== null ? String(tradeAliases) : null,
          benefits: Array.isArray(benefits) ? benefits : Array.isArray(contentObj.benefits) ? contentObj.benefits : [],
          suitedFor: Array.isArray(suitedFor) ? suitedFor : Array.isArray(contentObj.suitedFor) ? contentObj.suitedFor : [],
          notSuitedFor: Array.isArray(notSuitedFor) ? notSuitedFor : Array.isArray(contentObj.notSuitedFor) ? contentObj.notSuitedFor : [],
        },
      })

      if (sanitizedImages.length > 0) {
        await tx.productImage.createMany({
          data: sanitizedImages.map((img) => ({
            productId: created.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          })),
        })
      }


      const targetFaqs = Array.isArray(faqs) ? faqs : Array.isArray(contentObj.faqs) ? contentObj.faqs : []
      const validFaqs = targetFaqs.filter((f: any) => f && (f.question || f.answer))
      if (validFaqs.length > 0) {
        await tx.productFaq.createMany({
          data: validFaqs.map((f: any, idx: number) => ({
            productId: created.id,
            question: String(f.question || ''),
            answer: String(f.answer || ''),
            sortOrder: typeof f.sortOrder === 'number' ? f.sortOrder : idx,
          })),
        })
      }

      const targetAttrValues = Array.isArray(attributeValues)
        ? attributeValues
        : typeof contentObj.attributeValues === 'object' && contentObj.attributeValues !== null
        ? Object.entries(contentObj.attributeValues).map(([attrId, val]) => ({ attributeId: Number(attrId), value: String(val) }))
        : []
      const validAttrs = targetAttrValues.filter((av: any) => av && av.attributeId && av.value)
      if (validAttrs.length > 0) {
        await tx.productAttributeValue.createMany({
          data: validAttrs.map((av: any) => ({
            productId: created.id,
            attributeId: Number(av.attributeId),
            value: String(av.value),
          })),
        })
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          faqs: { orderBy: { sortOrder: 'asc' } },
          attributeValues: { include: { attribute: true } },
        },
      })
    })

    return json(product, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/products error:', error)
    return error instanceof Response ? error : json({ error: error?.message || 'Unable to create product' }, { status: 500 })
  }
}
