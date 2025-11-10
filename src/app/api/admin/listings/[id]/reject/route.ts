// src/app/api/admin/listings/[id]/reject/route.ts
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
    await prisma.listing.delete({
      where: { id: listingId },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Listing rejected and deleted'
    })
  } catch (error: any) {
    console.error('Reject listing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reject listing' },
      { status: 500 }
    )
  }
}