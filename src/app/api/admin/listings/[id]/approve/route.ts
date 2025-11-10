// src/app/api/admin/listings/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    
    // Await params since it's now a Promise
    const { id } = await params
    const listingId = parseInt(id)

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        approved: true,
        isVerified: true,
        statusText: 'Verified',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      listing,
      message: 'Listing approved successfully'
    })
  } catch (error: any) {
    console.error('Approve listing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to approve listing' },
      { status: 500 }
    )
  }
}