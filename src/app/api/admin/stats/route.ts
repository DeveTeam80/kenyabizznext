// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    const [
      totalListings, 
      pendingListings, 
      approvedListings, 
      totalUsers,
      needsLocationReview  // 🆕 Add this
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { approved: false } }),
      prisma.listing.count({ where: { approved: true } }),
      prisma.user.count(),
      prisma.listing.count({ where: { locationVerified: false } })  // 🆕 Count unverified locations
    ])

    return NextResponse.json({
      totalListings,
      pendingListings,
      approvedListings,
      totalUsers,
      needsLocationReview,  // 🆕 Return this
    })
  } catch (error: any) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}