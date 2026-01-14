// src/app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/app/lib/db'
import { requireAuth } from '@/app/lib/auth'
import { checkRateLimit } from '@/app/lib/rate-limit'
import {
  validateEmail,
  validatePhone,
  validateUrl,
  sanitizeString
} from '@/app/lib/validators'
import { securityLogger, SecurityEventType, getRequestInfo } from '@/app/lib/security-logger'
import { processLocationData } from '@/app/lib/location-detection'
import { handleApiError } from '@/app/lib/api-error-handler'
import { deleteCloudinaryImage } from '@/app/lib/cloudinary'

// 1. GET SINGLE LISTING
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth() as { userId?: number | string }
    const { id } = await params
    const listingId = parseInt(id)

    if (isNaN(listingId)) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.userId !== session.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ listing })

  } catch (error: unknown) {
    console.error('Get listing error:', error)
    return handleApiError(error, 'GET /api/listings/[id]')
  }
}

// 2. UPDATE LISTING (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestInfo = getRequestInfo(request)

  try {
    const session = await requireAuth() as { userId?: number | string }
    const { id } = await params
    const listingId = parseInt(id)

    if (isNaN(listingId)) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 })
    }

    // Rate limit: 20 updates per hour
    const rateLimit = checkRateLimit(`update-listing-${session.userId}`, {
      limit: 20,
      windowMs: 60 * 60 * 1000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many update requests' }, { status: 429 })
    }

    // Check ownership
    const existingListing = await prisma.listing.findUnique({ where: { id: listingId } })

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (existingListing.userId !== session.userId) {
      securityLogger.log({
        type: SecurityEventType.UNAUTHORIZED_ACCESS,
        ...requestInfo,
        userId: session.userId,
        details: { action: 'update_listing', listingId, ownerId: existingListing.userId }
      })
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const data = await request.json()

    // 🟢 VALIDATE SUBCATEGORIES (New Array Logic)
    if (!Array.isArray(data.subCategories) || data.subCategories.length === 0) {
      return NextResponse.json({ error: 'At least one subcategory is required' }, { status: 400 })
    }

    // Sanitize Subcategories array
    const sanitizedSubCategories = data.subCategories
      .map((s: any) => String(s).trim().slice(0, 100))
      .filter((s: string) => s.length > 0);

    // Validate email
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    // Validate phone
    const phoneValidation = validatePhone(data.call)
    if (!phoneValidation.valid) {
      return NextResponse.json({ error: phoneValidation.error }, { status: 400 })
    }

    // Validate website
    if (data.website) {
      const urlValidation = validateUrl(data.website)
      if (!urlValidation.valid) {
        return NextResponse.json({ error: urlValidation.error }, { status: 400 })
      }
    }

    // Validate categories
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
      return NextResponse.json({ error: 'At least one category is required' }, { status: 400 })
    }

    // Sanitize text fields
    const sanitizedData = {
      title: sanitizeString(data.title, 200),
      slug: data.slug.toLowerCase().replace(/[^a-z0-9\-]/g, '').slice(0, 200),
      desc: sanitizeString(data.desc, 500),
      email: emailValidation.sanitized!,
      call: phoneValidation.sanitized!,
      website: data.website ? validateUrl(data.website).sanitized : '',
      city: sanitizeString(data.city, 100),
      location: sanitizeString(data.location, 300),
    }

    // Check duplicate slug
    const duplicateSlug = await prisma.listing.findFirst({
      where: {
        slug: sanitizedData.slug,
        id: { not: listingId }
      }
    })

    if (duplicateSlug) {
      return NextResponse.json({ error: 'A listing with this slug already exists' }, { status: 409 })
    }

    // Process location
    const locationData = processLocationData(sanitizedData.city, data.locationConfirmation)

    // 🆕 SAFE FIELDS - These can be updated without requiring re-approval
    const safeFields = ['faqs', 'enableFaqs', 'reviews', 'enableReviews', 'tags', 'socials', 'workingHours', 'contentBlocks', 'contentSectionTitle']

    // Check if only safe fields are being changed
    const coreFieldsChanged = (
      sanitizedData.title !== existingListing.title ||
      sanitizedData.slug !== existingListing.slug ||
      sanitizedData.desc !== existingListing.desc ||
      sanitizedData.city !== existingListing.city ||
      sanitizedData.location !== existingListing.location ||
      sanitizedData.email !== existingListing.email ||
      sanitizedData.call !== existingListing.call ||
      sanitizedData.website !== existingListing.website ||
      JSON.stringify(data.categories) !== JSON.stringify(existingListing.categories) ||
      JSON.stringify(sanitizedSubCategories) !== JSON.stringify(existingListing.subCategories) ||
      JSON.stringify(data.fullDescription) !== JSON.stringify(existingListing.fullDescription) ||
      JSON.stringify(data.locations) !== JSON.stringify(existingListing.locations) ||
      data.logo !== existingListing.logo ||
      data.image !== existingListing.image ||
      data.bannerImage !== existingListing.bannerImage ||
      data.ghlFormUrl !== existingListing.ghlFormUrl
    )

    // Only require re-approval if core fields changed
    const requiresReApproval = coreFieldsChanged && existingListing.approved

    // 🆕 Delete old Cloudinary images if new ones are uploaded
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

    // Delete old images in background (don't wait)
    if (imagesToDelete.length > 0) {
      Promise.allSettled(imagesToDelete.map(url => deleteCloudinaryImage(url)))
        .then(results => console.log('Cloudinary cleanup results:', results))
        .catch(err => console.error('Cloudinary cleanup error:', err))
    }

    // Update in Database
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        slug: sanitizedData.slug,
        title: sanitizedData.title,
        desc: sanitizedData.desc,
        logo: data.logo || existingListing.logo,
        image: data.image || existingListing.image,
        bannerImage: data.bannerImage || existingListing.bannerImage,
        city: sanitizedData.city,
        location: sanitizedData.location,
        isGlobal: locationData.isGlobal,
        locationVerified: locationData.locationVerified,
        locationDetection: locationData.locationDetection,
        locationConfirmation: data.locationConfirmation || null,

        // 🟢 Save Array
        subCategories: sanitizedSubCategories,
        ghlFormUrl: data.ghlFormUrl ? validateUrl(data.ghlFormUrl).sanitized : null,


        call: sanitizedData.call,
        email: sanitizedData.email,
        website: sanitizedData.website,
        categories: data.categories,
        fullDescription: data.fullDescription || [],
        locations: data.locations || [],
        contentSectionTitle: data.contentSectionTitle || '',
        contentBlocks: data.contentBlocks || [],
        workingHours: data.workingHours || [],
        tags: Array.isArray(data.tags) ? data.tags.slice(0, 20) : [],
        socials: data.socials || {},
        seo: data.seo || {},
        // 🆕 FAQs and Reviews
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
        enableFaqs: Boolean(data.enableFaqs),
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
        enableReviews: Boolean(data.enableReviews),
        // 🆕 Only reset approval if core fields changed
        ...(requiresReApproval ? { approved: false, statusText: 'Pending Re-approval' } : {}),
        updatedAt: new Date(),
      },
    })

    securityLogger.log({
      type: SecurityEventType.AUTH_SUCCESS,
      ...requestInfo,
      userId: session.userId,
      details: { action: 'update_listing', listingId: listing.id, requiresReApproval }
    })

    // 🆕 Revalidate cache so changes appear immediately
    const primaryCategory = (listing.categories as any[])?.find(c => c.isPrimary)?.slug || (listing.categories as any[])?.[0]?.slug
    if (primaryCategory && listing.slug) {
      revalidatePath(`/listings/${primaryCategory}/${listing.slug}`)
      revalidatePath(`/global-listings/${primaryCategory}/${listing.slug}`)
    }
    revalidatePath('/listings')
    revalidatePath('/global-listings')

    return NextResponse.json({
      success: true,
      listing,
      message: requiresReApproval
        ? 'Listing updated. Core content changed - requires admin re-approval.'
        : 'Listing updated successfully! No re-approval needed for these changes.'
    })

  } catch (error: unknown) {
    securityLogger.log({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      ...requestInfo,
      details: { action: 'update_listing_failed', error: error instanceof Error ? error.message : 'Unknown error' }
    })
    return handleApiError(error, 'PUT /api/listings/[id]')
  }
}

// 3. DELETE LISTING
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestInfo = getRequestInfo(request)
  try {
    const session = await requireAuth() as { userId?: number | string }
    const { id } = await params
    const listingId = parseInt(id)

    if (isNaN(listingId)) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 })
    }

    const rateLimit = checkRateLimit(`delete-listing-${session.userId}`, {
      limit: 10,
      windowMs: 60 * 60 * 1000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many delete requests' }, { status: 429 })
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.userId !== session.userId) {
      securityLogger.log({
        type: SecurityEventType.UNAUTHORIZED_ACCESS,
        ...requestInfo,
        userId: session.userId,
        details: { action: 'delete_listing', listingId, ownerId: listing.userId }
      })
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await prisma.listing.delete({ where: { id: listingId } })

    securityLogger.log({
      type: SecurityEventType.AUTH_SUCCESS,
      ...requestInfo,
      userId: session.userId,
      details: { action: 'delete_listing', listingId, title: listing.title }
    })

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' })
  } catch (error: unknown) {
    return handleApiError(error, 'DELETE /api/listings/[id]')
  }
}