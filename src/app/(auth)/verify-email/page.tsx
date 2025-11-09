// src/app/(auth)/verify-email/page.tsx
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    verifyEmail()
  }, [token])

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (status === 'success' && countdown === 0) {
      router.push('/login')
    }
  }, [status, countdown, router])

  const verifyEmail = async () => {
    try {
      const res = await fetch(`/api/auth/verify-email?token=${token}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.alreadyVerified) {
        setStatus('already-verified')
        setMessage('Your email is already verified. You can log in now.')
      } else {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Verification failed')
    }
  }

  return (
    <section
      style={{
        backgroundImage: `url('/img/auth-bg.png')`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f7f7f7',
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 0',
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="authWrap">
              {/* Logo */}
              <div className="authhead text-center mb-4">
                <Link href="/">
                  <Image
                    src="/img/logo/logoa.png"
                    width={120}
                    height={120}
                    alt="Kenya Bizz Logo"
                    priority
                  />
                </Link>
              </div>

              {/* Main Card */}
              <div className="authbody mb-4">
                <div
                  className="card rounded-4 p-5"
                  style={{
                    boxShadow: '0 4px 20px rgba(20, 104, 53, 0.08)',
                    border: '1px solid var(--bs-border-color)',
                  }}
                >
                  <div className="card-body p-0 text-center">
                    {/* Loading State */}
                    {status === 'loading' && (
                      <>
                        <div className="mb-4">
                          <FaSpinner className="fa-spin" size={60} style={{ color: 'var(--bs-primary)' }} />
                        </div>
                        <h2 className="mb-3">Verifying your email...</h2>
                        <p style={{ color: 'var(--paragraphColor)' }}>Please wait a moment</p>
                      </>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                      <>
                        <div className="mb-4">
                          <div
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(20, 104, 53, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                            }}
                          >
                            <FaCheckCircle size={50} style={{ color: 'var(--bs-primary)' }} />
                          </div>
                        </div>
                        <h1 className="mb-3 fs-2 fw-bold" style={{ color: 'var(--headingColor)' }}>
                          Email Verified!
                        </h1>
                        <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                          {message}
                        </p>
                        <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                          Redirecting to login in {countdown} seconds...
                        </p>
                        <Link
                          href="/login"
                          className="btn btn-primary"
                          style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            fontWeight: '500',
                          }}
                        >
                          Continue to Login
                        </Link>
                      </>
                    )}

                    {/* Already Verified State */}
                    {status === 'already-verified' && (
                      <>
                        <div className="mb-4">
                          <div
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(23, 162, 184, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                            }}
                          >
                            <FaCheckCircle size={50} style={{ color: '#17a2b8' }} />
                          </div>
                        </div>
                        <h1 className="mb-3 fs-2 fw-bold" style={{ color: 'var(--headingColor)' }}>
                          Already Verified
                        </h1>
                        <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                          {message}
                        </p>
                        <Link
                          href="/login"
                          className="btn btn-primary"
                          style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            fontWeight: '500',
                          }}
                        >
                          Go to Login
                        </Link>
                      </>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                      <>
                        <div className="mb-4">
                          <div
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(220, 53, 69, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                            }}
                          >
                            <FaTimesCircle size={50} style={{ color: '#dc3545' }} />
                          </div>
                        </div>
                        <h1 className="mb-3 fs-2 fw-bold" style={{ color: 'var(--headingColor)' }}>
                          Verification Failed
                        </h1>
                        <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                          {message}
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                          <Link
                            href="/register"
                            className="btn btn-outline-primary"
                            style={{
                              padding: '0.75rem 2rem',
                              borderRadius: '8px',
                              fontWeight: '500',
                            }}
                          >
                            Register Again
                          </Link>
                          <Link
                            href="/login"
                            className="btn btn-primary"
                            style={{
                              padding: '0.75rem 2rem',
                              borderRadius: '8px',
                              fontWeight: '500',
                            }}
                          >
                            Go to Login
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border" style={{ color: 'var(--bs-primary)' }} />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}