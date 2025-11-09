// src/app/api/admin/listings/bulk-delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const { listingIds } = await request.json()

    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid listing IDs' },
        { status: 400 }
      )
    }

    const result = await prisma.listing.deleteMany({
      where: {
        id: { in: listingIds },
      },
    })

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} listings deleted`,
    })
  } catch (error: any) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete listings' },
      { status: 500 }
    )
  }
}