import type { Attribute, Category, CompanyProfile, Product, SeoSettings } from '@/lib/domain-types'

export type ApiErrorKind = 'network' | 'validation' | 'auth' | 'not-found' | 'conflict' | 'server' | 'unknown'
export class ApiError extends Error { constructor(public status: number, public kind: ApiErrorKind, message: string, public details?: unknown) { super(message); this.name = 'ApiError' } }
export type ApiList<T> = { data: T[]; page: number; pageSize: number; total: number; hasMore: boolean }
export type ApiResult<T> = { data: T }
export type ListParams = { page?: number; pageSize?: number; search?: string; status?: string; [key: string]: string | number | undefined }

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response
  try { response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, body: options.body === undefined ? undefined : JSON.stringify(options.body) }) }
  catch { throw new ApiError(0, 'network', 'Unable to reach the API. Check your connection and try again.') }
  const payload = await response.json().catch(() => null)
  if (!response.ok) { const message = payload?.error?.message || payload?.message || 'The request could not be completed.'; const kind: ApiErrorKind = response.status === 401 || response.status === 403 ? 'auth' : response.status === 404 ? 'not-found' : response.status === 409 ? 'conflict' : response.status === 400 || response.status === 422 ? 'validation' : response.status >= 500 ? 'server' : 'unknown'; throw new ApiError(response.status, kind, message, payload?.error?.details) }
  return payload as T
}
const list = <T>(resource: string, params?: ListParams) => apiRequest<ApiList<T>>(`${resource}${params ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}` : ''}`)
const one = <T>(resource: string, id: number | string) => apiRequest<ApiResult<T>>(`${resource}/${encodeURIComponent(String(id))}`)
const create = <T>(resource: string, body: unknown) => apiRequest<ApiResult<T>>(resource, { method: 'POST', body })
const update = <T>(resource: string, id: number | string, body: unknown) => apiRequest<ApiResult<T>>(`${resource}/${encodeURIComponent(String(id))}`, { method: 'PATCH', body })
const remove = (resource: string, id: number | string) => apiRequest<{ data: { id: string | number } }>(`${resource}/${encodeURIComponent(String(id))}`, { method: 'DELETE' })

export const productsApi = { list: (params?: ListParams) => list<Product>('/api/products', params), get: (id: number | string) => one<Product>('/api/products', id), create: (body: Partial<Product>) => create<Product>('/api/products', body), update: (id: number | string, body: Partial<Product>) => update<Product>('/api/products', id, body), remove: (id: number | string) => remove('/api/products', id) }
export const categoriesApi = { list: (params?: ListParams) => list<Category>('/api/categories', params), get: (idOrSlug: number | string) => one<Category>('/api/categories', idOrSlug), create: (body: Partial<Category>) => create<Category>('/api/categories', body), update: (id: number | string, body: Partial<Category>) => update<Category>('/api/categories', id, body), remove: (id: number | string) => remove('/api/categories', id) }
export const attributesApi = { list: (params?: ListParams) => list<Attribute>('/api/attributes', params), create: (body: Partial<Attribute>) => create<Attribute>('/api/attributes', body), update: (id: number | string, body: Partial<Attribute>) => update<Attribute>('/api/attributes', id, body), remove: (id: number | string) => remove('/api/attributes', id) }
export const companySettingsApi = { get: () => apiRequest<ApiResult<CompanyProfile>>('/api/settings/company'), update: (body: Partial<CompanyProfile>) => apiRequest<ApiResult<CompanyProfile>>('/api/settings/company', { method: 'PATCH', body }) }
export const seoSettingsApi = { get: () => apiRequest<ApiResult<SeoSettings>>('/api/settings/seo'), update: (body: Partial<SeoSettings>) => apiRequest<ApiResult<SeoSettings>>('/api/settings/seo', { method: 'PATCH', body }) }
