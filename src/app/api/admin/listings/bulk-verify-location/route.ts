// src/app/api/admin/listings/bulk-verify-location/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { role: true }
    })
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { listingIds } = body

    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: 'listingIds must be a non-empty array' },
        { status: 400 }
      )
    }

    // Bulk update location verification
    const result = await prisma.listing.updateMany({
      where: {
        id: {
          in: listingIds
        }
      },
      data: {
        locationVerified: true
      }
    })

    return NextResponse.json({
      message: `${result.count} listings verified successfully`,
      count: result.count
    })

  } catch (error: any) {
    console.error('Bulk verify location error:', error)
    return NextResponse.json(
      { error: 'Failed to verify locations' },
      { status: 500 }
    )
  }
}