// src/app/api/search/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

// 🆕 Define proper types
type BusinessSuggestion = {
  id: number
  title: string
  category: string
  categorySlug: string
  slug: string
  type: 'business'
}

type CategorySuggestion = {
  id: number
  title: string
  category: string
  categorySlug: string
  type: 'category'
}

type Suggestion = BusinessSuggestion | CategorySuggestion

export async function GET(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // Rate limit: 30 requests per minute
    const rateLimit = checkRateLimit(`search-suggestions-${identifier}`, {
      limit: 30,
      windowMs: 60000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { suggestions: [] },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase().trim()
    const context = searchParams.get('context') || 'local'

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Build where clause
    const where: any = {
      approved: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { desc: { contains: query, mode: 'insensitive' } },
        { subCategory: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Filter by context
    if (context === 'local') {
      where.isGlobal = false
    } else if (context === 'global') {
      where.isGlobal = true
    }

    // Get business matches
    const businessMatches = await prisma.listing.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        subCategory: true,
        categories: true,
      },
      take: 4,
      orderBy: [
        { featured: 'desc' },
        { isVerified: 'desc' },
      ]
    })

    // 🆕 Type business suggestions properly
    const suggestions: Suggestion[] = businessMatches.map(listing => {
      const primaryCategory = (listing.categories as any[])?.find(cat => cat.isPrimary)
      const displayCategory = primaryCategory || (listing.categories as any[])?.[0]
      
      return {
        id: listing.id,
        title: listing.title,
        category: displayCategory?.name || listing.subCategory,
        categorySlug: displayCategory?.slug || '',
        slug: listing.slug, // ✅ Business has slug
        type: 'business' as const
      }
    })

    // Get category matches
    const allListings = await prisma.listing.findMany({
      where: {
        approved: true,
        ...(context === 'local' ? { isGlobal: false } : context === 'global' ? { isGlobal: true } : {})
      },
      select: {
        categories: true,
      },
      take: 100
    })

    const categoryMatches = new Set<string>()
    allListings.forEach(listing => {
      const categories = (listing.categories as any[]) || []
      categories.forEach(cat => {
        if (cat.name.toLowerCase().includes(query) && categoryMatches.size < 2) {
          categoryMatches.add(JSON.stringify({
            name: cat.name,
            slug: cat.slug
          }))
        }
      })
    })

    // 🆕 Type category suggestions properly (without slug)
    const categorySuggestions: Suggestion[] = Array.from(categoryMatches)
      .map(str => JSON.parse(str))
      .map(cat => ({
        id: Math.random(),
        title: cat.name,
        category: cat.name,
        categorySlug: cat.slug,
        type: 'category' as const // ✅ Category doesn't need slug
      }))

    suggestions.push(...categorySuggestions)

    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 6) 
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      }
    })

  } catch (error: any) {
    console.error('Search suggestions error:', error)
    return NextResponse.json(
      { suggestions: [] },
      { status: 500 }
    )
  }
}