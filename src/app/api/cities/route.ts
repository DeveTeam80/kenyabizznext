// src/app/api/cities/route.ts
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

    const listings = await prisma.listing.findMany({
      where,
      select: {
        city: true,
      },
      distinct: ['city']
    })

    // Count listings per city
    const cityCounts = await prisma.listing.groupBy({
      by: ['city'],
      where,
      _count: {
        city: true
      }
    })

    const cities = cityCounts.map(item => ({
      city: item.city,
      count: item._count.city
    })).sort((a, b) => b.count - a.count)

    return NextResponse.json({
      cities
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300',
      }
    })

  } catch (error: any) {
    console.error('Get cities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}