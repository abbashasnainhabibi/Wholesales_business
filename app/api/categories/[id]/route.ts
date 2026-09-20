import { deleteCatalog, updateCatalog, getCatalog } from '@/app/api/catalog-routes'

const handle = (fn: (request: Request, model: 'category', id: string) => Promise<Response>, id: string, request: Request) =>
  fn(request, 'category', id).catch(error =>
    error instanceof Response ? error : Response.json({ error: 'Unable to process category' }, { status: 500 })
  )

export const GET = (request: Request, context: { params: Promise<{ id: string }> }) =>
  context.params.then(({ id }) => getCatalog(request, 'category', id))

export const PATCH = (request: Request, context: { params: Promise<{ id: string }> }) =>
  context.params.then(({ id }) => handle(updateCatalog, id, request))

export const PUT = PATCH

export const DELETE = (request: Request, context: { params: Promise<{ id: string }> }) =>
  context.params.then(({ id }) => handle(deleteCatalog, id, request))
