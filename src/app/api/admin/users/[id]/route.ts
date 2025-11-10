// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAdmin, getSession } from '@/app/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    const { id } = await params
    const userId = parseInt(id)
    // Prevent admin from deleting themselves
    if (session.userId === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete user (cascade will delete their listings)
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}