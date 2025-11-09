import { ListingContext, getListings } from '@/app/lib/data';
import NavbarDark from './navbar-dark';

interface NavItem {
  href: string
  label: string
  submenu?: NavItem[]
}

// Add this interface for the category type
interface Category {
  slug: string
  name: string
}

// Function to get unique categories
async function getCategories(): Promise<NavItem[]> {
  const { listings } = await getListings(ListingContext.LOCAL, {}, 1, 1000);
  
  const categoriesMap = new Map();
  
  listings.forEach(listing => {
    // Add type annotation here
    listing.categories.forEach((category: Category) => {
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