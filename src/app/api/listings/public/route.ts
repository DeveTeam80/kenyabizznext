// src/app/api/listings/public/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

export async function GET(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // Rate limit: 100 requests per minute
    const rateLimit = checkRateLimit(`public-listings-${identifier}`, {
      limit: 100,
      windowMs: 60000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const categorySlug = searchParams.get('category')
    const subCategory = searchParams.get('subCategory') // Exact filter
    const city = searchParams.get('city')
    const search = searchParams.get('search') // Search term
    const featured = searchParams.get('featured') === 'true'
    const context = searchParams.get('context') || 'local'

    // 1. Build DB Query (Basic Filters Only)
    // We REMOVE the search text filter from here to handle it in JS
    const where: any = {
      approved: true,
    }

    if (context === 'local') {
      where.isGlobal = false
    } else if (context === 'global') {
      where.isGlobal = true
    }

    if (featured) {
      where.featured = true
    }

    // 2. Fetch ALL Candidates
    // We fetch all approved listings for the context to ensure we don't miss 
    // matches hidden inside the JSON arrays (subCategories).
    const allListings = await prisma.listing.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // 3. 🟢 COMPREHENSIVE JAVASCRIPT FILTERING
    let filteredListings = allListings

    // Filter by Category Slug
    if (categorySlug) {
      filteredListings = filteredListings.filter(listing => {
        const categories = (listing.categories as any[]) || []
        return categories.some(cat => cat.slug === categorySlug)
      })
    }

    // Filter by SubCategory (Exact Match from Dropdown)
    if (subCategory) {
      const targetSub = subCategory.toLowerCase().trim()
      filteredListings = filteredListings.filter(listing => {
        const subs = (listing.subCategories as string[]) || []
        return subs.some(s => s.toLowerCase() === targetSub)
      })
    }

    // Filter by City (Partial Match)
    if (city) {
      const targetCity = city.toLowerCase().trim()
      filteredListings = filteredListings.filter(listing => 
        listing.city.toLowerCase().includes(targetCity)
      )
    }

    // 🟢 Filter by SEARCH TERM (The "Common" Search)
    // Checks: Title, Description, City, Location, AND SubCategories
    if (search && search.trim()) {
      const query = search.toLowerCase().trim()
      
      filteredListings = filteredListings.filter(listing => {
        // Basic fields
        const inTitle = listing.title.toLowerCase().includes(query)
        const inDesc = listing.desc.toLowerCase().includes(query)
        const inCity = listing.city.toLowerCase().includes(query)
        const inLocation = listing.location.toLowerCase().includes(query)
        
        // 🟢 Array check: Does any subcategory match the search term?
        const subs = (listing.subCategories as string[]) || []
        const inSubCategories = subs.some(s => s.toLowerCase().includes(query))

        return inTitle || inDesc || inCity || inLocation || inSubCategories
      })
    }

    // 4. Pagination
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