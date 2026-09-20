import { listCatalog, createCatalog } from '../catalog-routes'

export const GET = (request: Request) =>
  listCatalog(request, 'category').catch(error =>
    error instanceof Response ? error : Response.json({ error: 'Unable to list categories' }, { status: 500 })
  )

export const POST = (request: Request) =>
  createCatalog(request, 'category').catch(error =>
    error instanceof Response ? error : Response.json({ error: 'Unable to create category' }, { status: 500 })
  )
