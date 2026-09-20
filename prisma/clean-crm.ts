import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clean() {
  console.log('Cleaning and dropping unused tables...')
  const tables = [
    'orderstatusevent',
    'orderpayment',
    'orderitem',
    '`order`',
    'customer',
    'inquiry',
  ]
  for (const t of tables) {
    try {
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${t};`)
      console.log(`✓ Dropped table ${t}`)
    } catch (err: any) {
      console.warn(`Note dropping ${t}:`, err.message)
    }
  }

  try {
    await prisma.$executeRawUnsafe('ALTER TABLE product DROP FOREIGN KEY product_brandId_fkey;')
    console.log('✓ Dropped product_brandId_fkey')
  } catch {}

  try {
    await prisma.$executeRawUnsafe('ALTER TABLE product DROP COLUMN brandId;')
    console.log('✓ Dropped brandId column')
  } catch {}

  try {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS brand;')
    console.log('✓ Dropped table brand')
  } catch (err: any) {
    console.warn('Note dropping brand:', err.message)
  }

  console.log('\n✅ Obsolete tables and relations successfully dropped!')
  await prisma.$disconnect()
}

clean().catch(console.error)
