// /lib/useSeo.ts
import { Metadata } from 'next';
import metaData from '../seo/meta.json';
import { seoConfig } from '../seo/config';
import { 
  getCategoryDetails, 
  getListingsByCategory, 
  ListingContext, 
  getListings, 
  getListingBySlug 
} from '@/app/lib/data';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MetaDataItem {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  twitterImage?: string;
  author?: string;
  robots?: string;
}

interface MetaDataCollection {
  [key: string]: MetaDataItem;
}

interface SchemaData {
  [key: string]: any;
}

interface CustomSEOData extends Partial<MetaDataItem> {
  businessName?: string;
  businessDescription?: string;
  businessLocation?: string;
  businessCategory?: string;
  businessImages?: string[];
  jsonLd?: any | any[];
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
}

interface Location {
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  mapEmbedUrl?: string;
}

interface WorkingHours {
  day: string;
  hours: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts relative URLs to absolute URLs
 */
export function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${seoConfig.siteUrl}${url}`;
  return `${seoConfig.siteUrl}/${url.replace(/^\/*/, '')}`;
}

/**
 * Extracts geographic coordinates from Google Maps URLs
 */
function extractGeoFromMapUrl(url?: string): { latitude: number; longitude: number } | undefined {
  if (!url) return undefined;
  
  try {
    // Pattern: ll=lat,long
    const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
      return { 
        latitude: parseFloat(llMatch[1]), 
        longitude: parseFloat(llMatch[2]) 
      };
    }
    
    // Pattern: !3dLAT!2dLON
    const latMatch = url.match(/!3d(-?\d+\.\d+)/);
    const lonMatch = url.match(/!2d(-?\d+\.\d+)/);
    if (latMatch && lonMatch) {
      return { 
        latitude: parseFloat(latMatch[1]), 
        longitude: parseFloat(lonMatch[1]) 
      };
    }
    
    // Pattern: q=lat,long
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return { 
        latitude: parseFloat(qMatch[1]), 
        longitude: parseFloat(qMatch[2]) 
      };
    }
  } catch (error) {
    console.warn('Failed to extract geo coordinates from URL:', error);
  }
  
  return undefined;
}

/**
 * Determines the most specific Schema.org business type based on category
 */
function getBusinessType(category?: string): string {
  if (!category) return 'LocalBusiness';
  
  const typeMap: Record<string, string> = {
    'restaurant': 'Restaurant',
    'cafe': 'CafeOrCoffeeShop',
    'hotel': 'LodgingBusiness',
    'hospital': 'Hospital',
    'clinic': 'MedicalClinic',
    'medical': 'MedicalBusiness',
    'automotive': 'AutomotiveBusiness',
    'real-estate': 'RealEstateAgent',
    'retail': 'Store',
    'shop': 'Store',
    'professional-services': 'ProfessionalService',
    'law': 'Attorney',
    'accounting': 'AccountingService',
    'salon': 'BeautySalon',
    'gym': 'HealthClub',
    'fitness': 'SportsActivityLocation',
    'education': 'EducationalOrganization',
    'school': 'School',
  };
  
  const normalized = category.toLowerCase().replace(/[_\s]+/g, '-');
  return typeMap[normalized] || 'LocalBusiness';
}

/**
 * Generates more compelling and SEO-optimized titles
 */
function generateOptimizedTitle(
  businessName: string,
  category: string,
  location: string,
  type: 'listing' | 'category' | 'location' = 'listing'
): string {
  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';
  
  switch (type) {
    case 'listing':
      return `${businessName} in ${location} - ${category} | ${siteName}`;
    case 'category':
      return `Top ${category} in Kenya | Verified Businesses Directory`;
    case 'location':
      return `${location} Business Directory | Local Companies Kenya`;
    default:
      return `${businessName} | ${siteName}`;
  }
}

/**
 * Generates compelling meta descriptions with benefits
 */
function generateMetaDescription(
  businessName: string,
  description: string,
  location: string,
  category?: string
): string {
  const benefits = ['verified business', 'contact details', 'location map'];
  const categoryText = category ? ` ${category}` : '';
  
  const cleanDesc = description.substring(0, 120).trim();
  return `${cleanDesc} in ${location}. Find${categoryText} ${benefits.join(', ')} and more. Connect with ${businessName} today!`;
}

// ============================================================================
// SCHEMA BUILDERS
// ============================================================================

/**
 * Builds a comprehensive Organization/LocalBusiness schema
 */
function buildOrganizationSchema(
  listing: any,
  url: string,
  context: ListingContext = ListingContext.LOCAL
): object {
  const primaryLocation: Location | undefined = 
    Array.isArray(listing.locations) && listing.locations.length > 0 
      ? listing.locations[0] 
      : undefined;

  // Build address
  const address = (primaryLocation?.address || listing.location || listing.city) ? {
    '@type': 'PostalAddress',
    ...(primaryLocation?.address && { streetAddress: primaryLocation.address }),
    ...(listing.location && !primaryLocation?.address && { streetAddress: listing.location }),
    ...(listing.city && { addressLocality: listing.city }),
    addressCountry: 'KE'
  } : undefined;

  // Build telephone
  const telephone = primaryLocation?.phone || listing.call || undefined;

  // Build sameAs array (social links + website)
  const sameAs: string[] = [];
  if (listing.website) sameAs.push(listing.website);
  
  const socials: SocialLinks = listing.socials || {};
  [
    socials.facebook,
    socials.instagram,
    socials.linkedin,
    socials.twitter,
    socials.youtube,
    socials.whatsapp,
    socials.tiktok
  ].forEach((link) => {
    if (link) sameAs.push(link);
  });

  // Build opening hours specification
  const openingHoursSpecification = 
    Array.isArray(listing.workingHours) && listing.workingHours.length > 0
      ? listing.workingHours.map((h: WorkingHours) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.day,
          opens: (h.hours && h.hours.includes('-')) ? h.hours.split('-')[0].trim() : undefined,
          closes: (h.hours && h.hours.includes('-')) ? h.hours.split('-')[1].trim() : undefined
        }))
      : undefined;

  // Determine organization type
  const orgType = getBusinessType(listing.categories?.[0]?.name || listing.subCategory);
  const isLocalBusiness = context === ListingContext.LOCAL;

  // Build geo coordinates
  const geoCoords = extractGeoFromMapUrl(primaryLocation?.mapEmbedUrl);

  // Build contact point
  const contactPoint = (telephone || primaryLocation?.email) ? {
    '@type': 'ContactPoint',
    contactType: primaryLocation?.contactPerson ? 'sales' : 'customer support',
    ...(telephone && { telephone }),
    ...(primaryLocation?.email && { email: primaryLocation.email }),
    ...(isLocalBusiness && { areaServed: 'KE' }),
    availableLanguage: ['en', 'sw']
  } : undefined;

  // Build offer catalog from content blocks
  const hasOfferCatalog = 
    Array.isArray(listing.contentBlocks) && listing.contentBlocks.length > 0 
      ? {
          '@type': 'OfferCatalog',
          name: listing.contentSectionTitle || 'Our Services',
          itemListElement: listing.contentBlocks.map((block: any) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: block.title,
              description: block.description
            }
          }))
        }
      : undefined;

  // Build keywords/knowsAbout
  const knowsAbout = 
    Array.isArray(listing.tags) && listing.tags.length > 0 
      ? listing.tags 
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': orgType,
    '@id': `${url}#${orgType.toLowerCase()}`,
    name: listing.title,
    url,
    image: toAbsoluteUrl(listing.image),
    logo: toAbsoluteUrl('/img/logo/fav.png'),
    description: listing.fullDescription?.[0] || listing.desc || `${listing.title} - Professional business services in Kenya`,
    ...(address && { address }),
    ...(telephone && { telephone }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(openingHoursSpecification && { openingHoursSpecification }),
    ...(geoCoords && { 
      geo: { 
        '@type': 'GeoCoordinates', 
        latitude: geoCoords.latitude, 
        longitude: geoCoords.longitude 
      } 
    }),
    ...(primaryLocation?.mapEmbedUrl && { hasMap: primaryLocation.mapEmbedUrl }),
    ...(isLocalBusiness && { areaServed: { '@type': 'Country', name: 'Kenya' } }),
    ...(contactPoint && { contactPoint }),
    ...(knowsAbout && { knowsAbout }),
    ...(hasOfferCatalog && { hasOfferCatalog }),
    priceRange: listing.priceRange || undefined,
    ...(listing.isVerified && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'verificationStatus',
        value: 'Verified'
      }
    })
  };
}

