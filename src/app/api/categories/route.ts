// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const context = searchParams.get('context') || 'local'

    const where: any = {
      approved: true
    }

    if (context === 'local') {
      where.isGlobal = false
    } else if (context === 'global') {
      where.isGlobal = true
    }

    // Get all listings
    const listings = await prisma.listing.findMany({
      where,
      select: {
        categories: true,
      }
    })

    // Extract unique categories with counts
    const categoryMap = new Map<string, { name: string; count: number }>()

    listings.forEach(listing => {
      const categories = (listing.categories as any[]) || []
      categories.forEach(cat => {
        const existing = categoryMap.get(cat.slug)
        if (existing) {
          existing.count++
        } else {
          categoryMap.set(cat.slug, {
            name: cat.name,
            count: 1
          })
        }
      })
    })

    // Convert to array and sort by count
    const categories = Array.from(categoryMap.entries())
      .map(([slug, data]) => ({
        slug,
        name: data.name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      categories
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300', // Cache for 5 minutes
      }
    })

  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}