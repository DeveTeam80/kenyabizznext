// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import prisma from '@/app/lib/db'
import { hashPassword } from '@/app/lib/auth'
import { validateEmail, validatePassword } from '@/app/lib/validators'
import { sendVerificationEmail } from '@/app/lib/email'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

export async function POST(request: NextRequest) {
  const identifier = getIdentifier(request)

  try {
    // 🔥 Rate limiting: 5 registrations per hour
    const rateLimit = checkRateLimit(`register-${identifier}`, {
      limit: 5,
      windowMs: 3600000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, password, name } = await request.json()

    // 🔥 Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
    // ✅ CHANGED: Return a 409 Conflict with a specific error code
    return NextResponse.json(
      {
        error: 'An account with this email already exists.',
        errorCode: 'USER_ALREADY_EXISTS'
      },
      { status: 409 } // Use 409 Conflict
    )
  }

    const hashedPassword = await hashPassword(password)

    // 🔥 Generate verification token
    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // 🔥 Create user (unverified)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'user',
        emailVerified: false, // 🔥 Not verified yet
        verificationToken,
        verificationExpiry,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      }
    })

    // 🔥 Send verification email
    const emailResult = await sendVerificationEmail(user.email, verificationToken)

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // Don't fail registration, user can request resend
    }

    // 🔥 Don't auto-login, require email verification
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}