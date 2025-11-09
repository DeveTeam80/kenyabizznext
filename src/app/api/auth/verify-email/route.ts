// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { sendWelcomeEmail } from '@/app/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user with token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email already verified. You can log in now.',
        alreadyVerified: true
      })
    }

    // Check if token expired
    if (user.verificationExpiry && user.verificationExpiry < new Date()) {
      return NextResponse.json(
        { 
          error: 'Verification token has expired. Please request a new one.',
          expired: true,
          email: user.email
        },
        { status: 400 }
      )
    }

    // Verify email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      }
    })

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || 'User')

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      verified: true
    })

  } catch (error: any) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Email verification failed. Please try again.' },
      { status: 500 }
    )
  }
}