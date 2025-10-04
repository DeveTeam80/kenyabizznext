import { listData, ListData } from '@/app/data/data';

export interface FilterParams {
  subCategory?: string;
  city?: string;
  rating?: string;
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

interface CategoryDetails {
  name: string;
  description: string;
}

// Create an enum for listing contexts
export enum ListingContext {
  LOCAL = 'local',    // Kenyan listings
  GLOBAL = 'global',  // Non-Kenyan listings  
  ALL = 'all'         // All listings (admin/internal use)
}

// List of Kenyan cities/locations
const KENYAN_LOCATIONS = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi', 'garissa',
  'kitale', 'machakos', 'meru', 'nyeri', 'kericho', 'embu', 'migori', 'kakamega',
  'bungoma', 'kilifi', 'voi', 'kitui', 'kapenguria', 'homa bay', 'kisii', 'lamu',
  'marsabit', 'wajir', 'mandera', 'isiolo', 'nanyuki', 'nyahururu', 'karatina'
];

// Helper function to check if a listing is from Kenya
function isKenyanListing(listing: ListData): boolean {
  const cityLower = listing.city.toLowerCase();
  const locationLower = listing.location.toLowerCase();
  
  return KENYAN_LOCATIONS.some(kenyanCity => 
    cityLower.includes(kenyanCity) || locationLower.includes(kenyanCity)
  );
}

// Base filtering function
function filterByLocation(listings: ListData[], context: ListingContext): ListData[] {
  switch (context) {
    case ListingContext.LOCAL:
      return listings.filter(listing => isKenyanListing(listing));
    case ListingContext.GLOBAL:
      return listings.filter(listing => !isKenyanListing(listing));
    case ListingContext.ALL:
      return listings;
    default:
      return listings.filter(listing => isKenyanListing(listing)); // Default to local
  }
}

// Apply common filters
function applyFilters(listings: ListData[], filters: FilterParams): ListData[] {
  let filteredListings = [...listings];

  if (filters.subCategory && filters.subCategory.length > 0) {
    filteredListings = filteredListings.filter(listing =>
      filters.subCategory!.includes(listing.subCategory)
    );
  }

  if (filters.city && filters.city.length > 0) {
    filteredListings = filteredListings.filter(listing =>
      filters.city!.includes(listing.city)
    );
  }

  if (filters.rating) {
    filteredListings = filteredListings.filter(listing => 
      listing.rating === filters.rating
    );
  }

  if (filters.featured) {
    filteredListings = filteredListings.filter(listing => listing.featured);
  }

  if (filters.verified) {
    filteredListings = filteredListings.filter(listing => listing.isVerified);
  }

  if (filters.search) {
    filteredListings = filteredListings.filter(listing => 
      listing.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
      listing.desc.toLowerCase().includes(filters.search!.toLowerCase())
    );
  }

  return filteredListings;
}

// Unified function for getting listings
export async function getListings(
  context: ListingContext,
  filters: FilterParams = {},
  page: number = 1,
  itemsPerPage: number = 9,
  categorySlug?: string
): Promise<{ listings: ListData[], totalPages: number, totalItems: number }> {
  
  let filteredListings = filterByLocation(listData, context);
  
  // Apply category filter if provided
  if (categorySlug) {
    filteredListings = filteredListings.filter(listing => 
      listing.categories.some(category => category.slug === categorySlug)
    );
  }
  
  // Apply other filters
  filteredListings = applyFilters(filteredListings, filters);
  
  const totalItems = filteredListings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);
  
  return { 
    listings: paginatedListings, 
    totalPages, 
    totalItems 
  };
}

export async function getListingBySlug(
  categorySlug: string,
  listingSlug: string,
  context: ListingContext = ListingContext.LOCAL
): Promise<ListData | null> {
  const contextFilteredData = filterByLocation(listData, context);
  
  const listing = contextFilteredData.find(listing => 
    listing.slug === listingSlug && 
    listing.categories.some(category => category.slug === categorySlug)
  );
  
  return listing || null;
}

export async function getRelatedListings(
  categorySlug: string,
  currentListingSlug: string,
  limit: number = 3,
  context: ListingContext = ListingContext.LOCAL
): Promise<ListData[]> {
  const contextFilteredData = filterByLocation(listData, context);
  
  const relatedListings = contextFilteredData.filter(listing => 
    listing.slug !== currentListingSlug &&
    listing.categories.some(category => category.slug === categorySlug)
  );
  
  return relatedListings.slice(0, limit);
}

export async function getCategoryDetails(slug: string, context: ListingContext = ListingContext.LOCAL): Promise<CategoryDetails> {
  const contextFilteredData = filterByLocation(listData, context);
  const categoryFromData = contextFilteredData
    .flatMap(listing => listing.categories)
    .find(category => category.slug === slug);
  
  if (categoryFromData) {
    return {
      name: categoryFromData.name,
      description: `Find your perfect partner from our curated list of trusted companies in ${categoryFromData.name}.`
    };
  }
  
  // Fallback to hardcoded map if not found in data
  const categoryMap: { [key: string]: string } = {
    'real-estate': 'Real Estate',
    'manufacturing': 'Manufacturing',
    'shops-and-suppliers': 'Shops & Suppliers',
    'services': 'Services',
    'technology': 'Technology'
  };
  
  const name = categoryMap[slug] || 'Listings';
  const description = `Find your perfect partner from our curated list of trusted companies in ${name}.`;
  
  return { name, description };
}

