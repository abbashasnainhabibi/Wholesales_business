import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Honey-pot: return 404 for obvious admin probe URLs so bots think no admin panel exists
  if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/wp-admin' || pathname.startsWith('/wp-admin/')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/wp-admin/:path*',
  ],
}
