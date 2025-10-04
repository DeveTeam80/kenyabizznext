import { ListingContext, getListings } from '@/app/lib/data';
import NavbarDark from './navbar-dark';

interface NavItem {
  href: string
  label: string
  submenu?: NavItem[]
}

// Function to get unique categories
async function getCategories(): Promise<NavItem[]> {
  const { listings } = await getListings(ListingContext.LOCAL, {}, 1, 1000);
  
  const categoriesMap = new Map();
  
  listings.forEach(listing => {
    listing.categories.forEach(category => {
      if (!categoriesMap.has(category.slug)) {
        categoriesMap.set(category.slug, {
          href: `/listings/${category.slug}`,
          label: category.name
        });
      }
    });
  });
  
  return Array.from(categoriesMap.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export default async function NavbarServerWrapper() {
  const categories = await getCategories();
  
  return <NavbarDark categories={categories} />;
}