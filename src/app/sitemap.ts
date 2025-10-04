import { MetadataRoute } from 'next'
import { seoConfig } from '../../seo/config'
import { getSearchCategories, getListings, ListingContext } from '@/app/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = seoConfig.siteUrl.replace(/\/$/, '')

  // Core pages
  const corePages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/listings', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/global-listings', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/add-listing', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/about-us', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact-us', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const }
  ]

  const categories = await getSearchCategories()
  const categoryPages = categories
    .filter(c => c.value !== 'all')
    .map(c => ({
      path: `/listings/${c.value}`,
      priority: 0.8,
      changeFrequency: 'daily' as const
    }))

  // Individual listings with proper priority based on verification status
  const individualListings: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }> = []
  
  for (const c of categories.filter(c => c.value !== 'all')) {
    const [local, global] = await Promise.all([
      getListings(ListingContext.LOCAL, {}, 1, 1000, c.value),
      getListings(ListingContext.GLOBAL, {}, 1, 1000, c.value)
    ])
    
    // Local listings (higher priority)
    local.listings.forEach(l => {
      individualListings.push({
        path: `/listings/${c.value}/${l.slug}`,
        priority: l.isVerified ? 0.7 : 0.6,
        changeFrequency: l.isVerified ? 'weekly' : 'monthly'
      })
    })
    
    // Global listings
    global.listings.forEach(l => {
      individualListings.push({
        path: `/global-listings/${c.value}/${l.slug}`,
        priority: l.isVerified ? 0.6 : 0.5,
        changeFrequency: l.isVerified ? 'weekly' : 'monthly'
      })
    })
  }

  const now = new Date()

  return [...corePages, ...categoryPages, ...individualListings].map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path || '/'}`,
    lastModified: now,
    changeFrequency,
    priority
  }))
}


