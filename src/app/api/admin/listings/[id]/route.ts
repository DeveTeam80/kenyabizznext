// src/app/api/admin/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'
import { handleApiError } from '@/app/lib/api-error-handler'
import { deleteCloudinaryImage } from '@/app/lib/cloudinary'

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
  } catch (error: unknown) {
    return handleApiError(error, 'GET /api/admin/listings/[id]')
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

    // Get existing listing for Cloudinary cleanup
    const existingListing = await prisma.listing.findUnique({ where: { id: listingId } })

    // 🆕 Delete old Cloudinary images if new ones are uploaded
    if (existingListing) {
      const imagesToDelete: (string | null)[] = []
      if (data.logo && data.logo !== existingListing.logo) {
        imagesToDelete.push(existingListing.logo)
      }
      if (data.image && data.image !== existingListing.image) {
        imagesToDelete.push(existingListing.image)
      }
      if (data.bannerImage && data.bannerImage !== existingListing.bannerImage) {
        imagesToDelete.push(existingListing.bannerImage)
      }

      // Delete old images in background
      if (imagesToDelete.length > 0) {
        Promise.allSettled(imagesToDelete.map(url => deleteCloudinaryImage(url)))
          .then(results => console.log('Cloudinary cleanup results:', results))
          .catch(err => console.error('Cloudinary cleanup error:', err))
      }
    }

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    // 🆕 Revalidate cache so changes appear immediately
    const primaryCategory = (listing.categories as any[])?.find(c => c.isPrimary)?.slug || (listing.categories as any[])?.[0]?.slug
    if (primaryCategory && listing.slug) {
      revalidatePath(`/listings/${primaryCategory}/${listing.slug}`)
      revalidatePath(`/global-listings/${primaryCategory}/${listing.slug}`)
    }
    revalidatePath('/listings')
    revalidatePath('/global-listings')

    return NextResponse.json({ success: true, listing })
  } catch (error: unknown) {
    return handleApiError(error, 'PUT /api/admin/listings/[id]')
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

    // Get listing for Cloudinary cleanup before deleting
    const listing = await prisma.listing.findUnique({ where: { id: listingId } })

    if (listing) {
      // Delete images in background
      const imagesToDelete = [listing.logo, listing.image, listing.bannerImage].filter(Boolean)
      if (imagesToDelete.length > 0) {
        Promise.allSettled(imagesToDelete.map(url => deleteCloudinaryImage(url)))
          .then(results => console.log('Cloudinary cleanup on delete:', results))
          .catch(err => console.error('Cloudinary cleanup error:', err))
      }
    }

    await prisma.listing.delete({
      where: { id: listingId },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return handleApiError(error, 'DELETE /api/admin/listings/[id]')
  }
}