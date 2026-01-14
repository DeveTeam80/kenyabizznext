// src/app/api/categories/route.ts - HYBRID VERSION
// This works with BOTH the Category table AND the existing JSON categories in listings

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const context = searchParams.get('context') || 'local'

    // If requesting single category by slug
    if (slug) {
      // Try to get from Category table first
      let category = await prisma.category.findUnique({
        where: { slug, isActive: true }
      })

      // If not found in Category table, extract from listings JSON
      if (!category) {
        const where: any = { approved: true }
        if (context === 'local') where.isGlobal = false
        else if (context === 'global') where.isGlobal = true

        const listings = await prisma.listing.findMany({
          where,
          select: { categories: true }
        })

        // Find category in JSON
        for (const listing of listings) {
          const cats = (listing.categories as any[]) || []
          const found = cats.find((c: any) => c.slug === slug)
          if (found) {
            return NextResponse.json({
              category: {
                id: 0,
                slug: found.slug,
                name: found.name,
                description: null,
                icon: null,
                order: 999,
                isActive: true
              }
            })
          }
        }

        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ category })
    }

    // Get all categories
    // First, try to get from Category table
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }]
    })

    // If Category table has entries, use those with listing counts
    if (dbCategories.length > 0) {
      const where: any = { approved: true }
      if (context === 'local') where.isGlobal = false
      else if (context === 'global') where.isGlobal = true

      const listings = await prisma.listing.findMany({
        where,
        select: { categories: true, isPaid: true }
      })

      const categoriesWithCounts = dbCategories.map(cat => {
        const totalCount = listings.filter(listing => {
          const cats = (listing.categories as any[]) || []
          return cats.some((c: any) => c.slug === cat.slug)
        }).length

        const paidCount = listings.filter(listing => {
          const cats = (listing.categories as any[]) || []
          return cats.some((c: any) => c.slug === cat.slug) && listing.isPaid === true
        }).length

        return {
          ...cat,
          count: totalCount,
          paidCount
        }
      })

      return NextResponse.json({ categories: categoriesWithCounts }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300'
        }
      })
    }

    // Fallback: Extract from listings JSON (backward compatibility)
    const where: any = { approved: true }
    if (context === 'local') where.isGlobal = false
    else if (context === 'global') where.isGlobal = true

    const listings = await prisma.listing.findMany({
      where,
      select: { categories: true }
    })

    const categoryMap = new Map<string, { name: string; count: number }>()
    
    listings.forEach(listing => {
      const categories = (listing.categories as any[]) || []
      categories.forEach((cat: any) => {
        const existing = categoryMap.get(cat.slug)
        if (existing) {
          existing.count++
        } else {
          categoryMap.set(cat.slug, {
            name: cat.name,
            count: 1
          })
        }
      })
    })

    const categories = Array.from(categoryMap.entries())
      .map(([slug, data]) => ({
        slug,
        name: data.name,
        count: data.count,
        paidCount: 0,
        isActive: true,
        order: 0
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({ categories }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300'
      }
    })

  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}