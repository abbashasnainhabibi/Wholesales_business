import { listCatalog, createCatalog } from '../catalog-routes'
export const GET = (request: Request) => listCatalog(request,'attribute').catch(error => error instanceof Response ? error : Response.json({error:'Unable to list attributes'},{status:500}))
export const POST = (request: Request) => createCatalog(request,'attribute').catch(error => error instanceof Response ? error : Response.json({error:'Unable to create attribute'},{status:500}))
