import { deleteCatalog, updateCatalog } from '@/app/api/catalog-routes'
const handle = (fn: (request: Request, model: 'attribute', id: string) => Promise<Response>, id: string, request: Request) => fn(request, 'attribute', id).catch(error => error instanceof Response ? error : Response.json({ error: 'Unable to process attribute' }, { status: 500 }))
export const PATCH = (request: Request, context: { params: Promise<{ id: string }> }) => context.params.then(({ id }) => handle(updateCatalog, id, request))
export const PUT = PATCH
export const DELETE = (request: Request, context: { params: Promise<{ id: string }> }) => context.params.then(({ id }) => handle(deleteCatalog, id, request))
