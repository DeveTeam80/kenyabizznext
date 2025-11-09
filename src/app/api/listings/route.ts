// src/app/api/listings/route.ts
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

export async function POST(request: NextRequest) {
  const requestInfo = getRequestInfo(request)
  const identifier = getIdentifier(request)

  try {
    // 🔒 1. CHECK AUTHENTICATION
    const session = await requireAuth() as { userId: number }

    // 🔒 2. CHECK RATE LIMIT (10 listings per hour per user)
    const rateLimit = checkRateLimit(`create-listing-${session.userId}`, {
      limit: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 30 * 60 * 1000 // Block for 30 minutes
    })

    if (!rateLimit.allowed) {
      securityLogger.log({
        type: SecurityEventType.RATE_LIMIT_EXCEEDED,
        ...requestInfo,
        userId: session.userId,
        details: { action: 'create_listing' }
      })

      return NextResponse.json(
        { error: 'Too many listings created. Please try again later.' },
        { status: 429 }
      )
    }

    // 🔒 3. PARSE AND VALIDATE INPUT
    const data = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'slug', 'desc', 'city', 'location', 'call', 'email']
    const missingFields = requiredFields.filter(field => !data[field])

    if (missingFields.length > 0) {
      securityLogger.log({
        type: SecurityEventType.INVALID_INPUT,
        ...requestInfo,
        userId: session.userId,
        details: { missingFields }
      })

      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // 🔒 4. VALIDATE SUBCATEGORY
    const subCategoryValidation = validateSubCategory(data.subCategory)
    if (!subCategoryValidation.valid) {
      securityLogger.log({
        type: SecurityEventType.INVALID_INPUT,
        ...requestInfo,
        userId: session.userId,
        details: { 
          field: 'subCategory', 
          error: subCategoryValidation.error,
          value: data.subCategory 
        }
      })

      return NextResponse.json(
        { error: subCategoryValidation.error },
        { status: 400 }
      )
    }

    // 🔒 5. VALIDATE EMAIL
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // 🔒 6. VALIDATE PHONE
    const phoneValidation = validatePhone(data.call)
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      )
    }

    // 🔒 7. VALIDATE WEBSITE (OPTIONAL)
    if (data.website) {
      const urlValidation = validateUrl(data.website)
      if (!urlValidation.valid) {
        return NextResponse.json(
          { error: urlValidation.error },
          { status: 400 }
        )
      }
    }

    // 🔒 8. VALIDATE CATEGORIES
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

    // Check if at least one category is marked as primary
    const hasPrimary = data.categories.some((cat: any) => cat.isPrimary)
    if (!hasPrimary) {
      data.categories[0].isPrimary = true
    }

    // 🔒 9. SANITIZE TEXT FIELDS
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

    // 🔒 10. CHECK FOR DUPLICATE SLUG
    const existingListing = await prisma.listing.findUnique({
      where: { slug: sanitizedData.slug }
    })

    if (existingListing) {
      return NextResponse.json(
        { error: 'A listing with this slug already exists. Please choose a different business name.' },
        { status: 409 }
      )
    }

    // 🔒 11. PROCESS LOCATION DATA
    const locationData = processLocationData(sanitizedData.city, data.locationConfirmation)

    // 🔒 12. CREATE LISTING
    const listing = await prisma.listing.create({
      data: {
        userId: session.userId as number,
        slug: sanitizedData.slug,
        title: sanitizedData.title,
        desc: sanitizedData.desc,
        logo: data.logo || '/img/logo-3.png',
        image: data.image || '/img/list-1.jpg',
        bannerImage: data.bannerImage || '/img/banner-1.jpg',
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
        categories: data.categories || [],
        fullDescription: data.fullDescription || [],
        locations: data.locations || [],
        contentSectionTitle: data.contentSectionTitle || '',
        contentBlocks: data.contentBlocks || [],
        workingHours: data.workingHours || [],
        tags: Array.isArray(data.tags) ? data.tags.slice(0, 20) : [], // Max 20 tags
        socials: data.socials || {},
        seo: data.seo || {},
        approved: false,
        isVerified: false,
        featured: false,
        statusText: 'Pending Approval',
      },
    })

    // Log successful creation
    securityLogger.log({
      type: SecurityEventType.AUTH_SUCCESS,
      ...requestInfo,
      userId: session.userId,
      details: { 
        action: 'create_listing',
        listingId: listing.id,
        slug: listing.slug
      }
    })

    return NextResponse.json({
      success: true,
      listing,
      message: 'Listing created successfully. Awaiting admin approval.'
    }, {
      status: 201,
      headers: {
        'X-Content-Type-Options': 'nosniff'
      }
    })

  } catch (error: any) {
    console.error('Create listing error:', error)

    securityLogger.log({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      ...requestInfo,
      details: { 
        action: 'create_listing_failed',
        error: error.message 
      }
    })

    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: 500 }
    )
  }
}

// 🔒 SECURE GET ENDPOINT
export async function GET(request: NextRequest) {
  const requestInfo = getRequestInfo(request)
  const identifier = getIdentifier(request)

  try {
    const session = await requireAuth()

    // Rate limit: 60 requests per minute per user
    const rateLimit = checkRateLimit(`get-listings-${session.userId}`, {
      limit: 60,
      windowMs: 60000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const listings = await prisma.listing.findMany({
      where: { userId: session.userId as number },
      orderBy: { createdAt: 'desc' },
      take: 100, // Max 100 listings per request
    })

    // Apply default images for empty fields
    const listingsWithDefaults = listings.map(listing => ({
      ...listing,
      logo: listing.logo || '/img/logo-3.png',
      image: listing.image || '/img/list-1.jpg',
      bannerImage: listing.bannerImage || '/img/banner-1.jpg',
    }))

    return NextResponse.json(
      { listings: listingsWithDefaults },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, max-age=60'
        }
      }
    )

  } catch (error: any) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}