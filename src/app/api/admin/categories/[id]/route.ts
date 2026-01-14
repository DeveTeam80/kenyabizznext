// src/app/api/admin/categories/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { role: true }
    })
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const categoryId = parseInt(id)

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { role: true }
    })
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const categoryId = parseInt(id)
    const body = await req.json()
    const { name, slug, description, icon, order, isActive } = body

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check for slug conflict (excluding current category)
    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug }
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name || existing.name,
        slug: slug || existing.slug,
        description: description !== undefined ? description : existing.description,
        icon: icon !== undefined ? icon : existing.icon,
        order: order !== undefined ? order : existing.order,
        isActive: isActive !== undefined ? isActive : existing.isActive
      }
    })

    return NextResponse.json({ 
      message: 'Category updated successfully',
      category 
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { role: true }
    })
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const categoryId = parseInt(id)

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // 🔥 CHECK: Prevent deleting categories that are in use by listings
    const listings = await prisma.listing.findMany({
      where: { approved: true },
      select: { 
        id: true, 
        title: true, 
        categories: true 
      }
    })

    // Find listings using this category
    const listingsUsingCategory = listings.filter(listing => {
      const cats = (listing.categories as any[]) || []
      return cats.some((cat: any) => cat.slug === existing.slug)
    })

    // If category is in use, prevent deletion
    if (listingsUsingCategory.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category',
        message: `This category is currently used by ${listingsUsingCategory.length} listing(s). Please reassign or remove these listings first.`,
        affectedListings: listingsUsingCategory.slice(0, 5).map(l => ({ // Show first 5 as examples
          id: l.id,
          title: l.title
        })),
        totalAffected: listingsUsingCategory.length
      }, { status: 409 }) // 409 Conflict
    }

    // Safe to delete - no listings using this category
    await prisma.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({ 
      message: 'Category deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}