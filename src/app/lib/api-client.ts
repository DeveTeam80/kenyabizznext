// src/app/lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function fetchListings(params: {
  context?: 'local' | 'global' | 'all'
  category?: string
  subCategory?: string
  city?: string
  search?: string
  featured?: boolean
  page?: number
  limit?: number
}) {
  try {
    const searchParams = new URLSearchParams()
    
    if (params.context) searchParams.append('context', params.context)
    if (params.category) searchParams.append('category', params.category)
    if (params.subCategory) searchParams.append('subCategory', params.subCategory)
    if (params.city) searchParams.append('city', params.city)
    if (params.search) searchParams.append('search', params.search)
    if (params.featured) searchParams.append('featured', 'true')
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const res = await fetch(`${BASE_URL}/api/listings/public?${searchParams}`, {
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch listings')
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching listings:', error)
    return { listings: [], pagination: { page: 1, totalPages: 0, totalCount: 0 } }
  }
}

export async function fetchListing(categorySlug: string, listingSlug: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/listings/public/${categorySlug}/${listingSlug}`,
      { cache: 'no-store', next: { revalidate: 300 } }
    )

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

export async function fetchCategories(context: 'local' | 'global' = 'local') {
  try {
    const res = await fetch(`${BASE_URL}/api/categories?context=${context}`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function fetchCities(context: 'local' | 'global' = 'local') {
  try {
    const res = await fetch(`${BASE_URL}/api/cities?context=${context}`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.cities?.map((c: any) => c.city) || []
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

export async function fetchSubCategories(categories?: string) {
  try {
    const url = categories 
      ? `${BASE_URL}/api/subcategories?categories=${categories}&limit=50`
      : `${BASE_URL}/api/subcategories?limit=50`

    const res = await fetch(url, {
      cache: 'no-store'
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.subCategories?.map((s: any) => s.value) || []
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    return []
  }
}