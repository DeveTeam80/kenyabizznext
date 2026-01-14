// src/app/components/list-detail/contact-form-ghl.tsx

'use client'

import React, { useState } from 'react'
import { BsEnvelope, BsTelephone, BsGeoAlt } from 'react-icons/bs'

interface ContactFormGHLProps {
  isPaid: boolean
  listingName: string
  listingId: number
  // For paid listings
  ghlFormUrl?: string | null
  // For free listings - show contact details
  phone?: string
  email?: string
  location?: string
}

export default function ContactFormGHL({
  isPaid,
  listingName,
  listingId,
  ghlFormUrl,
  phone,
  email,
  location
}: ContactFormGHLProps) {
  const [showForm, setShowForm] = useState(false)

  // Get GHL form URL based on paid/free status
  const getFormUrl = () => {
    if (isPaid && ghlFormUrl) {
      // Paid: Use their personal form
      return ghlFormUrl
    } else {
      // Free: Use main form with listing name
      const freeFormUrl = process.env.NEXT_PUBLIC_GHL_FREE_FORM_URL || ''
      // Append listing info as URL parameters
      return `${freeFormUrl}?listing_name=${encodeURIComponent(listingName)}&listing_id=${listingId}`
    }
  }

  return (
    <div className="single-widgets border rounded-3 p-4">
      <h4 className="title mb-4">
        {isPaid ? 'Contact Us' : 'Get In Touch'}
      </h4>

      {!isPaid && (
        <>
          {/* FREE LISTINGS: Show limited contact info */}
          <div className="alert alert-info mb-3">
            <small>
              <strong>Contact this business:</strong> Fill out the form below to get in touch.
            </small>
          </div>
        </>
      )}

      {isPaid && phone && (
        <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded">
          <BsTelephone className="text-primary fs-5" />
          <div>
            <small className="text-muted d-block">Phone</small>
            <a href={`tel:${phone}`} className="fw-semibold text-decoration-none">
              {phone}
            </a>
          </div>
        </div>
      )}

      {isPaid && email && (
        <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded">
          <BsEnvelope className="text-primary fs-5" />
          <div>
            <small className="text-muted d-block">Email</small>
            <a href={`mailto:${email}`} className="fw-semibold text-decoration-none">
              {email}
            </a>
          </div>
        </div>
      )}

      {isPaid && location && (
        <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded">
          <BsGeoAlt className="text-primary fs-5" />
          <div>
            <small className="text-muted d-block">Location</small>
            <span className="fw-semibold">{location}</span>
          </div>
        </div>
      )}

      <div className="mb-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary w-100"
        >
          {showForm ? 'Hide Contact Form' : 'Send Message'}
        </button>
      </div>

      {showForm && (
        <div className="ghl-form-container">
          <iframe
            src={getFormUrl()}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              borderRadius: '8px'
            }}
            title={`Contact ${listingName}`}
          />
          
          {!isPaid && (
            <small className="text-muted d-block mt-2">
              Note: Contact details are hidden. Please use the form above.
            </small>
          )}
        </div>
      )}

      {!isPaid && !showForm && (
        <div className="alert alert-light border mt-3">
          <small className="text-muted">
            <strong>Premium Feature:</strong> Upgrade to show direct contact details and get your own custom form.
          </small>
        </div>
      )}
    </div>
  )
}