// src/app/api/admin/listings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'all', 'location-review' 🆕

    let where: any = {}

    if (status === 'pending') {
      where.approved = false
    } else if (status === 'approved') {
      where.approved = true
    } else if (status === 'location-review') {  // 🆕 Add this filter
      where.locationVerified = false
    }
    // 'all' = no filter

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ listings })
  } catch (error: any) {
    console.error('Admin get listings error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listings' },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}