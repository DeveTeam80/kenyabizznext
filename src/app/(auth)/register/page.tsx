'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEye, FaEyeSlash, FaFacebookF, FaGooglePlusG, FaCheck } from 'react-icons/fa6'

// ✅ FIX: Added the common password list to match your validator
const commonPasswords = [
  'password', 'password123', '12345678', 'qwerty', 'abc123',
  'password1', 'admin123', 'letmein', 'welcome', 'monkey',
  'iloveyou', 'princess', 'dragon', 'sunshine', 'master'
]

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Validation functions
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidName = (name: string) => {
    return name.trim().length >= 2
  }

  // ✅ FIX: Updated password strength function to match validators.ts
  const passwordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password), // Use \d for consistency
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), // Full regex from validator
      common: password.length > 0 && !commonPasswords.includes(password.toLowerCase()) // Check against common passwords
    }
    const score = Object.values(checks).filter(Boolean).length
    return { checks, score }
  }

  const strength = passwordStrength(formData.password)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

  // ✅ FIX: Updated canSubmit to require all 6 checks to pass
  const canSubmit =
    isValidName(formData.name) &&
    isValidEmail(formData.email) &&
    strength.score === 6 && // Must pass all 6 checks
    passwordsMatch &&
    acceptTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowForgotPassword(false)

    // Validate all fields
    if (!isValidName(formData.name)) {
      setError('Please enter your full name (at least 2 characters)')
      return
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // ✅ FIX: Updated validation logic to match all 6 checks
    const passStrength = passwordStrength(formData.password)
    if (passStrength.score < 6) {
      // Give a more specific error
      if (!passStrength.checks.length) {
        setError('Password must be at least 8 characters.')
      } else if (!passStrength.checks.common) {
        setError('This password is too common. Please choose a stronger password.')
      } else {
        setError('Password must contain uppercase, lowercase, number, and special character.')
      }
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409 && data.errorCode === 'USER_ALREADY_EXISTS') {
          setError(data.error + ' Did you forget your password?')
          setShowForgotPassword(true) // Show the link
        } else {
          throw new Error(data.error || 'Registration failed')
        }
        return
      }

      // 🔥 NEW: Handle email verification requirement
      if (data.requiresVerification) {
        // Redirect to verification pending page
        router.push(`/verification-pending?email=${encodeURIComponent(data.user.email)}`)
      } else {
        // Old flow (shouldn't happen now, but kept for backward compatibility)
        router.push(redirect)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration')
      setShowForgotPassword(false)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (error) setError('')
    if (showForgotPassword) setShowForgotPassword(false)
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
          <div className="col-xl-6 col-lg-8 col-md-10">
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
                        Create Your Account
                      </h1>
                      <p
                        className="mb-0"
                        style={{ color: 'var(--paragraphColor)' }}
                      >
                        Join Kenya Bizz and start listing your business today
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
                    {showForgotPassword && (
                      <div className="text-center mb-4">
                        <Link
                          href={`/forgot-password?email=${encodeURIComponent(formData.email)}`}
                          className="fw-medium text-decoration-none"
                          style={{
                            color: 'var(--bs-primary)',
                            textDecoration: 'underline'
                          }}
                        >
                          Click here to reset your password
                        </Link>
                      </div>
                    )}

                    <form className="mt-4" onSubmit={handleSubmit} noValidate>
                      <div className="row">
                        {/* Full Name */}
                        <div className="col-12 mb-4">
                          <label
                            htmlFor="name"
                            className="form-label fw-medium mb-2"
                            style={{ color: 'var(--bs-dark-text)' }}
                          >
                            Full Name <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
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
                        </div>

                        {/* Email */}
                        <div className="col-12 mb-4">
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
                              borderColor: formData.email && !isValidEmail(formData.email)
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

                        {/* Password */}
                        <div className="col-md-6 mb-4">
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
                              placeholder="Create a strong password"
                              required
                              autoComplete="new-password"
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
                              onClick={() => setShowPassword(!showPassword)}
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

                          {/* ✅ FIX: Updated Password Strength Indicator */}
                          {formData.password && (
                            <div className="mt-2">
                              <div
                                className="progress"
                                style={{ height: '4px', borderRadius: '2px' }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${(strength.score / 6) * 100}%`, // Score out of 6
                                    backgroundColor:
                                      strength.score <= 2 ? '#dc3545' :
                                        strength.score <= 4 ? '#ffc107' :
                                          strength.score === 5 ? '#17a2b8' : 'var(--bs-primary)',
                                    transition: 'width 0.3s ease'
                                  }}
                                />
                              </div>
                              <div
                                className="mt-2 row"
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'var(--paragraphColor)'
                                }}
                              >
                                <span className="col-6" style={{ color: strength.checks.length ? 'var(--bs-primary)' : 'inherit' }}>
                                  {strength.checks.length ? '✓' : '○'} 8+ chars
                                </span>
                                <span className="col-6" style={{ color: strength.checks.uppercase ? 'var(--bs-primary)' : 'inherit' }}>
                                  {strength.checks.uppercase ? '✓' : '○'} Uppercase
                                </span>
                                <span className="col-6" style={{ color: strength.checks.lowercase ? 'var(--bs-primary)' : 'inherit' }}>
                                  {strength.checks.lowercase ? '✓' : '○'} Lowercase
                                </span>
                                <span className="col-6" style={{ color: strength.checks.number ? 'var(--bs-primary)' : 'inherit' }}>
                                  {strength.checks.number ? '✓' : '○'} Number
                                </span>
                                <span className="col-6" style={{ color: strength.checks.special ? 'var(--bs-primary)' : 'inherit' }}>
                                  {strength.checks.special ? '✓' : '○'} Special Char
                                </span>
                                <span className="col-6" style={{ color: strength.checks.common ? 'var(--bs-primary)' : '#dc3545' }}>
                                  {strength.checks.common ? '✓' : '✗'} Not Common
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className="col-md-6 mb-4">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label fw-medium mb-2"
                            style={{ color: 'var(--bs-dark-text)' }}
                          >
                            Confirm Password <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              id="confirmPassword"
                              className="form-control pe-5"
                              placeholder="Re-enter your password"
                              required
                              autoComplete="new-password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              disabled={loading}
                              style={{
                                padding: '0.75rem 1rem',
                                fontSize: '1rem',
                                borderColor: formData.confirmPassword && !passwordsMatch
                                  ? '#dc3545'
                                  : passwordsMatch
                                    ? 'var(--bs-primary)'
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
                            <button
                              type="button"
                              className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              tabIndex={-1}
                              style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                padding: '0 12px',
                                color: 'var(--paragraphColor)'
                              }}
                            >
                              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                          </div>

                          {/* Password Match Indicator */}
                          {formData.confirmPassword && (
                            <div
                              className="mt-2 d-flex align-items-center gap-2"
                              style={{
                                fontSize: '0.875rem',
                                color: passwordsMatch ? 'var(--bs-primary)' : '#dc3545'
                              }}
                            >
                              {passwordsMatch ? (
                                <>
                                  <FaCheck size={14} />
                                  <span>Passwords match</span>
                                </>
                              ) : (
                                <span>Passwords don't match</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="col-12 mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="acceptTerms"
                              checked={acceptTerms}
                              onChange={(e) => setAcceptTerms(e.target.checked)}
                              disabled={loading}
                              style={{
                                cursor: 'pointer',
                                borderColor: 'var(--bs-border-color)',
                                width: '18px',
                                height: '18px'
                              }}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="acceptTerms"
                              style={{
                                cursor: 'pointer',
                                color: 'var(--bs-dark-text)',
                                fontSize: '0.95rem'
                              }}
                            >
                              I agree to the{' '}
                              <Link
                                href="/terms"
                                target="_blank"
                                className="text-decoration-none"
                                style={{ color: 'var(--bs-primary)' }}
                              >
                                Terms & Conditions
                              </Link>
                              {' '}and{' '}
                              <Link
                                href="/privacy"
                                target="_blank"
                                className="text-decoration-none"
                                style={{ color: 'var(--bs-primary)' }}
                              >
                                Privacy Policy
                              </Link>
                            </label>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-12 mb-3">
                          <button
                            type="submit"
                            className="btn full-width fw-medium"
                            disabled={loading || !canSubmit}
                            style={{
                              backgroundColor: (loading || !canSubmit)
                                ? 'var(--paragraphColor)'
                                : 'var(--bs-primary)',
                              color: 'var(--bs-white)',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              fontSize: '1rem',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease',
                              cursor: (loading || !canSubmit) ? 'not-allowed' : 'pointer',
                              opacity: (loading || !canSubmit) ? 0.65 : 1
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
                                Creating Account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Social Login (Commented - Ready for implementation) */}
                      {/* <div className="prixer my-4">
                        <div className="position-relative text-center">
CI/CD ...
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
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="fw-medium text-decoration-none"
                      style={{
                        color: 'var(--bs-primary)',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--bs-primary-2)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--bs-primary)'}
                    >
                      Sign in
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
export default function Register() {
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
      <RegisterForm />
    </Suspense>
  )
}