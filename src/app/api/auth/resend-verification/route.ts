// src/app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import prisma from '@/app/lib/db'
import { sendVerificationEmail } from '@/app/lib/email'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

export async function POST(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // Rate limit: 3 requests per hour
    const rateLimit = checkRateLimit(`resend-verification-${identifier}`, {
      limit: 3,
      windowMs: 3600000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Don't reveal if email exists (security)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.'
      })
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified. You can log in now.',
        alreadyVerified: true
      })
    }

    // Generate new token
    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpiry,
      }
    })

    await sendVerificationEmail(user.email, verificationToken)

    return NextResponse.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    })

  } catch (error: any) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again.' },
      { status: 500 }
    )
  }
}