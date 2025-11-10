// src/app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAuth } from '@/app/lib/auth'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'
import { 
  validateSubCategory, 
  validateEmail, 
  validatePhone, 
  validateUrl,
  sanitizeString 
} from '@/app/lib/validators'
import { securityLogger, SecurityEventType, getRequestInfo } from '@/app/lib/security-logger'
import { processLocationData } from '@/app/lib/location-detection'

// GET single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id:string }> }
) {
  try {
    const session = await requireAuth() as { userId?: number | string }
    const { id } = await params
    const listingId = parseInt(id)
    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (listing.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({ listing })

  } catch (error: any) {
    console.error('Get listing error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

// UPDATE listing
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
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      )
    }

    // Rate limit: 20 updates per hour per user
    const rateLimit = checkRateLimit(`update-listing-${session.userId}`, {
      limit: 20,
      windowMs: 60 * 60 * 1000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many update requests' },
        { status: 429 })
}
// Check if listing exists and user owns it
const existingListing = await prisma.listing.findUnique({
  where: { id: listingId }
})

if (!existingListing) {
  return NextResponse.json(
    { error: 'Listing not found' },
    { status: 404 }
  )
}

if (existingListing.userId !== session.userId) {
  securityLogger.log({
    type: SecurityEventType.UNAUTHORIZED_ACCESS,
    ...requestInfo,
    userId: session.userId,
    details: { 
      action: 'update_listing',
      listingId,
      ownerId: existingListing.userId
}
  })

  return NextResponse.json(
    { error: 'Access denied' },
    { status: 403 }
  )
}

const data = await request.json()

// Validate subcategory
const subCategoryValidation = validateSubCategory(data.subCategory)
if (!subCategoryValidation.valid) {
  return NextResponse.json(
    { error: subCategoryValidation.error },
    { status: 400 }
  )
}

// Validate email
const emailValidation = validateEmail(data.email)
if (!emailValidation.valid) {
  return NextResponse.json(
    { error: emailValidation.error },
    { status: 400 }
  )
}

// Validate phone
const phoneValidation = validatePhone(data.call)
if (!phoneValidation.valid) {
  return NextResponse.json(
    { error: phoneValidation.error },
    { status: 400 }
  )
}

// Validate website (optional)
if (data.website) {
  const urlValidation = validateUrl(data.website)
  if (!urlValidation.valid) {
    return NextResponse.json(
      { error: urlValidation.error },
      { status: 400 }
    )
  }
}

// Validate categories
if (!Array.isArray(data.categories) || data.categories.length === 0) {
  return NextResponse.json(
    { error: 'At least one category is required' },
    { status: 400 }
  )
}

if (data.categories.length > 5) {
  return NextResponse.json(
    { error: 'Maximum 5 categories allowed' },
    { status: 400 }
  )
}

// Sanitize data
const sanitizedData = {
  title: sanitizeString(data.title, 200),
  slug: data.slug.toLowerCase().replace(/[^a-z0-9\-]/g, '').slice(0, 200),
  desc: sanitizeString(data.desc, 500),
  subCategory: subCategoryValidation.sanitized!,
  email: emailValidation.sanitized!,
  call: phoneValidation.sanitized!,
  website: data.website ? validateUrl(data.website).sanitized : '',
  city: sanitizeString(data.city, 100),
  location: sanitizeString(data.location, 300),
}

// Check for duplicate slug (exclude current listing)
const duplicateSlug = await prisma.listing.findFirst({
  where: { 
    slug: sanitizedData.slug,
    id: { not: listingId }
  }
})

if (duplicateSlug) {
  return NextResponse.json(
    { error: 'A listing with this slug already exists' },
    { status: 409 }
  )
}

// Process location data
const locationData = processLocationData(sanitizedData.city, data.locationConfirmation)

// Update listing
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
    subCategory: sanitizedData.subCategory,
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
    approved: false, // Requires re-approval
    statusText: 'Pending Re-approval',
    updatedAt: new Date(),
  },
})

securityLogger.log({
  type: SecurityEventType.AUTH_SUCCESS,
  ...requestInfo,
  userId: session.userId,
  details: { 
    action: 'update_listing',
    listingId: listing.id
  }
})

return NextResponse.json({
  success: true,
  listing,
  message: 'Listing updated successfully. Requires admin re-approval.'
})
} catch (error: any) {
console.error('Update listing error:', error)
securityLogger.log({
  type: SecurityEventType.SUSPICIOUS_ACTIVITY,
  ...requestInfo,
  details: { 
    action: 'update_listing_failed',
    error: error.message 
  }
})

return NextResponse.json(
  { error: error.message || 'Failed to update listing' },
  { status: 500 }
)
}
}
// DELETE listing
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
  return NextResponse.json(
    { error: 'Invalid listing ID' },
    { status: 400 }
  )
}

// Rate limit: 10 deletes per hour
const rateLimit = checkRateLimit(`delete-listing-${session.userId}`, {
  limit: 10,
  windowMs: 60 * 60 * 1000
})

if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many delete requests' },
    { status: 429 }
  )
}

const listing = await prisma.listing.findUnique({
  where: { id: listingId }
})

if (!listing) {
  return NextResponse.json(
    { error: 'Listing not found' },
    { status: 404 }
  )
}

if (listing.userId !== session.userId) {
  securityLogger.log({
    type: SecurityEventType.UNAUTHORIZED_ACCESS,
    ...requestInfo,
    userId: session.userId,
    details: { 
      action: 'delete_listing',
      listingId,
      ownerId: listing.userId
    }
  })

  return NextResponse.json(
    { error: 'Access denied' },
    { status: 403 }
  )
}

await prisma.listing.delete({
  where: { id: listingId }
})

securityLogger.log({
  type: SecurityEventType.AUTH_SUCCESS,
  ...requestInfo,
  userId: session.userId,
  details: { 
    action: 'delete_listing',
    listingId,
    title: listing.title
  }
})

return NextResponse.json({ 
  success: true,
  message: 'Listing deleted successfully'
})
} catch (error: any) {
console.error('Delete listing error:', error)
return NextResponse.json(
{ error: 'Failed to delete listing' },
{ status: 500 }
)
}
}