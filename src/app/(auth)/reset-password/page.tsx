'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaCheck } from 'react-icons/fa'

// ✅ FIX: Added common password list to match your validator
const commonPasswords = [
  'password', 'password123', '12345678', 'qwerty', 'abc123',
  'password1', 'admin123', 'letmein', 'welcome', 'monkey',
  'iloveyou', 'princess', 'dragon', 'sunshine', 'master'
]

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset link. Please request a new one.')
    }
  }, [token])

  // ✅ FIX: Updated password strength function to match validators.ts (6 checks)
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

  // ✅ FIX: Updated canSubmit to require all 6 checks
  const canSubmit = 
    token &&
    strength.score === 6 &&
    passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing reset link. Please request a new one.')
      return
    }

    // ✅ FIX: Updated validation logic to match all 6 checks
    if (strength.score < 6) {
      if (!strength.checks.length) {
        setError('Password must be at least 8 characters.')
      } else if (!strength.checks.common) {
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

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed')
      }

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: 'password' | 'confirmPassword', value: string) => {
    setFormData({ ...formData, [field]: value })
    if (error) setError('')
  }

  // Success state
  if (success) {
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
                <div className="authbody mb-4">
                  <div
                    className="card rounded-4 p-5"
                    style={{
                      boxShadow: '0 4px 20px rgba(20, 104, 53, 0.08)',
                      border: '1px solid var(--bs-border-color)',
                    }}
                  >
                    <div className="card-body p-0 text-center">
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
                      <h1 className="mb-3 fs-2 fw-bold">Password Reset Successfully!</h1>
                      <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                        Your password has been changed. You can now log in with your new password.
                      </p>
                      <p className="mb-4" style={{ color: 'var(--paragraphColor)' }}>
                        Redirecting to login...
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
                  className="card rounded-4 p-sm-5 p-4"
                  style={{
                    boxShadow: '0 4px 20px rgba(20, 104, 53, 0.08)',
                    border: '1px solid var(--bs-border-color)',
                  }}
                >
                  <div className="card-body p-0">
                    {/* Header */}
                    <div className="text-center mb-4">
                      <h1 className="mb-2 fs-2 fw-bold" style={{ color: 'var(--headingColor)' }}>
                        Reset Your Password
                      </h1>
                      <p className="mb-0" style={{ color: 'var(--paragraphColor)' }}>
                        Enter your new password below
                      </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                      <div
                        className="alert d-flex align-items-center mb-4"
                        style={{
                          backgroundColor: 'var(--bs-danger-bg-subtle)',
                          border: '1px solid #f5c2c7',
                          borderRadius: '8px',
                          color: '#842029',
                        }}
                      >
                        <FaTimesCircle className="me-2" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form className="mt-4" onSubmit={handleSubmit} noValidate>
                      <div className="row">
                        {/* Password */}
                        <div className="col-12 mb-4">
                          <label
                            htmlFor="password"
                            className="form-label fw-medium mb-2"
                            style={{ color: 'var(--bs-dark-text)' }}
                          >
                            New Password <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              className="form-control pe-5"
                              placeholder="Enter your new password"
                              required
                              autoComplete="new-password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              disabled={loading || !token}
                              style={{
                                padding: '0.75rem 1rem',
                                fontSize: '1rem',
                                borderColor: 'var(--bs-border-color)',
                                borderRadius: '8px',
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
                                color: 'var(--paragraphColor)',
                              }}
                            >
                              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                          </div>

                          {/* ✅ FIX: Updated Password Strength UI (6 checks) */}
                          {formData.password && (
                            <div className="mt-3">
                              <div className="progress" style={{ height: '4px', borderRadius: '2px' }}>
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${(strength.score / 6) * 100}%`, // Score out of 6
                                    backgroundColor:
                                      strength.score <= 2 ? '#dc3545' :
                                        strength.score <= 4 ? '#ffc107' :
                                          strength.score === 5 ? '#17a2b8' : 'var(--bs-primary)',
                                  }}
                                />
                              </div>
                              <div className="mt-2 row" style={{ fontSize: '0.85rem', color: 'var(--paragraphColor)' }}>
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
                        <div className="col-12 mb-4">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label fw-medium mb-2"
                            style={{ color: 'var(--bs-dark-text)' }}
                          >
                            Confirm New Password <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              id="confirmPassword"
                              className="form-control pe-5"
                              placeholder="Re-enter your new password"
                              required
                              autoComplete="new-password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              disabled={loading || !token}
                              style={{
                                padding: '0.75rem 1rem',
                                fontSize: '1rem',
                                borderColor: formData.confirmPassword && !passwordsMatch
                                  ? '#dc3545'
                                  : passwordsMatch
                                  ? 'var(--bs-primary)'
                                  : 'var(--bs-border-color)',
                                borderRadius: '8px',
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              tabIndex={-1}
                              style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                padding: '0 12px',
                                color: 'var(--paragraphColor)',
                              }}
                            >
                              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                          </div>

                          {/* Match Indicator */}
                          {formData.confirmPassword && (
                            <div
                              className="mt-2 d-flex align-items-center gap-2"
                              style={{
                                fontSize: '0.875rem',
                                color: passwordsMatch ? 'var(--bs-primary)' : '#dc3545',
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

                        {/* Submit Button */}
                        <div className="col-12">
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
                              cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
                              opacity: loading || !canSubmit ? 0.65 : 1,
                            }}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Resetting Password...
                              </>
                            ) : (
                              'Reset Password'
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="authfooter text-center">
                <Link href="/login" className="text-decoration-none" style={{ color: 'var(--bs-primary)' }}>
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border" style={{ color: 'var(--bs-primary)' }} />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}