export async function getSubCategories(categorySlug?: string, context: ListingContext = ListingContext.LOCAL): Promise<string[]> {
  let contextFilteredData = filterByLocation(listData, context);
  
  if (categorySlug) {
    contextFilteredData = contextFilteredData.filter(listing =>
      listing.categories.some(category => category.slug === categorySlug)
    );
  }
  
  const subCategories = [...new Set(contextFilteredData.map(listing => listing.subCategory))];
  return subCategories.sort();
}

export async function getCities(categorySlug?: string, context: ListingContext = ListingContext.LOCAL): Promise<string[]> {
  let contextFilteredData = filterByLocation(listData, context);
  
  if (categorySlug) {
    contextFilteredData = contextFilteredData.filter(listing =>
      listing.categories.some(category => category.slug === categorySlug)
    );
  }
  
  const cities = [...new Set(contextFilteredData.map(listing => listing.city))];
  return cities.sort();
}

// Backward compatibility functions
export async function getAllListings(filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.LOCAL, filters, page, itemsPerPage);
}

export async function getGlobalListings(filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.GLOBAL, filters, page, itemsPerPage);
}

export async function getListingsByCategory(categorySlug: string, filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.LOCAL, filters, page, itemsPerPage, categorySlug);
}

export async function getGlobalListingsByCategory(categorySlug: string, filters?: FilterParams, page?: number, itemsPerPage?: number) {
  return getListings(ListingContext.GLOBAL, filters, page, itemsPerPage, categorySlug);
}

export async function getAllSubCategories() {
  return getSubCategories(undefined, ListingContext.LOCAL);
}

export async function getAllCities() {
  return getCities(undefined, ListingContext.LOCAL);
}

export async function getSubCategoriesByCategory(categorySlug: string) {
  return getSubCategories(categorySlug, ListingContext.LOCAL);
}

export async function getCitiesByCategory(categorySlug: string) {
  return getCities(categorySlug, ListingContext.LOCAL);
}

export async function getGlobalSubCategories() {
  return getSubCategories(undefined, ListingContext.GLOBAL);
}

export async function getGlobalCitiesByCategory(categorySlug: string) {
  return getCities(categorySlug, ListingContext.GLOBAL);
}

export interface SearchFilters extends FilterParams {
  query?: string;
  location?: string;
  category?: string;
}

export async function searchListings(
  filters: SearchFilters = {},
  page: number = 1,
  itemsPerPage: number = 9,
  context: ListingContext = ListingContext.LOCAL
): Promise<{ listings: ListData[], totalPages: number, totalItems: number }> {
  
  let filteredListings = filterByLocation(listData, context);
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filteredListings = filteredListings.filter(listing => 
      listing.categories.some(category => category.slug === filters.category)
    );
  }
  
  // Apply location filter
  if (filters.location && filters.location !== 'all-kenya') {
    filteredListings = filteredListings.filter(listing => 
      listing.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
      listing.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  // Apply search query filter
  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase().trim();
    filteredListings = filteredListings.filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.desc.toLowerCase().includes(query) ||
      listing.subCategory.toLowerCase().includes(query) ||
      listing.categories.some(cat => cat.name.toLowerCase().includes(query)) ||
      listing.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      listing.city.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query)
    );
  }
  
  // Apply other existing filters
  filteredListings = applyFilters(filteredListings, filters);
  
  const totalItems = filteredListings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);
  
  return {
    listings: paginatedListings,
    totalPages,
    totalItems
  };
}

// Get dynamic categories for search dropdown
export async function getSearchCategories(): Promise<Array<{value: string, label: string}>> {
  const kenyanListings = filterByLocation(listData, ListingContext.LOCAL);
  const categoriesMap = new Map();
  
  kenyanListings.forEach(listing => {
    listing.categories.forEach(category => {
      if (!categoriesMap.has(category.slug)) {
        categoriesMap.set(category.slug, category.name);
      }
    });
  });
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    ...Array.from(categoriesMap.entries()).map(([slug, name]) => ({
      value: slug,
      label: name
    }))
  ];
  
  return categories.sort((a, b) => a.label.localeCompare(b.label));
}

// Get dynamic locations for search dropdown
export async function getSearchLocations(): Promise<Array<{value: string, label: string}>> {
  const kenyanListings = filterByLocation(listData, ListingContext.LOCAL);
  const citiesSet = new Set<string>();
  
  kenyanListings.forEach(listing => {
    citiesSet.add(listing.city);
  });
  
  const locations = [
    { value: 'all-kenya', label: 'All Kenya' },
    ...Array.from(citiesSet).map(city => ({
      value: city.toLowerCase(),
      label: city
    }))
  ];
  
  return locations.sort((a, b) => a.label.localeCompare(b.label));
}