/**
 * Builds a ListItem schema for ItemList
 */
function buildListItemSchema(
  listing: any,
  index: number,
  categorySlug: string
): object {
  const url = `${seoConfig.siteUrl}/listings/${categorySlug}/${listing.slug}`;
  const orgSchema = buildOrganizationSchema(listing, url, ListingContext.LOCAL);

  return {
    '@type': 'ListItem',
    position: index + 1,
    item: orgSchema
  };
}

/**
 * Builds BreadcrumbList schema
 */
function buildBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

/**
 * Builds FAQ schema for listings
 */
function buildFAQSchema(listing: any): object | null {
  if (!listing.title || !listing.desc) return null;

  const location = listing.city || listing.location || 'Kenya';
  const category = listing.categories?.[0]?.name || listing.subCategory || 'services';

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What services does ${listing.title} offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: listing.desc || `${listing.title} provides professional ${category} in ${location}.`
        }
      },
      {
        '@type': 'Question',
        name: `Where is ${listing.title} located?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${listing.title} is located in ${location}, Kenya. ${
            listing.locations?.[0]?.address 
              ? `The exact address is ${listing.locations[0].address}.` 
              : ''
          }`
        }
      },
      ...(listing.call || listing.locations?.[0]?.phone ? [{
        '@type': 'Question',
        name: `How can I contact ${listing.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can contact ${listing.title} at ${listing.call || listing.locations[0].phone}.${
            listing.locations?.[0]?.email 
              ? ` You can also email them at ${listing.locations[0].email}.` 
              : ''
          }`
        }
      }] : [])
    ]
  };
}

