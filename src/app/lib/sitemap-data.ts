// src/app/lib/sitemap-data.ts
import prisma from '@/app/lib/db'
import { Prisma } from '@prisma/client'

interface Category {
  name: string
  slug: string
  isPrimary?: boolean
}

export async function getListingsForSitemap(categorySlug?: string) {
  try {
    const where: any = {
      approved: true,
    }

    const listings = await prisma.listing.findMany({
      where,
      select: {
        slug: true,
        isGlobal: true,
        isVerified: true,
        updatedAt: true,
        categories: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Parse JSON categories and filter if needed
    let filteredListings = listings.map(listing => ({
      ...listing,
      categories: Array.isArray(listing.categories) 
        ? (listing.categories as unknown as Category[])
        : [],
    }))

    // Filter by category if specified
    if (categorySlug && categorySlug !== 'all') {
      filteredListings = filteredListings.filter(listing =>
        listing.categories.some((cat: Category) => cat.slug === categorySlug)
      )
    }

    return filteredListings
  } catch (error) {
    console.error('Error fetching listings for sitemap:', error)
    return []
  }
}

export async function getCategoriesForSitemap() {
  try {
    // Get all approved listings to extract unique categories
    const listings = await prisma.listing.findMany({
      where: {
        approved: true,
      },
      select: {
        categories: true,
      },
    })

    // Extract and deduplicate categories
    const categoryMap = new Map<string, { value: string; label: string }>()

    listings.forEach(listing => {
      const categories = Array.isArray(listing.categories) 
        ? (listing.categories as unknown as Category[])
        : []

      categories.forEach((cat: Category) => {
        if (cat.slug && !categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, {
            value: cat.slug,
            label: cat.name,
          })
        }
      })
    })

    // Convert to array and sort
    return Array.from(categoryMap.values()).sort((a, b) => 
      a.label.localeCompare(b.label)
    )
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
    return []
  }
}