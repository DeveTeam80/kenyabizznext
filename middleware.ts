// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './src/app/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // 🔒 Add security headers to all responses
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Add CSP
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://res.cloudinary.com",
        "frame-ancestors 'self'"
      ].join('; ')
    )
  }

  // Get auth token
  const token = request.cookies.get('auth-token')

  // 🔐 Protect /dashboard routes (authenticated users)
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/dashboard', request.url))
    }

    const payload = await verifyToken(token.value)
    if (!payload) {
      const redirectResponse = NextResponse.redirect(new URL('/login?redirect=/dashboard', request.url))
      // Clear invalid token
      redirectResponse.cookies.delete('auth-token')
      return redirectResponse
    }
  }

  // 🔐 Protect /admin routes (admin only)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }

    const payload = await verifyToken(token.value)
    if (!payload) {
      const redirectResponse = NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
      redirectResponse.cookies.delete('auth-token')
      return redirectResponse
    }

    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 🔐 Redirect logged-in users away from auth pages
  if (token && (pathname === '/login' || pathname === '/register')) {
    const payload = await verifyToken(token.value)
    if (payload) {
      const destination = payload.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api (API routes handle their own security)
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /favicon.ico, /robots.txt, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}