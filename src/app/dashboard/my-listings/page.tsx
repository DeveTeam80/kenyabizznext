// src/app/dashboard/my-listings/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BsEye, BsPencil, BsTrash, BsPlus, BsClock, BsCheckCircle, BsXCircle } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa6'

interface Listing {
  id: number
  slug: string
  title: string
  logo: string
  image: string
  city: string
  location: string
  approved: boolean
  isVerified: boolean
  statusText: string
  createdAt: string
  updatedAt: string
}

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings')
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/dashboard/my-listings')
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    setDeleting(true)
    setDeleteId(id)

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete listing')
      }

      // Remove from local state
      setListings(listings.filter(l => l.id !== id))
      
      // Show success message (you can use a toast library here)
      alert('Listing deleted successfully')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const getStatusBadge = (listing: Listing) => {
    if (listing.approved) {
      return (
        <span className="badge bg-success text-white d-inline-flex align-items-center gap-1">
          <BsCheckCircle /> Approved
        </span>
      )
    } else {
      return (
        <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
          <BsClock /> Pending Approval
        </span>
      )
    }
  }

  if (loading) {
    return (
      <>
        <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
          <h2 className="fw-medium mb-0">My Listings</h2>
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
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="fw-medium mb-0">My Listings</h2>
          <Link href="/dashboard/add-listing" className="btn btn-primary fw-medium d-inline-flex align-items-center gap-2">
            <BsPlus className="fs-5" />
            Add New Listing
          </Link>
        </div>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="card rounded-3 shadow-sm">
            <div className="card-body text-center py-5">
              <div className="square--80 circle bg-light-primary mx-auto mb-4">
                <BsPlus className="fs-1 text-primary" />
              </div>
              <h4 className="fw-semibold mb-3">No Listings Yet</h4>
              <p className="text-muted mb-4">You haven't created any listings yet. Start by adding your first business listing!</p>
              <Link href="/dashboard/add-listing" className="btn btn-primary fw-medium">
                Add Your First Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="row align-items-start g-4">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="card rounded-3 shadow-sm">
                <div className="card-header py-4 px-4 border-bottom">
                  <h5 className="mb-0">All Listings ({listings.length})</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Listing</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Date Created</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map((listing) => (
                          <tr key={listing.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="square--60 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={listing.logo || listing.image}
                                    width={60}
                                    height={60}
                                    className="img-fluid"
                                    alt={listing.title}
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-semibold">{listing.title}</h6>
                                  <p className="text-muted mb-0 text-sm">{listing.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <p className="mb-0 fw-medium">{listing.city}</p>
                                <p className="text-muted mb-0 text-sm">{listing.location}</p>
                              </div>
                            </td>
                            <td>{getStatusBadge(listing)}</td>
                            <td>
                              <p className="mb-0">{new Date(listing.createdAt).toLocaleDateString()}</p>
                              <p className="text-muted mb-0 text-sm">{new Date(listing.createdAt).toLocaleTimeString()}</p>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-end gap-2">
                                <Link
                                  href={`/listings/${listing.slug}`}
                                  target="_blank"
                                  className="btn btn-sm btn-light-primary"
                                  title="View Listing"
                                >
                                  <BsEye />
                                </Link>
                                <Link
                                  href={`/dashboard/my-listings/edit/${listing.id}`}
                                  className="btn btn-sm btn-light-success"
                                  title="Edit Listing"
                                >
                                  <BsPencil />
                                </Link>
                                <button
                                  onClick={() => handleDelete(listing.id)}
                                  className="btn btn-sm btn-light-danger"
                                  title="Delete Listing"
                                  disabled={deleting && deleteId === listing.id}
                                >
                                  {deleting && deleteId === listing.id ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  ) : (
                                    <BsTrash />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {listings.length > 0 && (
          <div className="row align-items-start g-4 mt-4">
            <div className="col-lg-4 col-md-6">
              <div className="card rounded-3 border-0 bg-light-success">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="fw-bold text-success mb-0">
                        {listings.filter(l => l.approved).length}
                      </h3>
                      <p className="text-muted mb-0">Approved Listings</p>
                    </div>
                    <div className="square--50 circle bg-success text-white">
                      <BsCheckCircle className="fs-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card rounded-3 border-0 bg-light-warning">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="fw-bold text-warning mb-0">
                        {listings.filter(l => !l.approved).length}
                      </h3>
                      <p className="text-muted mb-0">Pending Approval</p>
                    </div>
                    <div className="square--50 circle bg-warning text-white">
                      <BsClock className="fs-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card rounded-3 border-0 bg-light-primary">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="fw-bold text-primary mb-0">{listings.length}</h3>
                      <p className="text-muted mb-0">Total Listings</p>
                    </div>
                    <div className="square--50 circle bg-primary text-white">
                      <BsPlus className="fs-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="row align-items-start g-4 mt-4">
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