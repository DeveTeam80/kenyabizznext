// src/app/(auth)/login/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEye, FaEyeSlash, FaFacebook, FaGooglePlusG } from 'react-icons/fa6'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Load saved email if "Remember Me" was checked previously
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('rememberedEmail')
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }))
        setRememberMe(true)
      }
    }
  }, [])

  // Form validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canSubmit = formData.email && formData.password && isValidEmail(formData.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Client-side validation
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        // 🔥 NEW: Handle unverified email
        if (data.requiresVerification) {
          router.push(`/verification-pending?email=${encodeURIComponent(data.email || formData.email)}`)
          return
        }

        // 🔥 NEW: Handle account locked
        if (data.locked) {
          setError(`Account locked. ${data.minutesRemaining ? `Try again in ${data.minutesRemaining} minutes.` : 'Try again later.'}`)
          return
        }
        throw new Error(data.error || 'Login failed')
      }

      // Handle "Remember Me"
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }
      }

      // Admin always goes to admin dashboard
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        // Regular users go to redirect param or dashboard
        router.push(redirect)
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <section
      className="auth-section"
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
                      <h1
                        className="mb-2 fs-2 fw-bold"
                        style={{
                          color: 'var(--headingColor)',
                          fontFamily: 'var(--body-font-family)'
                        }}
                      >
                        Welcome Back!
                      </h1>
                      <p
                        className="mb-0"
                        style={{ color: 'var(--paragraphColor)' }}
                      >
                        Sign in to continue to Kenya Bizz
                      </p>
                    </div>

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
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={loading}
                            style={{
                              padding: '0.75rem 1rem',
                              fontSize: '1rem',
                              borderColor: error && !isValidEmail(formData.email) && formData.email
                                ? '#dc3545'
                                : 'var(--bs-border-color)',
                              borderRadius: '8px',
                              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--bs-primary)'
                              e.target.style.boxShadow = '0 0 0 0.2rem rgba(20, 104, 53, 0.15)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'var(--bs-border-color)'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                          {formData.email && !isValidEmail(formData.email) && (
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

                        {/* Password Field */}
                        <div className="form-group mb-4">
                          <label
                            htmlFor="password"
                            className="form-label fw-medium mb-2"
                            style={{ color: 'var(--bs-dark-text)' }}
                          >
                            Password <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              className="form-control pe-5"
                              placeholder="Enter your password"
                              required
                              autoComplete="current-password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              disabled={loading}
                              style={{
                                padding: '0.75rem 1rem',
                                fontSize: '1rem',
                                borderColor: 'var(--bs-border-color)',
                                borderRadius: '8px',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = 'var(--bs-primary)'
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(20, 104, 53, 0.15)'
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = 'var(--bs-border-color)'
                                e.target.style.boxShadow = 'none'
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                              onClick={togglePasswordVisibility}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              tabIndex={-1}
                              style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                padding: '0 12px',
                                color: 'var(--paragraphColor)'
                              }}
                            >
                              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              disabled={loading}
                              style={{
                                cursor: 'pointer',
                                borderColor: 'var(--bs-border-color)'
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="rememberMe"
                              style={{
                                cursor: 'pointer',
                                color: 'var(--bs-dark-text)'
                              }}
                            >
                              Remember me
                            </label>
                          </div>
                          <Link
                            href={`/forgot-password?email=${encodeURIComponent(formData.email)}`}
                            className="fw-medium text-decoration-none"
                            style={{
                              color: 'var(--bs-primary)',
                              transition: 'color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--bs-primary-2)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--bs-primary)'}
                          >
                            Forgot Password?
                          </Link>
                        </div>

                        {/* Submit Button */}
                        <div className="form-group mb-3">
                          <button
                            type="submit"
                            className="btn full-width fw-medium"
                            disabled={loading || !canSubmit}
                            style={{
                              backgroundColor: loading || !canSubmit ? 'var(--paragraphColor)' : 'var(--bs-primary)',
                              color: 'var(--bs-white)',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              fontSize: '1rem',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease',
                              cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
                              opacity: loading || !canSubmit ? 0.65 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!loading && canSubmit) {
                                e.currentTarget.style.backgroundColor = 'var(--bs-primary-bg-dark)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 104, 53, 0.3)'
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!loading && canSubmit) {
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
                                Logging in...
                              </>
                            ) : (
                              'Log In'
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Social Login (Commented - Ready for implementation) */}
                      {/* <div className="prixer my-4">
                        <div className="position-relative text-center">
                          <hr style={{ 
                            borderColor: 'var(--bs-border-color)',
                            opacity: 0.5 
                          }} />
                          <span 
                            className="position-absolute top-50 start-50 translate-middle px-3"
                            style={{ 
                              backgroundColor: 'var(--bs-card-bg)',
                              color: 'var(--paragraphColor)',
                              fontSize: '0.875rem'
                            }}
                          >
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="social-login">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <button 
                            type="button"
                            className="btn flex-fill"
                            style={{
                              backgroundColor: 'var(--bs-white)',
                              border: '1px solid var(--bs-border-color)',
                              color: 'var(--bs-dark-text)',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = 'var(--bs-primary)'
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 104, 53, 0.1)'
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = 'var(--bs-border-color)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <FaGooglePlusG className="me-2" style={{ color: '#DB4437' }} />
                            <span className="fw-medium">Google</span>
                          </button>
                          <button 
                            type="button"
                            className="btn flex-fill"
                            style={{
                              backgroundColor: 'var(--bs-white)',
                              border: '1px solid var(--bs-border-color)',
                              color: 'var(--bs-dark-text)',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = 'var(--bs-primary)'
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 104, 53, 0.1)'
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = 'var(--bs-border-color)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <FaFacebook className="me-2" style={{ color: '#1877F2' }} />
                            <span className="fw-medium">Facebook</span>
                          </button>
                        </div>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="authfooter">
                <div className="text-center">
                  <p
                    className="mb-0"
                    style={{ color: 'var(--bs-dark-text)' }}
                  >
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="fw-medium text-decoration-none"
                      style={{
                        color: 'var(--bs-primary)',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--bs-primary-2)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--bs-primary)'}
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Wrap with Suspense for useSearchParams
export default function Login() {
  return (
    <Suspense fallback={
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bs-light)'
        }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{
            color: 'var(--bs-primary)',
            width: '3rem',
            height: '3rem',
            borderWidth: '0.3rem'
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}