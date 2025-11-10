'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    BsEye, BsPencil, BsTrash, BsCheckCircle, BsXCircle, BsClock,
    BsGeoAltFill, BsCpu, BsPersonCheck, BsQuestionCircle, BsShieldCheck
} from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa6'

// UPDATED INTERFACE
interface Listing {
    id: number
    slug: string
    title: string
    logo: string
    image: string
    city: string
    location: string
    isGlobal: boolean
    locationVerified: boolean
    locationDetection: string | null
    locationConfirmation: string | null
    approved: boolean
    isVerified: boolean
    statusText: string
    createdAt: string
    user: {
        id: number
        name: string
        email: string
    }
}

// Separate the main content into its own component
function AdminListingsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const status = searchParams.get('status') || 'pending'

    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    
    // 🆕 STATE FOR BULK ACTIONS
    const [selectedListings, setSelectedListings] = useState<number[]>([])
    const [bulkLoading, setBulkLoading] = useState(false)

    useEffect(() => {
        fetchListings()
        // Clear selection when status filter changes for better UX
        setSelectedListings([])
    }, [status])

    const fetchListings = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/listings?status=${status}`)

            if (!res.ok) {
                if (res.status === 403) {
                    router.push('/dashboard')
                    return
                }
                throw new Error('Failed to fetch listings')
            }

            const data = await res.json()
            setListings(data.listings)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (id: number) => {
        if (!confirm('Are you sure you want to approve this listing?')) return
        setActionLoading(id)
        try {
            const res = await fetch(`/api/admin/listings/${id}/approve`, { method: 'POST' })
            if (!res.ok) throw new Error('Failed to approve listing')
            alert('Listing approved successfully!')
            fetchListings()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (id: number) => {
        if (!confirm('Are you sure you want to reject and delete this listing?')) return
        setActionLoading(id)
        try {
            const res = await fetch(`/api/admin/listings/${id}/reject`, { method: 'POST' })
            if (!res.ok) throw new Error('Failed to reject listing')
            alert('Listing rejected and deleted successfully!')
            fetchListings()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to permanently delete this listing?')) return
        setActionLoading(id)
        try {
            const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete listing')
            alert('Listing deleted successfully!')
            fetchListings()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }
    
    const handleVerifyLocation = async (id: number, currentIsGlobal: boolean) => {
        const userChoice = window.confirm(
            `Current location type: ${currentIsGlobal ? 'Global (🌍)' : 'Kenya (🇰🇪)'}\n\n` +
            `Click OK to verify as-is, or Cancel to change it.`
        )
      
        let finalIsGlobal = currentIsGlobal
      
        if (!userChoice) { // User clicked Cancel, wants to change
            const changeToGlobal = window.confirm('Change to Global (outside Kenya)?\n\nOK for Global, Cancel for Kenya.')
            finalIsGlobal = changeToGlobal
        }

        setActionLoading(id)
        try {
            const res = await fetch(`/api/admin/listings/${id}/verify-location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isGlobal: finalIsGlobal,
                    locationVerified: true
                }),
            })
            if (!res.ok) throw new Error('Failed to verify location')
            alert(`Location verified as ${finalIsGlobal ? 'Global 🌍' : 'Kenya 🇰🇪'}!`)
            fetchListings()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }
    
    // 🆕 CHECKBOX HANDLERS
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedListings(listings.map(l => l.id))
        } else {
            setSelectedListings([])
        }
    }

    const handleSelectOne = (id: number) => {
        if (selectedListings.includes(id)) {
            setSelectedListings(selectedListings.filter(lid => lid !== id))
        } else {
            setSelectedListings([...selectedListings, id])
        }
    }

    // 🆕 BULK ACTION HANDLERS
    const handleBulkApprove = async () => {
        if (selectedListings.length === 0) return alert('Please select listings to approve.')
        if (!confirm(`Are you sure you want to approve ${selectedListings.length} listings?`)) return

        setBulkLoading(true)
        try {
            const res = await fetch('/api/admin/listings/bulk-approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingIds: selectedListings }),
            })
            if (!res.ok) throw new Error('Failed to approve listings in bulk.')
            alert(`${selectedListings.length} listings approved successfully!`)
            setSelectedListings([])
            fetchListings()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setBulkLoading(false)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedListings.length === 0) return alert('Please select listings to delete.')
        if (!confirm(`Are you sure you want to permanently delete ${selectedListings.length} listings? This action cannot be undone.`)) return

        setBulkLoading(true)
        try {
            const res = await fetch('/api/admin/listings/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingIds: selectedListings }),
            })
            if (!res.ok) throw new Error('Failed to delete listings in bulk.')
            alert(`${selectedListings.length} listings deleted successfully!`)
            setSelectedListings([])
            fetchListings()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setBulkLoading(false)
        }
    }

    const getStatusBadge = (listing: Listing) => {
        if (listing.approved) {
            return (
                <span className="badge bg-success text-white d-inline-flex align-items-center gap-1">
                    <BsCheckCircle /> Approved
                </span>
            )
        }
        return (
            <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                <BsClock /> Pending
            </span>
        )
    }

    const getLocationBadge = (listing: Listing) => {
        if (listing.locationVerified) {
            return (
                <span className="badge bg-success text-white d-inline-flex align-items-center gap-1" title="Location verified by admin">
                    <BsShieldCheck /> Verified
                </span>
            )
        }
        
        if (listing.locationConfirmation) {
            return (
                <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1" title="User confirmed, needs admin review">
                    <BsPersonCheck /> User Confirmed
                </span>
            )
        }
        
        return (
            <span className="badge bg-secondary text-white d-inline-flex align-items-center gap-1" title="Needs verification">
                <BsQuestionCircle /> Unverified
            </span>
        )
    }

    const getLocationTypeBadge = (listing: Listing) => {
        if (listing.isGlobal) {
            return <span className="badge bg-primary">🌍 Global</span>
        }
        return <span className="badge" style={{ backgroundColor: '#008450', color: 'white' }}>🇰🇪 Kenya</span>
    }

    if (loading) {
        return (
            <>
                <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
                    <h2 className="fw-medium mb-0">Manage Listings</h2>
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
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <h2 className="fw-medium mb-0">Manage Listings</h2>
                    <div className="d-flex gap-2 flex-wrap">
                        <Link href="/admin/listings?status=pending" className={`btn btn-sm ${status === 'pending' ? 'btn-warning' : 'btn-light'}`}>Pending</Link>
                        <Link href="/admin/listings?status=approved" className={`btn btn-sm ${status === 'approved' ? 'btn-success' : 'btn-light'}`}>Approved</Link>
                        <Link href="/admin/listings?status=location-review" className={`btn btn-sm ${status === 'location-review' ? 'btn-info' : 'btn-light'}`}>Location Review</Link>
                        <Link href="/admin/listings?status=all" className={`btn btn-sm ${status === 'all' ? 'btn-primary' : 'btn-light'}`}>All</Link>
                    </div>
                </div>
            </div>

            <div className="dashCaption p-xl-5 p-3 p-md-4">
                {error && (<div className="alert alert-danger mb-4" role="alert">{error}</div>)}

                {selectedListings.length > 0 && (
                    <div className="alert alert-info d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                        <span className="fw-medium">{selectedListings.length} listings selected</span>
                        <div className="d-flex gap-2">
                            {status === 'pending' && (
                                <button
                                    onClick={handleBulkApprove}
                                    className="btn btn-sm btn-success"
                                    disabled={bulkLoading}
                                >
                                    {bulkLoading ? 'Processing...' : `Approve (${selectedListings.length})`}
                                </button>
                            )}
                            <button
                                onClick={handleBulkDelete}
                                className="btn btn-sm btn-danger"
                                disabled={bulkLoading}
                            >
                                {bulkLoading ? 'Processing...' : `Delete (${selectedListings.length})`}
                            </button>
                            <button
                                onClick={() => setSelectedListings([])}
                                className="btn btn-sm btn-secondary"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {listings.length === 0 ? (
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-body text-center py-5">
                            <div className="square--80 circle bg-light-primary mx-auto mb-4">
                                <BsClock className="fs-1 text-primary" />
                            </div>
                            <h4 className="fw-semibold mb-3">No Listings Found</h4>
                            <p className="text-muted mb-0">
                                {status === 'pending' && 'No pending listings at the moment.'}
                                {status === 'approved' && 'No approved listings yet.'}
                                {status === 'location-review' && 'No listings are pending location review.'}
                                {status === 'all' && 'No listings in the system yet.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4 border-bottom">
                            <h5 className="mb-0 text-capitalize">
                                {status.replace('-', ' ')} Listings ({listings.length})
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '50px' }} className="text-center">
                                                <div className="form-check d-flex justify-content-center align-items-center m-0">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input m-0"
                                                        checked={selectedListings.length === listings.length && listings.length > 0}
                                                        onChange={handleSelectAll}
                                                        disabled={listings.length === 0}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                </div>
                                            </th>
                                            <th>Listing</th>
                                            <th>Owner</th>
                                            <th>Location</th>
                                            <th>Type</th>
                                            <th>Location Status</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th className="text-end pe-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listings.map((listing) => (
                                            <tr key={listing.id} className={selectedListings.includes(listing.id) ? 'table-info' : ''}>
                                                <td className="text-center">
                                                    <div className="form-check d-flex justify-content-center align-items-center m-0">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input m-0"
                                                            checked={selectedListings.includes(listing.id)}
                                                            onChange={() => handleSelectOne(listing.id)}
                                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="square--60 rounded overflow-hidden flex-shrink-0">
                                                            <Image src={listing.logo || listing.image || '/img/placeholder.svg'} width={60} height={60} className="img-fluid" alt={listing.title} style={{ objectFit: 'cover' }} />
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0 fw-semibold">{listing.title}</h6>
                                                            <p className="text-muted mb-0 text-sm">{listing.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <p className="mb-0 fw-medium">{listing.user.name}</p>
                                                        <p className="text-muted mb-0 text-sm">{listing.user.email}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <p className="mb-0 fw-medium">{listing.city}</p>
                                                        <p className="text-muted mb-0 text-sm">{listing.location}</p>
                                                    </div>
                                                </td>
                                                <td>{getLocationTypeBadge(listing)}</td>
                                                <td>{getLocationBadge(listing)}</td>
                                                <td>{getStatusBadge(listing)}</td>
                                                <td>
                                                    <p className="mb-0">{new Date(listing.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-muted mb-0 text-sm">{new Date(listing.createdAt).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="pe-3">
                                                    <div className="d-flex align-items-center justify-content-end gap-1 flex-wrap">
                                                        <Link href={`/listings/${listing.slug}`} target="_blank" className="btn btn-sm btn-light-primary" title="View Listing"><BsEye /></Link>
                                                        {!listing.locationVerified && (<button onClick={() => handleVerifyLocation(listing.id, listing.isGlobal)} className="btn btn-sm btn-info" title="Verify Location" disabled={actionLoading === listing.id}>{actionLoading === listing.id ? <span className="spinner-border spinner-border-sm"></span> : <BsGeoAltFill />}</button>)}
                                                        {!listing.approved && (<button onClick={() => handleApprove(listing.id)} className="btn btn-sm btn-success" title="Approve Listing" disabled={actionLoading === listing.id}>{actionLoading === listing.id ? <span className="spinner-border spinner-border-sm"></span> : <BsCheckCircle />}</button>)}
                                                        {!listing.approved && (<button onClick={() => handleReject(listing.id)} className="btn btn-sm btn-warning" title="Reject Listing" disabled={actionLoading === listing.id}>{actionLoading === listing.id ? <span className="spinner-border spinner-border-sm"></span> : <BsXCircle />}</button>)}
                                                        <Link href={`/admin/listings/edit/${listing.id}`} className="btn btn-sm btn-light-info" title="Edit Listing"><BsPencil /></Link>
                                                        <button onClick={() => handleDelete(listing.id)} className="btn btn-sm btn-light-danger" title="Delete Listing" disabled={actionLoading === listing.id}>{actionLoading === listing.id ? <span className="spinner-border spinner-border-sm"></span> : <BsTrash />}</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row align-items-start g-4 mt-4">
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

// Loading component
function AdminListingsLoading() {
    return (
        <>
            <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
                <h2 className="fw-medium mb-0">Manage Listings</h2>
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

// Main export wrapped with Suspense
export default function AdminListingsPage() {
    return (
        <Suspense fallback={<AdminListingsLoading />}>
            <AdminListingsContent />
        </Suspense>
    )
}