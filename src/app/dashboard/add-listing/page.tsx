// src/app/dashboard/add-listing/page.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ListingForm, { ListingFormData } from '@/app/components/admin/listing-form'

export default function AddListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: ListingFormData) => {
    setError('')
    setLoading(true)

    try {
      // Validate required fields
      if (!data.title || !data.slug || !data.city || !data.desc || !data.call || !data.email) {
        throw new Error('Please fill in all required fields')
      }

      if (!data.logo || !data.image || !data.bannerImage) {
        throw new Error('Please upload all required images (logo, main image, and banner)')
      }

      // Prepare data for API
      const listingData = {
        slug: data.slug,
        title: data.title,
        desc: data.desc,
        logo: data.logo,
        image: data.image,
        bannerImage: data.bannerImage,
        city: data.city,
        location: data.location,
        subCategory: data.subCategory,
        call: data.call,
        email: data.email,
        website: data.website,
        categories: [
          {
            slug: data.subCategory,
            name: data.subCategory,
            isPrimary: true
          }
        ],
        fullDescription: data.fullDescription.filter(p => p.trim() !== ''),
        locations: data.locations,
        contentSectionTitle: data.contentSectionTitle,
        contentBlocks: data.contentBlocks,
        workingHours: data.open24_7 
          ? [{ day: 'All Days', hours: '24/7' }]
          : data.workingHours
              .filter(wh => wh.opening && wh.closing)
              .map(wh => ({
                day: wh.day,
                hours: `${wh.opening} - ${wh.closing}`
              })),
        tags: data.tags,
        socials: data.socials,
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to create listing')
      }

      setSuccess(true)
      
      setTimeout(() => {
        router.push('/dashboard/my-listings')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
          <h2 className="fw-medium mb-0">Add New Listing</h2>
        </div>
        <div className="dashCaption p-xl-5 p-3 p-md-4">
          <div className="text-center py-5">
            <div className="square--80 circle bg-light-success mx-auto mb-4">
              <i className="bi bi-check-circle fs-1 text-success"></i>
            </div>
            <h3 className="fw-semibold mb-3">Listing Submitted Successfully!</h3>
            <p className="text-muted mb-4">Your listing has been submitted for admin approval.</p>
            <Link href="/dashboard/my-listings" className="btn btn-primary fw-medium">
              View My Listings
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">Add New Listing</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <ListingForm
          onSubmit={handleSubmit}
          submitLabel="Submit for Approval"
          loading={loading}
          error={error}
          isEdit={false}
        />
      </div>
    </>
  )
}