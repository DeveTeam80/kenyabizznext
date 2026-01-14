// src/app/admin/payments/page.tsx 

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsSearch, BsCheckCircle, BsXCircle, BsCash, BsFilter } from 'react-icons/bs'

interface Listing {
  id: number
  title: string
  logo: string
  image: string
  slug: string
  isPaid: boolean
  subscriptionTier: string | null
  subscriptionExpiry: Date | null
  user: {
    name: string
    email: string
  }
}

export default function AdminPaymentsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState({
    isPaid: false,
    subscriptionTier: '',
    subscriptionExpiry: ''
  })
  
  // 🆕 BULK ACTIONS STATE
  const [selectedListings, setSelectedListings] = useState<number[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [listings, filter, searchQuery])

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/admin/listings?status=approved')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setListings(data.listings)
    } catch (err) {
      alert('Error fetching listings')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = listings

    // Filter by payment status
    if (filter === 'paid') {
      filtered = filtered.filter(l => l.isPaid)
    } else if (filter === 'free') {
      filtered = filtered.filter(l => !l.isPaid)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.user.name.toLowerCase().includes(query) ||
        l.user.email.toLowerCase().includes(query)
      )
    }

    setFilteredListings(filtered)
  }

  const handleEdit = (listing: Listing) => {
    setEditingId(listing.id)
    setEditData({
      isPaid: listing.isPaid,
      subscriptionTier: listing.subscriptionTier || '',
      subscriptionExpiry: listing.subscriptionExpiry 
        ? new Date(listing.subscriptionExpiry).toISOString().split('T')[0] 
        : ''
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({
      isPaid: false,
      subscriptionTier: '',
      subscriptionExpiry: ''
    })
  }

  const handleSave = async (listingId: number) => {
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPaid: editData.isPaid,
          subscriptionTier: editData.isPaid ? editData.subscriptionTier : null,
          subscriptionExpiry: editData.isPaid && editData.subscriptionExpiry 
            ? new Date(editData.subscriptionExpiry) 
            : null,
        })
      })

      if (!res.ok) throw new Error('Failed to update')

      alert('Payment status updated successfully!')
      setEditingId(null)
      fetchListings()
    } catch (err) {
      alert('Error updating payment status')
    }
  }

  const quickTogglePaid = async (listing: Listing) => {
    const newIsPaid = !listing.isPaid
    
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPaid: newIsPaid,
          subscriptionTier: newIsPaid ? 'basic' : null,
          subscriptionExpiry: null,
        })
      })

      if (!res.ok) throw new Error('Failed to update')

      fetchListings()
    } catch (err) {
      alert('Error toggling payment status')
    }
  }

  // 🆕 BULK ACTION HANDLERS
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedListings(filteredListings.map(l => l.id))
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

  const handleBulkSetPaid = async () => {
    if (selectedListings.length === 0) {
      return alert('Please select listings to update.')
    }

    const tier = window.prompt('Enter tier (basic/premium/enterprise):', 'basic')
    if (!tier) return

    if (!['basic', 'premium', 'enterprise'].includes(tier.toLowerCase())) {
      return alert('Invalid tier. Use: basic, premium, or enterprise')
    }

    const days = window.prompt('Subscription duration in days (leave empty for lifetime):', '365')
    const expiry = days ? new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000) : null

    if (!confirm(`Set ${selectedListings.length} listings to PAID (${tier})?`)) return

    setBulkLoading(true)
    try {
      // Update each listing
      await Promise.all(
        selectedListings.map(id =>
          fetch(`/api/admin/listings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              isPaid: true,
              subscriptionTier: tier.toLowerCase(),
              subscriptionExpiry: expiry,
            })
          })
        )
      )

      alert(`${selectedListings.length} listings set to paid successfully!`)
      setSelectedListings([])
      fetchListings()
    } catch (err) {
      alert('Error updating listings')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkSetFree = async () => {
    if (selectedListings.length === 0) {
      return alert('Please select listings to update.')
    }

    if (!confirm(`Set ${selectedListings.length} listings to FREE?`)) return

    setBulkLoading(true)
    try {
      await Promise.all(
        selectedListings.map(id =>
          fetch(`/api/admin/listings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              isPaid: false,
              subscriptionTier: null,
              subscriptionExpiry: null,
            })
          })
        )
      )

      alert(`${selectedListings.length} listings set to free successfully!`)
      setSelectedListings([])
      fetchListings()
    } catch (err) {
      alert('Error updating listings')
    } finally {
      setBulkLoading(false)
    }
  }

  const stats = {
    total: listings.length,
    paid: listings.filter(l => l.isPaid).length,
    free: listings.filter(l => !l.isPaid).length,
    expiringSoon: listings.filter(l => {
      if (!l.isPaid || !l.subscriptionExpiry) return false
      const daysLeft = Math.ceil((new Date(l.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysLeft <= 7 && daysLeft > 0
    }).length
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">Payment Management</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 bg-light-primary">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold text-primary mb-0">{stats.total}</h4>
                    <p className="text-muted mb-0 small">Total Listings</p>
                  </div>
                  <div className="square--40 circle bg-primary text-white">
                    <BsCash />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 bg-light-success">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold text-success mb-0">{stats.paid}</h4>
                    <p className="text-muted mb-0 small">Premium Paid</p>
                  </div>
                  <div className="square--40 circle bg-success text-white">
                    <BsCheckCircle />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 bg-light-secondary">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold text-secondary mb-0">{stats.free}</h4>
                    <p className="text-muted mb-0 small">Free Listings</p>
                  </div>
                  <div className="square--40 circle bg-secondary text-white">
                    <BsXCircle />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 bg-light-warning">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold text-warning mb-0">{stats.expiringSoon}</h4>
                    <p className="text-muted mb-0 small">Expiring Soon</p>
                  </div>
                  <div className="square--40 circle bg-warning text-white">
                    <BsFilter />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text"><BsSearch /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title or client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="btn-group" role="group">
                  <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    className={`btn ${filter === 'paid' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('paid')}
                  >
                    💎 Paid ({stats.paid})
                  </button>
                  <button
                    className={`btn ${filter === 'free' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter('free')}
                  >
                    🆓 Free ({stats.free})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 BULK ACTIONS */}
        {selectedListings.length > 0 && (
          <div className="alert alert-info d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <span className="fw-medium">
              {selectedListings.length} listing{selectedListings.length > 1 ? 's' : ''} selected
            </span>
            <div className="d-flex gap-2 flex-wrap">
              <button
                onClick={handleBulkSetPaid}
                className="btn btn-sm btn-success"
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Processing...' : `💎 Set to Paid (${selectedListings.length})`}
              </button>
              <button
                onClick={handleBulkSetFree}
                className="btn btn-sm btn-secondary"
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Processing...' : `🆓 Set to Free (${selectedListings.length})`}
              </button>
              <button
                onClick={() => setSelectedListings([])}
                className="btn btn-sm btn-outline-secondary"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Listings Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }} className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                        onChange={handleSelectAll}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </th>
                    <th>Listing</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Tier</th>
                    <th>Expires</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className={selectedListings.includes(listing.id) ? 'table-info' : ''}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => handleSelectOne(listing.id)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="square--50 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={listing.logo || listing.image}
                              width={50}
                              height={50}
                              className="img-fluid"
                              alt={listing.title}
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <h6 className="mb-0">{listing.title}</h6>
                            <small className="text-muted">/{listing.slug}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <p className="mb-0 small fw-medium">{listing.user.name}</p>
                          <p className="mb-0 text-muted small">{listing.user.email}</p>
                        </div>
                      </td>

                      {editingId === listing.id ? (
                        <>
                          {/* EDIT MODE */}
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={editData.isPaid ? 'paid' : 'free'}
                              onChange={(e) => setEditData({
                                ...editData,
                                isPaid: e.target.value === 'paid'
                              })}
                            >
                              <option value="free">🆓 Free</option>
                              <option value="paid">💎 Paid</option>
                            </select>
                          </td>
                          <td>
                            {editData.isPaid && (
                              <select
                                className="form-select form-select-sm"
                                value={editData.subscriptionTier}
                                onChange={(e) => setEditData({
                                  ...editData,
                                  subscriptionTier: e.target.value
                                })}
                              >
                                <option value="">Select...</option>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="enterprise">Enterprise</option>
                              </select>
                            )}
                          </td>
                          <td>
                            {editData.isPaid && (
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={editData.subscriptionExpiry}
                                onChange={(e) => setEditData({
                                  ...editData,
                                  subscriptionExpiry: e.target.value
                                })}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            )}
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                onClick={() => handleSave(listing.id)}
                                className="btn btn-success"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="btn btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* VIEW MODE */}
                          <td>
                            <span className={`badge ${listing.isPaid ? 'bg-success' : 'bg-secondary'}`}>
                              {listing.isPaid ? '💎 Paid' : '🆓 Free'}
                            </span>
                          </td>
                          <td>
                            {listing.subscriptionTier ? (
                              <span className="badge bg-info text-capitalize">
                                {listing.subscriptionTier}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {listing.subscriptionExpiry ? (
                              <small>
                                {new Date(listing.subscriptionExpiry).toLocaleDateString()}
                              </small>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                onClick={() => quickTogglePaid(listing)}
                                className={`btn ${listing.isPaid ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                title={listing.isPaid ? 'Set to Free' : 'Set to Paid'}
                              >
                                {listing.isPaid ? '🆓 Free' : '💎 Paid'}
                              </button>
                              <button
                                onClick={() => handleEdit(listing)}
                                className="btn btn-outline-primary"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No listings match your filters.</p>
          </div>
        )}
      </div>
    </>
  )
}