// ============================================================================
// DYNAMIC SCHEMA AND ROUTE MAPPINGS
// ============================================================================

const schemaMap: Record<string, () => Promise<{ default: SchemaData }>> = {
  '/': () => import('../seo/schema/home.json'),
};

const routeToMetaKey: Record<string, string> = {
  '/': 'home',
  '/listings': 'all-listings',
  '/global-listings': 'global-listings',
  '/add-listing': 'add-listing',
};

// ============================================================================
// MAIN SEO GENERATION FUNCTION
// ============================================================================

export async function generateSEOMetadata(
  pathname: string, 
  customData: CustomSEOData = {}
): Promise<Metadata> {
  const metaKey = routeToMetaKey[pathname] || 'home';
  const typedMetaData = metaData as MetaDataCollection;
  const pageMeta: MetaDataItem = typedMetaData[metaKey] || typedMetaData.home;
  
  // Load schema dynamically
  let schema: SchemaData | null = null;
  if (schemaMap[pathname]) {
    try {
      const schemaModule = await schemaMap[pathname]();
      schema = schemaModule.default;
    } catch (error) {
      console.warn(`Failed to load schema for ${pathname}:`, error);
    }
  }

  const finalMeta: MetaDataItem = { ...pageMeta, ...customData };
  
  // Handle keywords array conversion
  const keywords = finalMeta.keywords ? 
    (Array.isArray(finalMeta.keywords) 
      ? finalMeta.keywords 
      : finalMeta.keywords.split(',').map(k => k.trim())
    ) : [];

  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';

  const metadata: Metadata = {
    metadataBase: new URL(seoConfig.siteUrl),
    title: finalMeta.title,
    description: finalMeta.description,
    keywords: keywords,
    authors: [{ name: finalMeta.author || seoConfig.defaultAuthor }],
    creator: finalMeta.author || seoConfig.defaultAuthor,
    publisher: seoConfig.defaultAuthor,
    robots: finalMeta.robots || 'index, follow',
    
    alternates: {
      canonical: finalMeta.canonical || `${seoConfig.siteUrl}${pathname}`,
    },

    icons: {
      icon: '/img/logo/fav.png',
      shortcut: '/img/logo/fav.png',
      apple: '/img/logo/fav.png',
    },

    openGraph: {
      title: finalMeta.ogTitle || finalMeta.title,
      description: finalMeta.ogDescription || finalMeta.description,
      url: finalMeta.canonical || `${seoConfig.siteUrl}${pathname}`,
      siteName,
      images: [
        {
          url: toAbsoluteUrl(finalMeta.ogImage) || seoConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: finalMeta.ogTitle || finalMeta.title,
        },
      ],
      locale: seoConfig.defaultLocale,
      type: (finalMeta.ogType as any) || 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: finalMeta.title,
      description: finalMeta.description,
      images: [toAbsoluteUrl(finalMeta.twitterImage || finalMeta.ogImage) || seoConfig.defaultOgImage],
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
    },

    verification: {
      google: seoConfig.verification.google,
      other: {
        ...(seoConfig.verification.bing && { 'msvalidate.01': seoConfig.verification.bing }),
      },
    },

    category: customData.businessCategory || 'Business Directory',
    
    ...(schema || customData.jsonLd ? {
      other: {
        'script:ld+json': JSON.stringify(
          Array.isArray(customData.jsonLd)
            ? (schema ? [schema, ...customData.jsonLd] : customData.jsonLd)
            : (customData.jsonLd ? (schema ? [schema, customData.jsonLd] : customData.jsonLd) : schema)
        ),
      },
    } : {}),
  };

  return metadata;
}

