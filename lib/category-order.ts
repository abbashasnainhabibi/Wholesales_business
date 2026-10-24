/**
 * Category Order & Priority Definition for Tahira Syndicate
 * 
 * Business Priority:
 * 1. Tarpaulins & Canvas Tents (Tarpal / Moom Jama) - Core Manufacturing
 * 2. Ropes & Twines (Jahazi Rassa / Cordage) - Core Manufacturing
 * 3. Nets & Netting (Agro Shade Nets / Hara Parda / Safety Nets) - Core Manufacturing
 * 4. Polythene Sheets & Plastic Films (Dhalai Plastic / Construction Films) - Core Manufacturing
 * 
 * Secondary Product Lines:
 * 5. Building & Flexible Pipes
 * 6. Safety Belts & Webbing Slings
 * 7. Packaging & Strapping Materials
 */

export const PRIMARY_CATEGORY_SLUGS = [
  'tarpaulins-canvas-tents',
  'ropes',
  'nets',
  'polythene-sheets-films',
] as const

export type PrimaryCategorySlug = typeof PRIMARY_CATEGORY_SLUGS[number]

export const SECONDARY_CATEGORY_SLUGS = [
  'building-flexible-pipes',
  'safety-belts-webbing-slings',
  'packaging-strapping',
] as const

export type SecondaryCategorySlug = typeof SECONDARY_CATEGORY_SLUGS[number]

export const CATEGORY_PRIORITY_ORDER: readonly string[] = [
  ...PRIMARY_CATEGORY_SLUGS,
  ...SECONDARY_CATEGORY_SLUGS,
]

export function isPrimaryCategory(slug?: string | null): boolean {
  if (!slug) return false
  return (PRIMARY_CATEGORY_SLUGS as readonly string[]).includes(slug.trim().toLowerCase())
}

export function isSecondaryCategory(slug?: string | null): boolean {
  if (!slug) return false
  return (SECONDARY_CATEGORY_SLUGS as readonly string[]).includes(slug.trim().toLowerCase())
}

export function getCategoryPriorityRank(slug?: string | null): number {
  if (!slug) return 999
  const normalized = slug.trim().toLowerCase()
  const idx = CATEGORY_PRIORITY_ORDER.indexOf(normalized)
  return idx !== -1 ? idx : 999
}

/**
 * Sorts an array of categories according to business priority rank.
 * Primary categories (1-4) appear first, followed by Secondary (5-7).
 */
export function sortCategoriesByPriority<T extends { slug?: string | null }>(
  categories: T[]
): T[] {
  if (!Array.isArray(categories) || categories.length === 0) return []
  return [...categories].sort((a, b) => {
    const rankA = getCategoryPriorityRank(a.slug)
    const rankB = getCategoryPriorityRank(b.slug)
    if (rankA !== rankB) return rankA - rankB
    return ((a as any).name || '').localeCompare((b as any).name || '')
  })
}

/**
 * Sorts products so that products from the 4 primary categories appear first,
 * maintaining their original sorting (e.g. createdAt desc) within each category rank tier.
 */
export function sortProductsByCategoryPriority<
  T extends {
    categoryId?: number | null
    category?: { id?: number; slug?: string | null } | null
  }
>(
  products: T[],
  categoryLookup?: Array<{ id: number; slug?: string | null }>
): T[] {
  if (!Array.isArray(products) || products.length === 0) return []

  const idToSlug = new Map<number, string>()
  if (categoryLookup) {
    for (const c of categoryLookup) {
      if (c && c.id != null && c.slug) {
        idToSlug.set(c.id, c.slug)
      }
    }
  }

  return [...products].sort((a, b) => {
    const slugA = a.category?.slug || (a.categoryId != null ? idToSlug.get(a.categoryId) : undefined)
    const slugB = b.category?.slug || (b.categoryId != null ? idToSlug.get(b.categoryId) : undefined)

    const rankA = getCategoryPriorityRank(slugA)
    const rankB = getCategoryPriorityRank(slugB)

    return rankA - rankB
  })
}
