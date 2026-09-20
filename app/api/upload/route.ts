import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/api'
import { getCrmUploadsDir, getFrontendUploadsDir } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folderParam = formData.get('folder') as string | null

    // 1. Enforce admin authentication for all uploads except public review photos
    if (folderParam !== 'reviews') {
      await requireAdmin(request)
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 2. Limit file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 })
    }

    const mimeType = (file.type || '').toLowerCase()
    const rawExt = path.extname(file.name).toLowerCase()
    
    // 3. Validate permitted image MIME types & extensions
    const allowedMimePrefixes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']

    const isSvg = rawExt === '.svg' || mimeType.includes('svg')
    const isAllowedMime = allowedMimePrefixes.some(m => mimeType.startsWith(m))
    const isAllowedExt = allowedExtensions.includes(rawExt)

    if (!isAllowedMime && !isAllowedExt) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed formats: PNG, JPG, JPEG, WEBP, GIF, SVG.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const inputBuffer = Buffer.from(bytes)

    let finalBuffer: Buffer
    let finalExt: string

    if (isSvg) {
      finalBuffer = inputBuffer
      finalExt = '.svg'
    } else {
      // Auto-orient, resize max 1600px longest edge, compress to WebP (quality 80)
      finalBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
          effort: 4,
        })
        .toBuffer()
      finalExt = '.webp'
    }

    // 4. Determine destination subdirectory (e.g. categories, products/category-slug/product-slug, brands, reviews)
    const customNameParam = (formData.get('customName') || formData.get('slug') || formData.get('name')) as string | null

    // Sanitize folder path (support nested subfolders like products/nets/bird-net)
    const cleanFolder = (folderParam || '')
      .split('/')
      .map(part => part.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''))
      .filter(Boolean)
      .join('/')

    // 5. Write to authoritative CRM uploads directory
    const crmBaseUploadDir = getCrmUploadsDir()
    const targetDir = cleanFolder ? path.join(crmBaseUploadDir, ...cleanFolder.split('/')) : crmBaseUploadDir
    await fs.mkdir(targetDir, { recursive: true })

    const rawChosenName = customNameParam || path.parse(file.name).name
    const sanitizedBaseName = rawChosenName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item'

    const uniqueName = `${sanitizedBaseName}-${Date.now().toString().slice(-6)}${finalExt}`
    const crmFilePath = path.join(targetDir, uniqueName)
    await fs.writeFile(crmFilePath, finalBuffer)

    const fileUrl = cleanFolder ? `/uploads/${cleanFolder}/${uniqueName}` : `/uploads/${uniqueName}`
    return NextResponse.json({ url: fileUrl, filename: uniqueName, sizeBytes: finalBuffer.length }, { status: 201 })
  } catch (error: any) {
    if (error instanceof Response) return error
    console.error('Upload failed:', error)
    return NextResponse.json({ error: error?.message || 'Image upload failed' }, { status: 500 })
  }
}

