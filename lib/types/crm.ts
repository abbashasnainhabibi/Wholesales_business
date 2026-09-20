export interface CompanySettings {
  id?: number
  name: string
  tagline: string
  description: string
  address: string
  phone: string
  whatsapp: string
  email: string
  facebook?: string
  instagram?: string
  hours: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
  image?: string | null
  description?: string
  metaTitle?: string
  metaDescription?: string
  _count?: { products: number }
}

export interface ProductAttributeValueItem {
  id?: number
  attributeId?: number
  value: string
  attribute?: {
    id: number
    name: string
    type: string
  }
}

export interface ProductFaqItem {
  id?: number
  question: string
  answer: string
}

export interface ProductImageItem {
  id?: number
  src: string
  alt: string
  sortOrder?: number
}

export interface ProductItem {
  id: number
  name: string
  sku: string
  slug: string
  categoryId?: number
  category?: ProductCategory
  price: number | string
  availability: 'InStock' | 'OutOfStock' | 'In Stock' | 'Out of Stock'
  status: 'Active' | 'Draft'
  seoStatus?: string
  metaTitle?: string
  metaDescription?: string
  moq?: number
  shortDescription?: string | null
  longDescription?: string | null
  tradeAliases?: string | null
  usage?: string
  benefits?: string[]
  suitedFor?: string[]
  notSuitedFor?: string[]
  attributeValues?: ProductAttributeValueItem[]
  faqs?: ProductFaqItem[]
  images?: ProductImageItem[]
  createdAt?: string
}

export interface ReviewItem {
  id: number
  name: string
  rating: number
  message: string
  contact?: string | null
  imageUrl?: string | null
  productId?: number | null
  serviceId?: string | null
  createdAt: string
}

