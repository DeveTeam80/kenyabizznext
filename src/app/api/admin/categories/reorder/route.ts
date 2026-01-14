// src/app/api/admin/categories/reorder/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

export async function PUT(req: NextRequest) {
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

    const body = await req.json()
    const { categories } = body // Array of { id, order }

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      )
    }

    // Update all categories in a transaction
    await prisma.$transaction(
      categories.map((cat) =>
        prisma.category.update({
          where: { id: cat.id },
          data: { order: cat.order }
        })
      )
    )

    return NextResponse.json({ 
      message: 'Categories reordered successfully' 
    })

  } catch (error) {
    console.error('Error reordering categories:', error)
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
}