// src/app/lib/data.ts
/**
 * Data access layer - now uses database APIs internally
 * This maintains backward compatibility with existing pages
 */
/**
 * Data access layer - now uses database APIs internally
 * This maintains backward compatibility with existing pages
 */

export interface FilterParams {
  subCategory?: string
  city?: string
  rating?: string
  featured?: boolean
  verified?: boolean
  search?: string
}

interface CategoryDetails {
  name: string
  description: string
}

export enum ListingContext {
  LOCAL = 'local',
  GLOBAL = 'global',
  ALL = 'all'
}

// 🔥 Helper to get base URL
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// 🔥 Main function to get listings from database
export async function getListings(
  context: ListingContext,
  filters: FilterParams = {},
  page: number = 1,
  itemsPerPage: number = 9,
  categorySlug?: string
): Promise<{ listings: any[], totalPages: number, totalItems: number }> {
  try {
    const baseUrl = getBaseUrl()
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      context: context === ListingContext.ALL ? 'all' : context,
      ...(categorySlug && { category: categorySlug }),
      ...(filters.subCategory && { subCategory: filters.subCategory }),
      ...(filters.city && { city: filters.city }),
      ...(filters.search && { search: filters.search }),
      ...(filters.featured && { featured: 'true' }),
    })

    const res = await fetch(`${baseUrl}/api/listings/public?${params}`, {
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('Failed to fetch listings from API')
      return { listings: [], totalPages: 0, totalItems: 0 }
    }

    const data = await res.json()
    
    return {
      listings: data.listings || [],
      totalPages: data.pagination?.totalPages || 0,
      totalItems: data.pagination?.totalCount || 0
    }
  } catch (error) {
    console.error('Error fetching listings:', error)
    return { listings: [], totalPages: 0, totalItems: 0 }
  }
}

// src/app/lib/data.ts

// 🔥 FIX: Update to use new API path
export async function getListingBySlug(
  categorySlug: string,
  listingSlug: string,
  context: ListingContext = ListingContext.LOCAL
): Promise<any | null> {
  try {
    const baseUrl = getBaseUrl()
    
    // 🔥 NEW PATH: /api/listings/by-slug/[cat]/[slug]
    const res = await fetch(
      `${baseUrl}/api/listings/by-slug/${categorySlug}/${listingSlug}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) return null

    const data = await res.json()
    return data.listing || data || null
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

// 🔥 FIX: Get related listings (same as before, this one is fine)
export async function getRelatedListings(
  categorySlug: string,
  currentListingSlug: string,
  limit: number = 3,
  context: ListingContext = ListingContext.LOCAL
): Promise<any[]> {
  try {
    const baseUrl = getBaseUrl()
    const contextParam = context === ListingContext.GLOBAL ? 'global' : 'local'
    
    const params = new URLSearchParams({
      context: contextParam,
      category: categorySlug,
      limit: '10',
    })
    
    const res = await fetch(`${baseUrl}/api/listings/public?${params}`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) return []

    const data = await res.json()
    
    const relatedListings = (data.listings || [])
      .filter((listing: any) => listing.slug !== currentListingSlug)
      .slice(0, limit)
    
    return relatedListings
  } catch (error) {
    console.error('Error fetching related listings:', error)
    return []
  }
}

// 🔥 Get category details from database
export async function getCategoryDetails(
  slug: string,
  context: ListingContext = ListingContext.LOCAL
): Promise<CategoryDetails> {
  try {
    const baseUrl = getBaseUrl()
    const contextParam = context === ListingContext.GLOBAL ? 'global' : 'local'
    
    const res = await fetch(
      `${baseUrl}/api/categories?context=${contextParam}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      return {
        name: slug,
        description: `Find trusted businesses in ${slug}`
      }
    }

    const data = await res.json()
    const category = data.categories?.find((c: any) => c.slug === slug)

    if (category) {
      return {
        name: category.name,
        description: `Find your perfect partner from our curated list of trusted companies in ${category.name}.`
      }
    }

    return {
      name: slug,
      description: `Find trusted businesses in ${slug}`
    }
  } catch (error) {
    console.error('Error fetching category details:', error)
    return {
      name: slug,
      description: `Find trusted businesses in ${slug}`
    }
  }
}

// 🔥 Get subcategories from database
export async function getSubCategories(
  categorySlug?: string,
  context: ListingContext = ListingContext.LOCAL
): Promise<string[]> {
  try {
    const baseUrl = getBaseUrl()
    
    // Get all listings for this category to extract subcategories
    const params = new URLSearchParams({
      context: context === ListingContext.GLOBAL ? 'global' : 'local',
      limit: '100',
      ...(categorySlug && { category: categorySlug })
    })

    const res = await fetch(`${baseUrl}/api/listings/public?${params}`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) return []

    const data = await res.json()
    // ✅ FIX: Cast the resulting array to string[]
    const subCategories = [...new Set(
      data.listings?.map((l: any) => l.subCategory).filter(Boolean) || []
    )] as string[]

    return subCategories.sort()
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    return []
  }
}

