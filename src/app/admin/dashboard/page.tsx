// src/app/admin/dashboard/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsCheckCircle, BsClock, BsGeoAlt, BsList, BsPeople, BsXCircle } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa6'

interface Stats {
    totalListings: number
    pendingListings: number
    approvedListings: number
    totalUsers: number
    needsLocationReview: number  // 🆕 Add this
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [stats, setStats] = useState<Stats>({
        totalListings: 0,
        pendingListings: 0,
        approvedListings: 0,
        totalUsers: 0,
        needsLocationReview: 0,
    })
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        fetchUserAndStats()
    }, [])

    const fetchUserAndStats = async () => {
        try {
            // Fetch current user
            const userRes = await fetch('/api/auth/me')
            if (!userRes.ok || userRes.status === 401) {
                router.push('/login')
                return
            }
            const userData = await userRes.json()

            // Check if admin
            if (userData.user.role !== 'admin') {
                router.push('/dashboard')
                return
            }

            setUser(userData.user)

            // Fetch stats
            const statsRes = await fetch('/api/admin/stats')
            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
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
                    <h2 className="fw-medium mb-0">Admin Dashboard</h2>
                    <button
                        onClick={handleLogout}
                        className="btn btn-sm btn-light-danger fw-medium rounded-pill"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashCaption p-xl-5 p-3 p-md-4">
                {/* Welcome Message */}
                <div className="row align-items-start g-4 mb-4">
                    <div className="col-xl-12">
                        <div className="alert alert-primary" role="alert">
                            <strong>Welcome, {user?.name || 'Admin'}!</strong> Manage all listings and users from here.
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row align-items-start g-4 mb-lg-5 mb-4">
                    <div className="col-lg-3 col-md-6">
                        <div className="card rounded-3 border-0 bg-light-warning">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold text-warning mb-0">{stats.pendingListings}</h3>
                                        <p className="text-muted mb-0">Pending Approval</p>
                                    </div>
                                    <div className="square--50 circle bg-warning text-white">
                                        <BsClock className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card rounded-3 border-0 bg-light-success">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold text-success mb-0">{stats.approvedListings}</h3>
                                        <p className="text-muted mb-0">Approved</p>
                                    </div>
                                    <div className="square--50 circle bg-success text-white">
                                        <BsCheckCircle className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card rounded-3 border-0 bg-light-primary">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold text-primary mb-0">{stats.totalListings}</h3>
                                        <p className="text-muted mb-0">Total Listings</p>
                                    </div>
                                    <div className="square--50 circle bg-primary text-white">
                                        <BsList className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card rounded-3 border-0 bg-light-info">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold text-info mb-0">{stats.totalUsers}</h3>
                                        <p className="text-muted mb-0">Total Users</p>
                                    </div>
                                    <div className="square--50 circle bg-info text-white">
                                        <BsPeople className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card rounded-3 border-0 bg-light-danger">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="fw-bold text-danger mb-0">{stats.needsLocationReview}</h3>
                                    <p className="text-muted mb-0">Needs Location Review</p>
                                </div>
                                <div className="square--50 circle bg-danger text-white">
                                    <BsGeoAlt className="fs-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row align-items-start g-4 mb-lg-5 mb-4">
                    <div className="col-xl-12">
                        <h5 className="fw-semibold mb-3">Quick Actions</h5>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link href="/admin/listings?status=pending" className="text-decoration-none">
                            <div className="card rounded-3 position-relative p-4 hover-shadow border-warning" style={{ borderWidth: '2px' }}>
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="square--60 circle bg-warning text-white mb-3">
                                        <BsClock className="fs-2" />
                                    </div>
                                    <h5 className="fw-semibold mb-2">Review Pending Listings</h5>
                                    <p className="text-muted mb-0">{stats.pendingListings} listings awaiting approval</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link href="/admin/listings?status=all" className="text-decoration-none">
                            <div className="card rounded-3 position-relative p-4 hover-shadow">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="square--60 circle bg-primary text-white mb-3">
                                        <BsList className="fs-2" />
                                    </div>
                                    <h5 className="fw-semibold mb-2">All Listings</h5>
                                    <p className="text-muted mb-0">View and manage all listings</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link href="/admin/users" className="text-decoration-none">
                            <div className="card rounded-3 position-relative p-4 hover-shadow">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="square--60 circle bg-info text-white mb-3">
                                        <BsPeople className="fs-2" />
                                    </div>
                                    <h5 className="fw-semibold mb-2">Manage Users</h5>
                                    <p className="text-muted mb-0">View and manage user accounts</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <Link href="/admin/listings?status=location-review" className="text-decoration-none">
                            <div className="card rounded-3 position-relative p-4 hover-shadow border-danger" style={{ borderWidth: '2px' }}>
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="square--60 circle bg-danger text-white mb-3">
                                        <BsGeoAlt className="fs-2" />
                                    </div>
                                    <h5 className="fw-semibold mb-2">Review Locations</h5>
                                    <p className="text-muted mb-0">{stats.needsLocationReview} listings need location verification</p>
                                </div>
                            </div>
                        </Link>
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