// src/app/api/listings/public/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

export async function GET(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // Rate limit: 100 requests per minute for public API
    const rateLimit = checkRateLimit(`public-listings-${identifier}`, {
      limit: 100,
      windowMs: 60000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const categorySlug = searchParams.get('category')
    const subCategory = searchParams.get('subCategory')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const context = searchParams.get('context') || 'local'

    // Build where clause
    const where: any = {
      approved: true,
    }

    // Filter by context (Kenya vs Global)
    if (context === 'local') {
      where.isGlobal = false
    } else if (context === 'global') {
      where.isGlobal = true
    }

    // 🔥 FIX: Filter by category - Use raw SQL for JSON queries
    let categoryFilter = ''
    if (categorySlug) {
      // We'll filter after fetch since Prisma JSON queries are complex
    }

    // Filter by subcategory
    if (subCategory) {
      where.subCategory = {
        equals: subCategory,
        mode: 'insensitive'
      }
    }

    // Filter by city
    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      }
    }

    // Filter by search query
    if (search && search.trim()) {
      const searchTerm = search.trim()
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { desc: { contains: searchTerm, mode: 'insensitive' } },
        { subCategory: { contains: searchTerm, mode: 'insensitive' } },
        { city: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
      ]
    }

    // Filter by featured
    if (featured) {
      where.featured = true
    }

    // 🔥 FIX: Get all listings first, then filter by category in JS
    // This is a temporary solution - we'll optimize later
    const allListings = await prisma.listing.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // 🔥 FIX: Filter by category in JavaScript
    let filteredListings = allListings
    if (categorySlug) {
      filteredListings = allListings.filter(listing => {
        const categories = listing.categories as any[]
        return categories?.some(cat => cat.slug === categorySlug)
      })
    }

    // Calculate pagination
    const totalCount = filteredListings.length
    const totalPages = Math.ceil(totalCount / limit)
    const skip = (page - 1) * limit
    const paginatedListings = filteredListings.slice(skip, skip + limit)

    return NextResponse.json({
      listings: paginatedListings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Total-Count': String(totalCount),
        'X-Page': String(page),
        'X-Total-Pages': String(totalPages),
      }
    })

  } catch (error: any) {
    console.error('Get public listings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}