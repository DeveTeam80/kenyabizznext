// src/app/api/admin/listings/[id]/verify-location/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const data = await request.json()
    const { id } = await params
    const listingId = parseInt(id)

    // Extract verification data
    const { isGlobal, locationVerified = true } = data

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        isGlobal: isGlobal,
        locationVerified: locationVerified,
        locationDetection: 'admin_verified', // 🆕 Mark as admin verified
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      listing,
      message: 'Location verified successfully'
    })
  } catch (error: any) {
    console.error('Verify location error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify location' },
      { status: 500 }
    )
  }
}