// 🔥 Get cities from database
export async function getCities(
  categorySlug?: string,
  context: ListingContext = ListingContext.LOCAL
): Promise<string[]> {
  try {
    const baseUrl = getBaseUrl()
    const contextParam = context === ListingContext.GLOBAL ? 'global' : 'local'
    
    if (categorySlug) {
      // Get cities for specific category
      const params = new URLSearchParams({
        context: contextParam,
        category: categorySlug,
        limit: '100'
      })

      const res = await fetch(`${baseUrl}/api/listings/public?${params}`, {
        next: { revalidate: 300 }
      })

      if (!res.ok) return []

      const data = await res.json()
      // ✅ FIX: Cast the resulting array to string[]
      const cities = [...new Set(
        data.listings?.map((l: any) => l.city).filter(Boolean) || []
      )] as string[]

      return cities.sort()
    } else {
      // Get all cities
      const res = await fetch(`${baseUrl}/api/cities?context=${contextParam}`, {
        next: { revalidate: 300 }
      })

      if (!res.ok) return []

      const data = await res.json()
      // ✅ FIX: Cast the resulting array to string[] and add sort() for consistency
      const cities = (data.cities?.map((c: any) => c.city) || []) as string[]
      return cities.sort()
    }
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

// ============================================================================
// BACKWARD COMPATIBILITY FUNCTIONS
// ============================================================================

export async function getAllListings(filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.LOCAL, filters, page, itemsPerPage)
}

export async function getGlobalListings(filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.GLOBAL, filters, page, itemsPerPage)
}

export async function getListingsByCategory(categorySlug: string, filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.LOCAL, filters, page, itemsPerPage, categorySlug)
}

export async function getGlobalListingsByCategory(categorySlug: string, filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.GLOBAL, filters, page, itemsPerPage, categorySlug)
}

export async function getAllSubCategories() {
  return getSubCategories(undefined, ListingContext.LOCAL)
}

export async function getAllCities() {
  return getCities(undefined, ListingContext.LOCAL)
}

export async function getSubCategoriesByCategory(categorySlug: string) {
  return getSubCategories(categorySlug, ListingContext.LOCAL)
}

export async function getCitiesByCategory(categorySlug: string) {
  return getCities(categorySlug, ListingContext.LOCAL)
}

export async function getGlobalSubCategories() {
  return getSubCategories(undefined, ListingContext.GLOBAL)
}

export async function getGlobalCitiesByCategory(categorySlug: string) {
  return getCities(categorySlug, ListingContext.GLOBAL)
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

export interface SearchFilters extends FilterParams {
  query?: string
  location?: string
  category?: string
}

export async function searchListings(
  filters: SearchFilters = {},
  page: number = 1,
  itemsPerPage: number = 9,
  context: ListingContext = ListingContext.LOCAL
): Promise<{ listings: any[], totalPages: number, totalItems: number }> {
  try {
    const baseUrl = getBaseUrl()
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      context: context === ListingContext.ALL ? 'all' : context,
      ...(filters.category && filters.category !== 'all' && { category: filters.category }),
      ...(filters.location && filters.location !== 'all-kenya' && { city: filters.location }),
      ...(filters.query && { search: filters.query }),
      ...(filters.subCategory && { subCategory: filters.subCategory }),
      ...(filters.city && { city: filters.city }),
      ...(filters.featured && { featured: 'true' }),
    })

    const res = await fetch(`${baseUrl}/api/listings/public?${params}`, {
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      return { listings: [], totalPages: 0, totalItems: 0 }
    }

    const data = await res.json()
    
    return {
      listings: data.listings || [],
      totalPages: data.pagination?.totalPages || 0,
      totalItems: data.pagination?.totalCount || 0
    }
  } catch (error) {
    console.error('Error searching listings:', error)
    return { listings: [], totalPages: 0, totalItems: 0 }
  }
}

// 🔥 Get categories for search dropdown
export async function getSearchCategories(): Promise<Array<{value: string, label: string}>> {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/categories?context=local`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      return [{ value: 'all', label: 'All Categories' }]
    }

    const data = await res.json()
    
    const categories = [
      { value: 'all', label: 'All Categories' },
      ...(data.categories?.map((cat: any) => ({
        value: cat.slug,
        label: cat.name
      })) || [])
    ]

    return categories.sort((a, b) => a.label.localeCompare(b.label))
  } catch (error) {
    console.error('Error fetching search categories:', error)
    return [{ value: 'all', label: 'All Categories' }]
  }
}

// 🔥 Get locations for search dropdown
export async function getSearchLocations(): Promise<Array<{value: string, label: string}>> {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/cities?context=local`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      return [{ value: 'all-kenya', label: 'All Kenya' }]
    }

    const data = await res.json()
    
    const locations = [
      { value: 'all-kenya', label: 'All Kenya' },
      ...(data.cities?.map((city: any) => ({
        value: city.city.toLowerCase(),
        label: city.city
      })) || [])
    ]

    return locations.sort((a, b) => a.label.localeCompare(b.label))
  } catch (error) {
    console.error('Error fetching search locations:', error)
    return [{ value: 'all-kenya', label: 'All Kenya' }]
  }
}