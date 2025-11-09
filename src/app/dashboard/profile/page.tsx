// src/app/dashboard/profile/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload'
import { FaHeart } from 'react-icons/fa6'
import { BsPerson, BsEnvelope, BsLock, BsCamera } from 'react-icons/bs'

interface User {
  id: number
  email: string
  name: string
  role: string
  avatar: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      
      if (!res.ok) {
        router.push('/login')
        return
      }

      const data = await res.json()
      setUser(data.user)
      setProfileData({
        name: data.user.name || '',
        email: data.user.email || '',
        avatar: data.user.avatar || '',
      })
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required')
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      fetchUser()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        throw new Error('All password fields are required')
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setSuccess('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
          <h2 className="fw-medium mb-0">My Profile</h2>
        </div>
        <div className="dashCaption p-xl-5 p-3 p-md-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">My Profile</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4" role="alert">
            {success}
          </div>
        )}

        {/* Account Info */}
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header py-4 px-4">
                <h5 className="mb-0">Account Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2"><strong>User ID:</strong> {user?.id}</p>
                    <p className="mb-2"><strong>Role:</strong> <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{user?.role}</span></p>
                    <p className="mb-0"><strong>Member Since:</strong> {user ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile */}
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header py-4 px-4">
                <h5 className="mb-0">
                  <BsPerson className="me-2" />
                  Update Profile
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdateProfile}>
                  <div className="row">
                    {/* Avatar */}
                    <div className="col-xl-12 mb-4">
                      <label className="lableTitle mb-2">
                        <BsCamera className="me-2" />
                        Profile Picture
                      </label>
                      <div className="d-flex align-items-center gap-4">
                        <div className="square--100 rounded-circle overflow-hidden flex-shrink-0 border">
                          <Image
                            src={profileData.avatar || '/img/team-1.jpg'}
                            width={100}
                            height={100}
                            className="img-fluid"
                            alt={profileData.name}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <CloudinaryUpload
                            value={profileData.avatar}
                            onChange={(url) => setProfileData({ ...profileData, avatar: url })}
                            imageType="logo"
                            label="Upload New Avatar"
                            folder="avatars"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-xl-6">
                      <div className="form-group form-border">
                        <label className="lableTitle">Full Name *</label>
                        <input
                          type="text"
                          className="form-control rounded"
                          placeholder="John Doe"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-xl-6">
                      <div className="form-group form-border">
                        <label className="lableTitle">Email Address *</label>
                        <input
                          type="email"
                          className="form-control rounded"
                          placeholder="email@example.com"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-xl-12">
                      <button
                        type="submit"
                        className="btn btn-primary fw-medium px-5"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving...
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header py-4 px-4">
                <h5 className="mb-0">
                  <BsLock className="me-2" />
                  Change Password
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleChangePassword}>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="form-group form-border">
                        <label className="lableTitle">Current Password *</label>
                        <input
                          type="password"
                          className="form-control rounded"
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-xl-6">
                      <div className="form-group form-border">
                        <label className="lableTitle">New Password *</label>
                        <input
                          type="password"
                          className="form-control rounded"
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-xl-6">
                      <div className="form-group form-border">
                        <label className="lableTitle">Confirm New Password *</label>
                        <input
                          type="password"
                          className="form-control rounded"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <button
                        type="submit"
                        className="btn btn-warning fw-medium px-5"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Changing...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="row align-items-start g-4">
          <div className="col-xl-12">
            <p className="text-muted m-0">
              © {new Date().getFullYear()} Kenya Bizz. Developed with <FaHeart className="ms-1 text-danger" /> By Visionary Services
            </p>
          </div>
        </div>
      </div>
    </>
  )
}