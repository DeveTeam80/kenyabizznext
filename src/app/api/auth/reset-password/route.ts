import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
// ✅ FIX: Use your existing 'verifyPassword' function
import { hashPassword, verifyPassword } from '@/app/lib/auth'
import { validatePassword } from '@/app/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // 1. Validate the new password's strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // 2. Find the user with a valid (non-expired) token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Check that the token is not expired
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset link.' },
        { status: 400 }
      )
    }

    // 3. ✅ CHECK IF NEW PASSWORD IS SAME AS OLD
    // ✅ FIX: Use 'verifyPassword' instead of 'comparePassword'
    const isSamePassword = await verifyPassword(password, user.password)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from your old password.' },
        { status: 400 }
      )
    }

    // 4. Hash the new password and update the user
    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null, // Clear the token so it can't be reused
        resetTokenExpiry: null,
        failedLoginAttempts: 0, // Bonus: unlock account on successful reset
        accountLockedUntil: null,
      },
    })

    return NextResponse.json({ success: true, message: 'Password reset successful.' })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}