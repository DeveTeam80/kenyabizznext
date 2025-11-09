// src/app/(auth)/forgot-password/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa6'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      // 🔥 UPDATED: Handle rate limiting separately
      if (res.status === 429) {
        throw new Error(data.error || 'Too many requests. Please try again later.')
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      // 🔥 UPDATED: Always show success (for security - don't reveal if email exists)
      setSuccess(true)
      setEmail('') // Clear the form

    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
    if (error) setError('')
    if (success) setSuccess(false)
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
        fontFamily: 'var(--body-font-family)'
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-5 col-lg-7 col-md-9">
            <div className="authWrap">
              {/* Logo Section */}
              <div className="authhead">
                <div className="text-center mb-4">
                  <Link href="/" aria-label="Go to homepage">
                    <Image
                      className="img-fluid"
                      src='/img/logo/logoa.png'
                      width={120}
                      height={120}
                      alt="Kenya Bizz Logo"
                      priority
                      style={{ transition: 'transform 0.3s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </Link>
                </div>
              </div>

              {/* Main Form Card */}
              <div className="authbody mb-4">
                <div
                  className="card rounded-4 p-sm-5 p-4"
                  style={{
                    boxShadow: '0 4px 20px rgba(20, 104, 53, 0.08)',
                    border: '1px solid var(--bs-border-color)',
                    backgroundColor: 'var(--bs-card-bg)'
                  }}
                >
                  <div className="card-body p-0">
                    {/* Header */}
                    <div className="text-center mb-4">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: '64px',
                          height: '64px',
                          backgroundColor: 'var(--bs-primary-bg-subtle)',
                          color: 'var(--bs-primary)'
                        }}
                      >
                        <FaEnvelope size={28} />
                      </div>
                      <h1
                        className="mb-2 fs-2 fw-bold"
                        style={{
                          color: 'var(--headingColor)',
                          fontFamily: 'var(--body-font-family)'
                        }}
                      >
                        Forgot Password?
                      </h1>
                      <p
                        className="mb-0"
                        style={{ color: 'var(--paragraphColor)' }}
                      >
                        Enter your email address and we'll send you instructions to reset your password
                      </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                      <div
                        className="alert d-flex align-items-start mb-4"
                        role="alert"
                        style={{
                          backgroundColor: 'var(--bs-primary-bg-subtle)',
                          border: '1px solid var(--bs-primary)',
                          borderRadius: '8px',
                          color: 'var(--bs-primary)'
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="flex-shrink-0 me-2 mt-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        <div>
                          <strong>Email sent successfully!</strong>
                          <p className="mb-0 mt-1">Check your inbox for password reset instructions. Don't forget to check your spam folder.</p>
                        </div>
                      </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                      <div
                        className="alert d-flex align-items-center mb-4"
                        role="alert"
                        style={{
                          backgroundColor: 'var(--bs-danger-bg-subtle)',
                          border: '1px solid #f5c2c7',
                          borderRadius: '8px',
                          color: '#842029'
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="flex-shrink-0 me-2"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    <form className="mt-4" onSubmit={handleSubmit} noValidate>
                      <div className="form">
                        {/* Email Field */}
                        <div className="form-group mb-4">
                          <label
                            htmlFor="email"
                            className="form-label fw-medium mb-2"
                            style={{ color: 'var(--bs-dark-text)' }}
                          >
                            Email Address <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="name@example.com"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => handleInputChange(e.target.value)}
                            disabled={loading || success}
                            style={{
                              padding: '0.75rem 1rem',
                              fontSize: '1rem',
                              borderColor: error && !isValidEmail(email) && email
                                ? '#dc3545'
                                : 'var(--bs-border-color)',
                              borderRadius: '8px',
                              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                            }}
                            onFocus={(e) => {
                              if (!success) {
                                e.target.style.borderColor = 'var(--bs-primary)'
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(20, 104, 53, 0.15)'
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'var(--bs-border-color)'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                          {email && !isValidEmail(email) && (
                            <div
                              className="mt-1"
                              style={{
                                fontSize: '0.875rem',
                                color: '#dc3545'
                              }}
                            >
                              Please enter a valid email address
                            </div>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-group mb-3">
                          <button
                            type="submit"
                            className="btn full-width fw-medium"
                            disabled={loading || !email || !isValidEmail(email)}
                            style={{
                              backgroundColor: (loading || !email || !isValidEmail(email))
                                ? 'var(--paragraphColor)'
                                : 'var(--bs-primary)',
                              color: 'var(--bs-white)',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              fontSize: '1rem',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease',
                              cursor: (loading || !email || !isValidEmail(email))
                                ? 'not-allowed'
                                : 'pointer',
                              opacity: (loading || !email || !isValidEmail(email)) ? 0.65 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!loading && email && isValidEmail(email)) {
                                e.currentTarget.style.backgroundColor = 'var(--bs-primary-bg-dark)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 104, 53, 0.3)'
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!loading && email && isValidEmail(email)) {
                                e.currentTarget.style.backgroundColor = 'var(--bs-primary)'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                              }
                            }}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                  style={{ borderWidth: '2px' }}
                                ></span>
                                Sending...
                              </>
                            ) : (
                              'Send Reset Link'
                            )}
                          </button>
                        </div>

                        {/* Resend Link */}
                        {success && (
                          <div className="text-center">
                            <p
                              className="mb-0"
                              style={{
                                color: 'var(--paragraphColor)',
                                fontSize: '0.9rem'
                              }}
                            >
                              Didn't receive the email?{' '}
                              <button
                                type="button"
                                onClick={() => setSuccess(false)}
                                className="btn btn-link p-0 fw-medium text-decoration-none"
                                style={{
                                  color: 'var(--bs-primary)',
                                  fontSize: '0.9rem'
                                }}
                              >
                                Resend
                              </button>
                            </p>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="authfooter">
                <div className="text-center">
                  <Link
                    href="/login"
                    className="d-inline-flex align-items-center fw-medium text-decoration-none"
                    style={{
                      color: 'var(--bs-primary)',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--bs-primary-2)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--bs-primary)'}
                  >
                    <FaArrowLeft className="me-2" size={14} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}