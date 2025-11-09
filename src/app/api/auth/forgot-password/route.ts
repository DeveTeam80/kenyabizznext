// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import prisma from '@/app/lib/db'
import { sendPasswordResetEmail } from '@/app/lib/email'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'
import { validateEmail } from '@/app/lib/validators'

export async function POST(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // 🔥 Rate limiting: 3 requests per hour
    const rateLimit = checkRateLimit(`forgot-password-${identifier}`, {
      limit: 3,
      windowMs: 3600000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // 🔥 Don't reveal if email exists (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.'
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    })

    // Send email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken)

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Don't fail the request, just log it
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.'
    })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}