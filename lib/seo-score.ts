export type SeoProductInput = {
  name?: string
  slug?: string
  metaTitle?: string
  metaDescription?: string
  usage?: string
  benefits?: string[] | unknown
  faqs?: { question: string; answer: string }[] | unknown
  content?: { usage?: string; benefits?: string[]; faqs?: { question: string; answer: string }[] }
  images?: { alt?: string }[]
}

export type SeoCheck = { key: string; label: string; passed: boolean; tip: string; points: number }

export function getSeoChecks(product: SeoProductInput): SeoCheck[] {
  const title = product.metaTitle?.trim() ?? ''
  const description = product.metaDescription?.trim() ?? ''
  const name = product.name?.trim() ?? ''
  const slug = product.slug?.trim() ?? ''
  const usage = (product.usage || product.content?.usage || '').trim()
  const rawBenefits = Array.isArray(product.benefits) ? product.benefits : product.content?.benefits
  const benefits = (Array.isArray(rawBenefits) ? rawBenefits : []).filter(Boolean)
  const rawFaqs = Array.isArray(product.faqs) ? product.faqs : product.content?.faqs
  const faq = (Array.isArray(rawFaqs) ? rawFaqs : []).filter((item: any) => item && item.question && item.answer)
  const images = product.images ?? []
  return [
    { key: 'title', label: 'Meta title is 30–60 characters', passed: title.length >= 30 && title.length <= 60, tip: 'Write a specific title between 30 and 60 characters.', points: 15 },
    { key: 'description', label: 'Meta description is 120–160 characters', passed: description.length >= 120 && description.length <= 160, tip: 'Add a useful, keyword-rich description between 120 and 160 characters.', points: 15 },
    {
      key: 'keyword-title',
      label: 'Product name appears in meta title',
      passed: (() => {
        if (!name || !title) return false
        const lowerTitle = title.toLowerCase()
        const lowerName = name.toLowerCase()
        if (lowerTitle.includes(lowerName)) return true
        // Extract meaningful tokens (length > 3) from product name
        const tokens = lowerName.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 3)
        if (tokens.length === 0) return false
        // At least 2 significant tokens (or 50% of tokens) match the meta title
        const matched = tokens.filter(t => lowerTitle.includes(t)).length
        return matched >= Math.min(2, tokens.length)
      })(),
      tip: 'Include the product name in the meta title.',
      points: 10
    },
    { key: 'slug', label: 'SEO-friendly URL slug', passed: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), tip: 'Use lowercase words separated by hyphens.', points: 10 },
    { key: 'usage', label: 'Usage or application copy added', passed: usage.length >= 80, tip: 'Add at least 80 characters describing use cases.', points: 10 },
    { key: 'benefits', label: 'At least three product benefits', passed: benefits.length >= 3, tip: 'Add three or more concrete customer benefits.', points: 10 },
    { key: 'faq', label: 'FAQ content added', passed: faq.length >= 2, tip: 'Add at least two question-and-answer pairs.', points: 10 },
    { key: 'image-alt', label: 'All product images have alt text', passed: images.length > 0 && images.every(image => !!image.alt?.trim()), tip: 'Add descriptive alt text to every product image.', points: 10 },
    { key: 'content', label: 'Product content is substantial', passed: usage.length + benefits.join(' ').length >= 240, tip: 'Expand product copy with specifications, applications, and benefits.', points: 10 },
  ]
}

export function getSeoScore(product: SeoProductInput) {
  const checks = getSeoChecks(product)
  const score = checks.reduce((total, check) => total + (check.passed ? check.points : 0), 0)
  return { score, checks, status: score >= 80 ? 'Good' : score >= 50 ? 'Needs Review' : 'Poor' as const }
}

export function getSeoScoreTone(score: number) {
  return score >= 80 ? 'good' : score >= 50 ? 'review' : 'poor' as const
}
