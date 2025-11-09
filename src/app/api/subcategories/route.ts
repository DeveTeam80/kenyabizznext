// src/app/api/subcategories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { getSession } from '@/app/lib/auth'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'
import { 
  logRateLimitExceeded, 
  logUnauthorizedAccess,
  logInvalidInput,
  logSuspiciousActivity 
} from '@/app/lib/security-helpers'

export async function GET(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // 🔥 CHANGE: Allow public access, but check session for personalization
    const rawSession = await getSession();
const session = rawSession as any; // allows JWT payload without TS error


    // 🔒 Rate limit (more generous for public access)
    const rateLimit = checkRateLimit(identifier, {
      limit: 60, // 🔥 Increased from 30
      windowMs: 60000,
      blockDurationMs: 5 * 60000
    })

    if (!rateLimit.allowed) {
      if (session) {
        logRateLimitExceeded(request, session, rateLimit.resetTime)
      }
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime)
          }
        }
      )
    }

    // 🔒 Validate input
    const { searchParams } = new URL(request.url)
    const categoriesParam = searchParams.get('categories')
    const searchParam = searchParams.get('search')
    const limitParam = searchParams.get('limit')

    let categories: string[] = []
    if (categoriesParam) {
      categories = categoriesParam
        .split(',')
        .map(c => c.trim())
        .filter(c => /^[a-z0-9\-]+$/.test(c))
        .slice(0, 5)

      if (categories.length === 0 && categoriesParam.length > 0) {
        if (session) {
          logInvalidInput(request, session, 'categories', categoriesParam)
        }
        return NextResponse.json(
          { error: 'Invalid categories parameter' },
          { status: 400 }
        )
      }
    }

    let search = ''
    if (searchParam) {
      search = searchParam.trim().slice(0, 100)
      
      const suspiciousPattern = /<|>|script|javascript|eval|document|window/i
      if (suspiciousPattern.test(search)) {
        if (session) {
          logSuspiciousActivity(request, session, {
            parameter: 'search',
            value: search
          })
        }
        return NextResponse.json(
          { error: 'Invalid search query' },
          { status: 400 }
        )
      }
    }

    const limit = Math.min(
      Math.max(parseInt(limitParam || '20'), 1),
      50
    )

    // 🔒 Query database
    let listings = await prisma.listing.findMany({
      where: {
        approved: true, // 🔥 Only show approved listings for public
      },
      select: {
        subCategory: true,
        categories: true,
      },
      take: 500,
    })

    // Filter by category if specified
    if (categories.length > 0) {
      listings = listings.filter(listing => {
        const listingCategories = (listing.categories as any[]) || []
        return categories.some(cat => 
          listingCategories.some((lc: any) => lc.slug === cat)
        )
      })
    }

    let subCategories = [...new Set(
      listings
        .map(l => l.subCategory)
        .filter(Boolean)
        .filter(sub => sub.length <= 100)
    )]

    if (search) {
      const searchLower = search.toLowerCase()
      subCategories = subCategories.filter(sub => 
        sub.toLowerCase().includes(searchLower)
      )
    }

    const subCategoryCounts = listings.reduce((acc: any, listing) => {
      const sub = listing.subCategory
      if (sub && subCategories.includes(sub)) {
        acc[sub] = (acc[sub] || 0) + 1
      }
      return acc
    }, {})

    subCategories = subCategories
      .sort((a, b) => {
        const countDiff = (subCategoryCounts[b] || 0) - (subCategoryCounts[a] || 0)
        if (countDiff !== 0) return countDiff
        return a.localeCompare(b)
      })
      .slice(0, limit)

    const options = subCategories.map(sub => ({
      value: sub,
      label: `${sub} (${subCategoryCounts[sub]} ${subCategoryCounts[sub] === 1 ? 'listing' : 'listings'})`,
    }))

    return NextResponse.json(
      { 
        subCategories: options,
        total: options.length 
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'Cache-Control': 'public, s-maxage=300', // 🔥 Cache for 5 minutes
        }
      }
    )

  } catch (error: any) {
    console.error('Get subcategories error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    )
  }
}