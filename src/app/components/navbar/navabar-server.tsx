// src/app/components/navbar/navabar-server.tsx - FIXED VERSION

import NavbarDark from './navbar-dark';
import prisma from '@/app/lib/db';

export interface NavItem {
  href: string
  label: string
}

// 🔥 FIXED: Use direct Prisma query instead of fetch (fetch doesn't work at build time)
async function getCategories(): Promise<NavItem[]> {
  try {
    // First try to get from Category table
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }]
    });

    if (dbCategories.length > 0) {
      return dbCategories.map(cat => ({
        href: `/listings/${cat.slug}`,
        label: cat.name
      }));
    }

    // Fallback: Extract unique categories from listings JSON
    const listings = await prisma.listing.findMany({
      where: { approved: true, isGlobal: false },
      select: { categories: true }
    });

    const categoryMap = new Map<string, string>();
    listings.forEach(listing => {
      const categories = (listing.categories as any[]) || [];
      categories.forEach((cat: any) => {
        if (cat.slug && cat.name && !categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, cat.name);
        }
      });
    });

    const categories: NavItem[] = Array.from(categoryMap.entries())
      .map(([slug, name]) => ({
        href: `/listings/${slug}`,
        label: name
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return categories;
  } catch (error) {
    console.error('Error fetching categories for navbar:', error);
    return [];
  }
}

export default async function NavbarServerWrapper() {
  const categories = await getCategories();

  return <NavbarDark categories={categories} />;
}