export type AttributeType = 'select' | 'multi-select' | 'number' | 'text'
export type RecordStatus = 'Active' | 'Draft'
export type SeoStatus = 'Complete' | 'Needs Review'

export interface Attribute { id: number; name: string; type: AttributeType; options: string[]; status: RecordStatus; required?: boolean }
export interface Category { id: number; name: string; slug: string; image?: string; attributeIds: number[]; status: RecordStatus; metaTitle: string; metaDescription: string; description: string }
export interface ProductImage { id?: number; src: string; alt: string }
export interface ProductFaq { id: number; question: string; answer: string }
export interface ProductContent { benefits: string[]; usage: string; suitedFor: string[]; notSuitedFor: string[]; faqs: ProductFaq[]; attributeValues: Record<number, string> }
export type ProductAvailability = 'In Stock' | 'Out of Stock'
export interface BulkPriceTier { minQuantity: number; unitPrice: string }
export interface Product { id: number; name: string; sku: string; category: string; price: string; availability: ProductAvailability; status: RecordStatus; seoStatus: SeoStatus; metaTitle: string; metaDescription: string; slug: string; barcode?: string; moq?: number; shortDescription?: string; longDescription?: string; tradeAliases?: string; bulkPricing?: BulkPriceTier[]; weight?: string; length?: string; width?: string; height?: string; countryOfOrigin?: string; relatedProductIds?: number[]; ogTitle?: string; ogDescription?: string; ogImage?: string; images: ProductImage[]; content: ProductContent }
export interface SeoSettings { titleTemplate: string; metaDescription: string; ogImage: string; verificationNotes: string }
export interface CompanyProfile { name: string; tagline: string; description: string; address: string; phone: string; whatsapp: string; email: string; facebook: string; instagram: string; hours: string }
export interface ProductFilters { status: 'All' | RecordStatus; seoStatus: 'All' | SeoStatus }
export interface NavItem { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected'
export interface Review {
  id: number
  name: string
  rating: number
  message: string
  contact?: string | null
  imageUrl?: string | null
  status: ReviewStatus
  productId?: number | null
  product?: { id: number; name: string } | null
  serviceId?: string | null
  createdAt: string
  updatedAt: string
}