// ============================================================================
// SPECIALIZED SEO GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate SEO for business listing pages
 */
export async function generateBusinessSEOMetadata(
  businessName: string,
  businessDescription: string,
  businessLocation: string,
  businessCategory: string,
  businessImages: string[] = [],
  pathname: string = '/business'
): Promise<Metadata> {
  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';
  
  const customData: CustomSEOData = {
    title: generateOptimizedTitle(businessName, businessCategory, businessLocation, 'listing'),
    description: generateMetaDescription(businessName, businessDescription, businessLocation, businessCategory),
    keywords: `${businessName},${businessLocation},${businessCategory},Kenya business,business directory`,
    canonical: `${seoConfig.siteUrl}${pathname}`,
    businessName,
    businessDescription,
    businessLocation,
    businessCategory,
    businessImages,
    ogTitle: `${businessName} in ${businessLocation}`,
    ogDescription: businessDescription,
    ogImage: businessImages[0] || seoConfig.defaultOgImage,
  };

  return generateSEOMetadata(pathname, customData);
}

/**
 * Generate SEO for category pages
 */
export async function generateCategorySEOMetadata(
  categoryName: string,
  categoryDescription: string,
  pathname: string
): Promise<Metadata> {
  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';
  
  const customData: CustomSEOData = {
    title: generateOptimizedTitle(categoryName, categoryName, 'Kenya', 'category'),
    description: `${categoryDescription} Find verified ${categoryName.toLowerCase()} businesses across Kenya.`,
    keywords: `${categoryName} Kenya,${categoryName} directory,Kenya ${categoryName.toLowerCase()}`,
    canonical: `${seoConfig.siteUrl}${pathname}`,
    ogTitle: `${categoryName} Businesses in Kenya`,
    ogDescription: categoryDescription,
  };

  return generateSEOMetadata(pathname, customData);
}

/**
 * Generate SEO for category grid pages with data enrichment
 */
