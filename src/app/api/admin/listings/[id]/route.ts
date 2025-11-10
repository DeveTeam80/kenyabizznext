// src/app/api/admin/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

// GET - Admin can fetch any listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const listingId = parseInt(id)

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ listing })
  } catch (error: any) {
    console.error('Admin get listing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const data = await request.json()
    const listingId = parseInt(id)

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, listing })
  } catch (error: any) {
    console.error('Admin update listing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update listing' },
      { status: 500 }
    )
  }
}

// Admin can delete any listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const listingId = parseInt(id)

    await prisma.listing.delete({
      where: { id: listingId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin delete listing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete listing' },
      { status: 500 }
    )
  }
}