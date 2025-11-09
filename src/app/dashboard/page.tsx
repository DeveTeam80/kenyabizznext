// src/app/dashboard/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaHeart } from 'react-icons/fa6'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="fw-medium mb-0">Hello, {user?.name || 'User'}!</h2>
          <button 
            onClick={handleLogout}
            className="btn btn-sm btn-light-danger fw-medium rounded-pill"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-4">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="alert alert-primary" role="alert">
              <strong>Welcome to your dashboard!</strong> Manage your listings and profile here.
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
            <Link href="/dashboard/add-listing" className="text-decoration-none">
              <div className="card rounded-3 position-relative p-4 hover-shadow">
                <div className="d-flex flex-column align-items-center text-center">
                  <div className="square--60 circle bg-light-primary mb-3">
                    <i className="bi bi-plus-circle fs-2 text-primary"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">Add New Listing</h5>
                  <p className="text-muted mb-0">Submit your business for approval</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
            <Link href="/dashboard/my-listings" className="text-decoration-none">
              <div className="card rounded-3 position-relative p-4 hover-shadow">
                <div className="d-flex flex-column align-items-center text-center">
                  <div className="square--60 circle bg-light-success mb-3">
                    <i className="bi bi-list-ul fs-2 text-success"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">My Listings</h5>
                  <p className="text-muted mb-0">View and manage your listings</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
            <Link href="/dashboard/profile" className="text-decoration-none">
              <div className="card rounded-3 position-relative p-4 hover-shadow">
                <div className="d-flex flex-column align-items-center text-center">
                  <div className="square--60 circle bg-light-info mb-3">
                    <i className="bi bi-person fs-2 text-info"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">My Profile</h5>
                  <p className="text-muted mb-0">Update your account details</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="row align-items-start g-4">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <p className="text-muted m-0">
              © {new Date().getFullYear()} Kenya Bizz. Developed with <FaHeart className="ms-1 text-danger" /> By Visionary Services
            </p>
          </div>
        </div>
      </div>
    </>
  )
}