export async function generateCategoryPageSEOMetadata(
  categorySlug: string,
  options: {
    context?: ListingContext;
    pathname?: string;
  } = {}
): Promise<Metadata> {
  const context = options.context ?? ListingContext.LOCAL;
  const pathname = options.pathname ?? `/listings/${categorySlug}`;
  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';

  const { name, description } = await getCategoryDetails(categorySlug, context);

  const [{ totalItems }, top] = await Promise.all([
    getListingsByCategory(categorySlug),
    getListings(ListingContext.LOCAL, {}, 1, 12, categorySlug)
  ]);

  const normalizedName = name;
  const typedMetaData = metaData as MetaDataCollection;
  const preset = (typedMetaData as any)[categorySlug] as MetaDataItem | undefined;

  const fallbackTitle = totalItems > 0
    ? `${normalizedName} in Kenya (${totalItems}+ Listings) | ${siteName}`
    : `${normalizedName} in Kenya | ${siteName}`;
  const fallbackDescription = `${description} Browse ${totalItems > 0 ? `${totalItems}+ ` : ''}verified ${normalizedName.toLowerCase()} across Kenya. Updated regularly with new businesses.`;

  const pageTitle = preset?.title || fallbackTitle;
  const pageDescription = preset?.description || fallbackDescription;

  // Load category-specific JSON-LD schema
  let categorySchema: any | null = null;
  try {
    const module = await import(`../seo/schema/${categorySlug}.json`);
    categorySchema = module.default ?? module;
  } catch {
    // Schema file not found - will use dynamic generation only
  }

  // Build ItemList elements using the consolidated builder
  const itemListElements = (top?.listings || []).map((listing, index) => 
    buildListItemSchema(listing, index, categorySlug)
  );

  // Build comprehensive JSON-LD
  const jsonLd = [
    ...(categorySchema 
      ? (Array.isArray(categorySchema['@graph']) 
          ? categorySchema['@graph'] 
          : [categorySchema]
        ) 
      : []
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDescription,
      url: `${seoConfig.siteUrl}${pathname}`,
      isPartOf: {
        '@type': 'WebSite',
        name: siteName,
        url: seoConfig.siteUrl
      },
      about: {
        '@type': 'Thing',
        name: normalizedName
      }
    },
    buildBreadcrumbSchema([
      { name: 'Home', url: `${seoConfig.siteUrl}/` },
      { name: normalizedName, url: `${seoConfig.siteUrl}${pathname}` }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${seoConfig.siteUrl}${pathname}#${categorySlug}-list`,
      name: `${normalizedName} Listings`,
      description: `Comprehensive directory of ${normalizedName.toLowerCase()} in Kenya`,
      itemListOrder: 'http://schema.org/ItemListOrderAscending',
      numberOfItems: totalItems,
      ...(itemListElements.length > 0 && { itemListElement: itemListElements })
    }
  ];

  return generateSEOMetadata(pathname, {
    title: pageTitle,
    description: pageDescription,
    keywords: `${normalizedName} Kenya,${normalizedName} directory,Kenyan ${normalizedName.toLowerCase()},${normalizedName} companies,best ${normalizedName.toLowerCase()} Kenya`,
    canonical: `${seoConfig.siteUrl}${pathname}`,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    jsonLd
  });
}

/**
 * Generate SEO for individual listing pages
 */
export async function generateListingPageSEOMetadata(
  categorySlug: string,
  listingSlug: string,
  options: {
    context: ListingContext;
    basePath?: '/listings' | '/global-listings';
  }
): Promise<Metadata> {
  const { context } = options;
  const basePath = options.basePath ?? (context === ListingContext.GLOBAL ? '/global-listings' : '/listings');
  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';

  const listing = await getListingBySlug(categorySlug, listingSlug, context);
  
  if (!listing) {
    return generateSEOMetadata(`${basePath}/${categorySlug}/${listingSlug}`, {
      title: `Listing not found | ${siteName}`,
      description: 'The requested listing could not be found.',
      robots: 'noindex, nofollow'
    });
  }

  // Check for SEO overrides
  const seoOverrides = (listing as any).seo || {};
  const typedMetaData = metaData as MetaDataCollection;
  const metaJsonKey = `${basePath}/${categorySlug}/${listingSlug}`;
  const preset = (typedMetaData as any)[metaJsonKey] as MetaDataItem | undefined;

  // Generate optimized metadata
  const location = listing.city || listing.location || 'Kenya';
  const category = listing.categories?.[0]?.name || listing.subCategory || '';
  
  const computedTitle = generateOptimizedTitle(listing.title, category, location, 'listing');
  const title = preset?.title ?? seoOverrides.title ?? computedTitle;
  
  const computedDesc = listing.desc 
    ? generateMetaDescription(listing.title, listing.desc, location, category)
    : `Discover ${listing.title} in ${location}. View details, contacts, and location.`;
  const desc = preset?.description ?? seoOverrides.description ?? computedDesc;
  
  const canonical = preset?.canonical ?? `${seoConfig.siteUrl}${basePath}/${categorySlug}/${listingSlug}`;

  // Load listing-specific JSON-LD if exists
  let listingSchema: any | null = null;
  try {
    const baseDir = context === ListingContext.GLOBAL ? 'global-listings' : 'listings';
    const mod = await import(`../seo/schema/${baseDir}/${categorySlug}/${listingSlug}.json`);
    listingSchema = (mod as any).default ?? mod;
  } catch {
    // No custom schema - will use dynamic generation
  }

  // Build organization schema using consolidated builder
  const orgSchema = buildOrganizationSchema(listing, canonical, context);

  // Build FAQ schema
  const faqSchema = buildFAQSchema(listing);

  // Build breadcrumbs
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: `${seoConfig.siteUrl}/` },
    { 
      name: context === ListingContext.GLOBAL ? 'Global Listings' : 'Listings', 
      url: `${seoConfig.siteUrl}${basePath}` 
    },
    { 
      name: category || categorySlug, 
      url: `${seoConfig.siteUrl}${basePath}/${categorySlug}` 
    },
    { name: listing.title, url: canonical }
  ]);

  const jsonLd = [
    ...(listingSchema 
      ? (Array.isArray((listingSchema as any)['@graph']) 
          ? (listingSchema as any)['@graph'] 
          : [listingSchema]
        ) 
      : []
    ),
    orgSchema,
    breadcrumbSchema,
    ...(faqSchema ? [faqSchema] : [])
  ];

  // Generate rich keywords
  const keywordParts: string[] = [listing.title];
  if (category) keywordParts.push(category);
  if (listing.city) keywordParts.push(listing.city);
  if (Array.isArray(listing.tags)) keywordParts.push(...listing.tags);
  keywordParts.push('Kenya', 'business directory', 'verified business');
  const keywords = Array.from(new Set(keywordParts.filter(Boolean))).join(',');

  return generateSEOMetadata(`${basePath}/${categorySlug}/${listingSlug}`, {
    title,
    description: desc,
    canonical,
    keywords: preset?.keywords ?? seoOverrides.keywords ?? keywords,
    ogTitle: title,
    ogDescription: desc,
    ogImage: toAbsoluteUrl(
      preset?.ogImage || 
      seoOverrides.ogImage || 
      listing.bannerImage || 
      listing.image
    ),
    twitterImage: toAbsoluteUrl(
      preset?.twitterImage || 
      seoOverrides.twitterImage || 
      preset?.ogImage || 
      seoOverrides.ogImage || 
      listing.bannerImage || 
      listing.image
    ),
    robots: preset?.robots ?? seoOverrides.robots ?? 'index, follow',
    jsonLd
  });
}

/**
 * Generate SEO for location-based pages
 */
export async function generateLocationSEOMetadata(
  locationName: string,
  locationDescription: string,
  pathname: string
): Promise<Metadata> {
  const siteName = seoConfig.siteName || 'Kenya Bizz Directory';
  
  const customData: CustomSEOData = {
    title: generateOptimizedTitle(locationName, 'businesses', locationName, 'location'),
    description: `${locationDescription} Discover local businesses, services, and companies in ${locationName}, Kenya.`,
    keywords: `${locationName} businesses,${locationName} directory,companies in ${locationName},${locationName} Kenya`,
    canonical: `${seoConfig.siteUrl}${pathname}`,
    ogTitle: `${locationName} Business Directory | ${siteName}`,
    ogDescription: locationDescription,
  };

  return generateSEOMetadata(pathname, customData);
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { MetaDataItem, CustomSEOData, SchemaData };