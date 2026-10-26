import { prisma, json, parseBody, requireAdmin } from '@/lib/api'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
const schema=z.object({titleTemplate:z.string().max(255),descriptionTemplate:z.string().max(500),defaultRobots:z.string().max(255).default('index,follow')})
export async function GET(request:Request){try{await requireAdmin(request);return json(await prisma.seoSettings.findFirst())}catch(error){return error instanceof Response?error:json({error:'Unable to read SEO settings'},{status:500})}}
export async function PUT(request:Request){try{await requireAdmin(request);const data=await parseBody(request,schema);const current=await prisma.seoSettings.findFirst();const res=current?await prisma.seoSettings.update({where:{id:current.id},data}):await prisma.seoSettings.create({data:data as never});try{revalidatePath('/','layout')}catch{};return json(res)}catch(error){return error instanceof Response?error:json({error:'Unable to save SEO settings'},{status:500})}}
