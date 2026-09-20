import { prisma, json, parseBody, requireAdmin } from '@/lib/api'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(180).optional(),
  tagline: z.string().max(255).optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).default(''),
  whatsapp: z.string().max(40).default(''),
  address: z.string().max(500).default(''),
  hours: z.string().max(255).default(''),
  facebook: z.string().max(500).default(''),
  instagram: z.string().max(500).default(''),
})

export async function GET() {
  try {
    const settings = await prisma.companySettings.findFirst()
    return json(settings)
  } catch (error) {
    return error instanceof Response ? error : json({ error: 'Unable to read company settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin(request)
    const data = await parseBody(request, schema)
    const current = await prisma.companySettings.findFirst()
    return json(
      current
        ? await prisma.companySettings.update({ where: { id: current.id }, data: data as never })
        : await prisma.companySettings.create({ data: data as never })
    )
  } catch (error) {
    return error instanceof Response ? error : json({ error: 'Unable to save company settings' }, { status: 500 })
  }
}

