import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import type { CompanySettings, ProductItem, ProductCategory, ReviewItem } from '@/lib/types/crm'
import { sortCategoriesByPriority, sortProductsByCategoryPriority } from '@/lib/category-order'

export const fallbackSettings: CompanySettings = {
  name: 'Tahira Syndicate',
  tagline: 'Direct Manufacturer & Master Wholesale Distributor of Industrial Ropes, Nets, Tarpaulins & Packaging Materials.',
  description: 'Direct manufacturer and wholesale distributor of PE, PVC, PP, uPVC and HDPE materials, pressure pipes, agro shade nets, safety nets, tarpaulins and packing supplies in Karachi, Pakistan.',
  address: 'Shop # 1, Thakurdwara Ln, Main Shahra-e-Liaquat Road, opp. Sindh Madarsa-tul-Islam, near Karachi Chamber of Commerce, Serai Quarters, Shahra-e-Liaquat Road, Karachi, 74000',
  phone: '+92 321 2043552',
  whatsapp: '+923212043552',
  email: 'info@tahirasyndicate.com',
  facebook: 'https://facebook.com/tahirasyndicate',
  instagram: 'https://instagram.com/tahirasyndicate',
  hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
}

export const getCompanySettings = cache(async function getCompanySettings(): Promise<CompanySettings> {
  try {
    const settings = await prisma.companySettings.findFirst()
    if (settings) {
      return {
        id: settings.id,
        name: settings.name || fallbackSettings.name,
        tagline: settings.tagline || fallbackSettings.tagline,
        description: settings.description || fallbackSettings.description,
        address: settings.address || fallbackSettings.address,
        phone: settings.phone || fallbackSettings.phone,
        whatsapp: settings.whatsapp || fallbackSettings.whatsapp,
        email: settings.email || fallbackSettings.email,
        facebook: settings.facebook || fallbackSettings.facebook,
        instagram: settings.instagram || fallbackSettings.instagram,
        hours: settings.hours || fallbackSettings.hours,
      }
    }
    return fallbackSettings
  } catch {
    return fallbackSettings
  }
})

export const getCategories = cache(async function getCategories(): Promise<ProductCategory[]> {
  try {
    const cats = await prisma.category.findMany({
      where: { status: 'Active' },
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'Active' },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const mapped = cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      description: c.description,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
      _count: { products: c._count.products },
    }))

    return sortCategoriesByPriority(mapped)
  } catch {
    return []
  }
})

export const getCategoryBySlug = cache(async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase()
  try {
    const c = await prisma.category.findFirst({
      where: {
        status: 'Active',
        OR: [
          { slug: cleanSlug },
          { name: cleanSlug },
          ...(Number(cleanSlug) ? [{ id: Number(cleanSlug) }] : []),
        ],
      },
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'Active' },
            },
          },
        },
      },
    })

    if (!c) return null

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      description: c.description,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
      _count: { products: c._count.products },
    }
  } catch {
    return null
  }
})

export const getProducts = cache(async function getProducts(filters?: { categorySlug?: string }): Promise<ProductItem[]> {
  try {
    const prods = await prisma.product.findMany({
      where: {
        status: 'Active',
        ...(filters?.categorySlug
          ? {
              category: {
                slug: filters.categorySlug,
              },
            }
          : {}),
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
        attributeValues: {
          include: {
            attribute: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped: ProductItem[] = prods.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      slug: p.slug,
      categoryId: p.categoryId,
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        image: p.category.image,
      } : undefined,
      price: Number(p.price),
      availability: (p.availability === 'InStock' ? 'In Stock' : 'Out of Stock') as 'In Stock' | 'Out of Stock',
      status: p.status as 'Active' | 'Draft',
      seoStatus: p.seoStatus,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      moq: p.moq,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      tradeAliases: p.tradeAliases,
      usage: p.usage,
      benefits: Array.isArray(p.benefits) ? (p.benefits as string[]) : [],
      suitedFor: Array.isArray(p.suitedFor) ? (p.suitedFor as string[]) : [],
      notSuitedFor: Array.isArray(p.notSuitedFor) ? (p.notSuitedFor as string[]) : [],
      images: p.images.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        sortOrder: img.sortOrder,
      })),
      faqs: p.faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      })),
      attributeValues: p.attributeValues.map((av) => ({
        id: av.id,
        attributeId: av.attributeId,
        value: av.value,
        attribute: av.attribute ? {
          id: av.attribute.id,
          name: av.attribute.name,
          type: av.attribute.type,
        } : undefined,
      })),
      createdAt: p.createdAt.toISOString(),
    }))

    if (!filters?.categorySlug) {
      return sortProductsByCategoryPriority(mapped)
    }

    return mapped
  } catch {
    return []
  }
})

export const getProductBySlug = cache(async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase()
  try {
    const p = await prisma.product.findFirst({
      where: {
        status: 'Active',
        OR: [
          { slug: cleanSlug },
          { name: cleanSlug },
          ...(Number(cleanSlug) ? [{ id: Number(cleanSlug) }] : []),
        ],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
        attributeValues: {
          include: {
            attribute: true,
          },
        },
      },
    })

    if (!p) return null

    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      slug: p.slug,
      categoryId: p.categoryId,
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        image: p.category.image,
      } : undefined,
      price: Number(p.price),
      availability: (p.availability === 'InStock' ? 'In Stock' : 'Out of Stock') as 'In Stock' | 'Out of Stock',
      status: p.status as 'Active' | 'Draft',
      seoStatus: p.seoStatus,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      ogTitle: p.ogTitle,
      ogDescription: p.ogDescription,
      ogImage: p.ogImage,
      moq: p.moq,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      tradeAliases: p.tradeAliases,
      usage: p.usage,
      benefits: Array.isArray(p.benefits) ? (p.benefits as string[]) : [],
      suitedFor: Array.isArray(p.suitedFor) ? (p.suitedFor as string[]) : [],
      notSuitedFor: Array.isArray(p.notSuitedFor) ? (p.notSuitedFor as string[]) : [],
      images: p.images.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        sortOrder: img.sortOrder,
      })),
      faqs: p.faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      })),
      attributeValues: p.attributeValues.map((av) => ({
        id: av.id,
        attributeId: av.attributeId,
        value: av.value,
        attribute: av.attribute ? {
          id: av.attribute.id,
          name: av.attribute.name,
          type: av.attribute.type,
        } : undefined,
      })),
      createdAt: p.createdAt.toISOString(),
    }
  } catch {
    return null
  }
})

export async function submitInquiry(payload: { name: string; phone: string; email?: string; company?: string; materialNeeded: string; details?: string }): Promise<{ success: boolean; error?: string }> {
  return { success: true }
}

export const getApprovedReviews = cache(async (params?: { productId?: number; serviceId?: string; type?: 'general' }): Promise<ReviewItem[]> => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: 'Approved',
        ...(params?.productId ? { productId: params.productId } : {}),
        ...(params?.serviceId ? { serviceId: params.serviceId } : {}),
        ...(params?.type === 'general' ? { productId: null, serviceId: null } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return reviews.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      message: r.message,
      contact: r.contact,
      imageUrl: r.imageUrl,
      productId: r.productId,
      serviceId: r.serviceId,
      createdAt: r.createdAt.toISOString(),
    }))
  } catch {
    return []
  }
})

