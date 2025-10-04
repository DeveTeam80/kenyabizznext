import { MetadataRoute } from 'next'
import { seoConfig } from '../../seo/config'

export default function robots(): MetadataRoute.Robots {
  const base = seoConfig.siteUrl

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/dashboard', '/_next', '/search?*']
    },
    sitemap: `${base}/sitemap.xml`,
    host: base
  }
}


