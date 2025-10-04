import { NextRequest, NextResponse } from 'next/server';
import { listData } from '@/app/data/data';
import { ListingContext } from '@/app/lib/data';

function isKenyanListing(listing: any): boolean {
  const kenyanLocations = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi'];
  const cityLower = listing.city.toLowerCase();
  const locationLower = listing.location.toLowerCase();
  
  return kenyanLocations.some(kenyanCity => 
    cityLower.includes(kenyanCity) || locationLower.includes(kenyanCity)
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase().trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // Filter to only Kenyan listings
  const kenyanListings = listData.filter(isKenyanListing);
  
  const suggestions = [];

  // Add business suggestions
  const businessMatches = kenyanListings
    .filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.desc.toLowerCase().includes(query)
    )
    .slice(0, 4)
    .map(listing => ({
      id: listing.id,
      title: listing.title,
      category: listing.categories.find(cat => cat.isPrimary)?.name || listing.subCategory,
      type: 'business' as const
    }));

  suggestions.push(...businessMatches);

  // Add category suggestions
  const categoryMatches = Array.from(
    new Set(
      kenyanListings
        .flatMap(listing => listing.categories)
        .filter(category => category.name.toLowerCase().includes(query))
        .map(category => category.name)
    )
  )
  .slice(0, 2)
  .map(categoryName => ({
    id: Math.random(),
    title: categoryName,
    category: categoryName,
    type: 'category' as const
  }));

  suggestions.push(...categoryMatches);

  return NextResponse.json({ suggestions: suggestions.slice(0, 6) });
}