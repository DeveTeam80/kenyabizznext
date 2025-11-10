// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { seoConfig } from '../../seo/config'
import { getListingsForSitemap, getCategoriesForSitemap } from '@/app/lib/sitemap-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = seoConfig.siteUrl.replace(/\/$/, '')

  // Core pages
  const corePages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/listings', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/global-listings', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/add-listing', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/about-us', priority: 0.6, changeFrequency: 'monthly' as const },
    // { path: '/contact-us', priority: 0.6, changeFrequency: 'monthly' as const },
    // { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' as const },
    // { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const }
  ]

  const categories = await getCategoriesForSitemap()
  const categoryPages = categories.map(c => ({
    path: `/listings/${c.value}`,
    priority: 0.8,
    changeFrequency: 'daily' as const
  }))

  // Get all listings at once
  const allListings = await getListingsForSitemap()

  // Map listings to sitemap entries
  const individualListings = allListings.map(listing => {
    const primaryCategory = listing.categories.find(cat => cat.isPrimary)
    const category = primaryCategory || listing.categories[0]
    const baseUrl = listing.isGlobal ? '/global-listings' : '/listings'
    
    return {
      path: `${baseUrl}/${category?.slug || 'uncategorized'}/${listing.slug}`,
      priority: listing.isVerified ? (listing.isGlobal ? 0.6 : 0.7) : 0.5,
      changeFrequency: (listing.isVerified ? 'weekly' : 'monthly') as 'weekly' | 'monthly'
    }
  })

  const now = new Date()

  return [...corePages, ...categoryPages, ...individualListings].map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path || '/'}`,
    lastModified: now,
    changeFrequency,
    priority
  }))
}