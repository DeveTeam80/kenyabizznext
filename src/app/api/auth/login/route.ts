// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { verifyPassword, createToken } from '@/app/lib/auth'
import { checkRateLimit, getIdentifier } from '@/app/lib/rate-limit'

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  const identifier = getIdentifier(request)
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown'

  try {
    // 🔥 Rate limiting: 10 login attempts per 15 minutes
    const rateLimit = checkRateLimit(`login-${identifier}`, {
      limit: 10,
      windowMs: 900000
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 🔥 Check if account is locked
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 60000)
      
      return NextResponse.json(
        { 
          error: `Account is locked due to too many failed login attempts. Try again in ${minutesRemaining} minutes.`,
          locked: true,
          minutesRemaining 
        },
        { status: 403 }
      )
    }

    // 🔥 Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Please verify your email address before logging in. Check your inbox for the verification link.',
          requiresVerification: true,
          email: user.email
        },
        { status: 403 }
      )
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password)

    if (!passwordMatch) {
      // 🔥 Increment failed attempts
      const failedAttempts = user.failedLoginAttempts + 1
      const shouldLock = failedAttempts >= MAX_FAILED_ATTEMPTS

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          ...(shouldLock && {
            accountLockedUntil: new Date(Date.now() + LOCK_DURATION)
          })
        }
      })

      if (shouldLock) {
        return NextResponse.json(
          { 
            error: 'Too many failed login attempts. Your account has been locked for 15 minutes.',
            locked: true 
          },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          attemptsRemaining: MAX_FAILED_ATTEMPTS - failedAttempts
        },
        { status: 401 }
      )
    }

    // 🔥 Reset failed attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: clientIp,
      }
    })

    // Create token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}