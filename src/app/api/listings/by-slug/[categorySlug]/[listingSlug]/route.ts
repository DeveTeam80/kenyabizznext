// src/app/api/listings/by-slug/[categorySlug]/[listingSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categorySlug: string; listingSlug: string }> }
) {
  const identifier = getIdentifier(request)

  try {
    const rateLimit = checkRateLimit(`listing-detail-${identifier}`, {
      limit: 50,
      windowMs: 60000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // 🔥 Await params (Next.js 15)
    const { categorySlug, listingSlug } = await params

    console.log('🔍 API called with:', { categorySlug, listingSlug })

    // Find listing
    const listing = await prisma.listing.findFirst({
      where: {
        slug: listingSlug,
        approved: true,
      }
    })

    if (!listing) {
      console.log('❌ Listing not found')
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    console.log('✅ Found listing:', listing.title)

    // Check category
    const categories = listing.categories as any[]
    const hasCategory = categories?.some(cat => cat.slug === categorySlug)

    if (!hasCategory) {
      console.log('❌ Wrong category:', { 
        requested: categorySlug, 
        available: categories?.map(c => c.slug) 
      })
      return NextResponse.json(
        { error: 'Listing not found in this category' },
        { status: 404 }
      )
    }

    console.log('✅ Category match!')

    // Get related listings
    const allListings = await prisma.listing.findMany({
      where: {
        approved: true,
        slug: { not: listingSlug },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        desc: true,
        logo: true,
        image: true,
        city: true,
        location: true,
        subCategory: true,
        isVerified: true,
        featured: true,
        rating: true,
        ratingRate: true,
        review: true,
        categories: true,
      },
      take: 20,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    const relatedListings = allListings
      .filter(l => {
        const cats = l.categories as any[]
        return cats?.some(cat => cat.slug === categorySlug)
      })
      .slice(0, 3)

    console.log('✅ Success! Returning listing')

    return NextResponse.json({
      listing,
      relatedListings
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    })

  } catch (error: any) {
    console.error('❌ API Error:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch listing', details: error.message },
      { status: 500 }
    )
  }
}