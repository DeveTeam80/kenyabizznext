// src/app/(auth)/verification-pending/page.tsx
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FaEnvelope, FaCheckCircle, FaRedo } from 'react-icons/fa'

function VerificationPendingContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (countdown > 0) return

    setResending(true)
    setResendError('')
    setResendSuccess(false)

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend email')
      }

      setResendSuccess(true)
      setCountdown(60) // 60 second cooldown
    } catch (err: any) {
      setResendError(err.message || 'Failed to resend verification email')
    } finally {
      setResending(false)
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
                    {/* Icon */}
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
                        <FaEnvelope size={40} style={{ color: 'var(--bs-primary)' }} />
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 fs-2 fw-bold" style={{ color: 'var(--headingColor)' }}>
                      Verify Your Email
                    </h1>

                    {/* Description */}
                    <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                      We've sent a verification link to
                    </p>
                    <p className="fw-bold mb-4" style={{ color: 'var(--bs-primary)' }}>
                      {email}
                    </p>
                    <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                      Click the link in the email to verify your account and start using Kenya Bizz.
                    </p>

                    {/* Success Message */}
                    {resendSuccess && (
                      <div
                        className="alert d-flex align-items-center justify-content-center mb-4"
                        style={{
                          backgroundColor: 'rgba(20, 104, 53, 0.1)',
                          border: '1px solid var(--bs-primary)',
                          borderRadius: '8px',
                          color: 'var(--bs-primary)',
                        }}
                      >
                        <FaCheckCircle className="me-2" />
                        <span>Verification email sent successfully!</span>
                      </div>
                    )}

                    {/* Error Message */}
                    {resendError && (
                      <div
                        className="alert d-flex align-items-center justify-content-center mb-4"
                        style={{
                          backgroundColor: 'var(--bs-danger-bg-subtle)',
                          border: '1px solid #f5c2c7',
                          borderRadius: '8px',
                          color: '#842029',
                        }}
                      >
                        <span>{resendError}</span>
                      </div>
                    )}

                    {/* Instructions */}
                    <div
                      className="mb-4 p-3"
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        textAlign: 'left',
                      }}
                    >
                      <p className="mb-2 fw-medium" style={{ color: 'var(--bs-dark-text)' }}>
                        Didn't receive the email?
                      </p>
                      <ul className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--paragraphColor)' }}>
                        <li>Check your spam or junk folder</li>
                        <li>Make sure the email address is correct</li>
                        <li>Wait a few minutes for the email to arrive</li>
                      </ul>
                    </div>

                    {/* Resend Button */}
                    <button
                      onClick={handleResendEmail}
                      disabled={resending || countdown > 0}
                      className="btn btn-outline-primary mb-3"
                      style={{
                        padding: '0.75rem 2rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                      }}
                    >
                      {resending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending...
                        </>
                      ) : countdown > 0 ? (
                        <>Resend in {countdown}s</>
                      ) : (
                        <>
                          <FaRedo className="me-2" />
                          Resend Verification Email
                        </>
                      )}
                    </button>

                    {/* Back to Login */}
                    <div className="mt-4">
                      <Link
                        href="/login"
                        className="text-decoration-none"
                        style={{ color: 'var(--bs-primary)' }}
                      >
                        ← Back to Login
                      </Link>
                    </div>
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

export default function VerificationPending() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border" style={{ color: 'var(--bs-primary)' }} />
        </div>
      }
    >
      <VerificationPendingContent />
    </Suspense>
  )
}