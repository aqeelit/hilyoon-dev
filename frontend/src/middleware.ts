import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'ro', 'ar']
const defaultLocale = 'en'

// Get the preferred locale, simplified version
function getLocale(request: NextRequest): string {
  // Check if locale is in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return pathname.split('/')[1]
  }

  // Simple fallback to default locale
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes, static files, Next.js internals, AND ADMIN routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/admin') ||  // ← ADD THIS LINE
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // Redirect to the same path with the locale prefix
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }

  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    // Admin routes are now handled by the pathname.startsWith('/admin') check above
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
