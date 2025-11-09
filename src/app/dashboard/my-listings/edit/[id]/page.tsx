// src/app/dashboard/my-listings/edit/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import ListingForm, { ListingFormData } from '@/app/components/admin/listing-form'
import { extractSubCategory, normalizeWorkingHours, is24_7Hours } from '@/app/lib/listing-helpers'


export default function EditListingPage() {
    const router = useRouter()
    const params = useParams()
    const listingId = params.id as string

    const [initialData, setInitialData] = useState<Partial<ListingFormData> | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetchListing()
    }, [listingId])

    const fetchListing = async () => {
        try {
            const res = await fetch(`/api/listings/${listingId}`)

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login')
                    return
                }
                if (res.status === 404) {
                    setError('Listing not found')
                    return
                }
                throw new Error('Failed to fetch listing')
            }

            const data = await res.json()
            const listing = data.listing
           // 🆕 USE THE HELPER FUNCTIONS HERE
      const subCategory = extractSubCategory(listing.categories)
      const parsedHours = normalizeWorkingHours(listing.workingHours || [])
      const is24_7 = is24_7Hours(listing.workingHours || [])

            setInitialData({
                title: listing.title,
                slug: listing.slug,
                desc: listing.desc,
                subCategory: subCategory, // 🆕 Use extracted slug
                logo: listing.logo,
                image: listing.image,
                bannerImage: listing.bannerImage,
                city: listing.city,
                location: listing.location,
                call: listing.call,
                email: listing.email,
                website: listing.website,
                categories: listing.categories || [],
                fullDescription: listing.fullDescription || [''],
                locations: listing.locations || [],
                contentSectionTitle: listing.contentSectionTitle || '',
                contentBlocks: listing.contentBlocks || [],
                workingHours: parsedHours, // 🆕 Use normalized hours
                open24_7: is24_7,
                tags: listing.tags || [],
                socials: listing.socials || {},
                locationConfirmation: listing.locationConfirmation,
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: ListingFormData) => {
        setError('')
        setSaving(true)

        try {
            if (!data.title || !data.slug || !data.city || !data.desc || !data.call || !data.email) {
                throw new Error('Please fill in all required fields')
            }

            if (!data.logo || !data.image || !data.bannerImage) {
                throw new Error('Please upload all required images')
            }

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
                locationConfirmation: data.locationConfirmation, // 🆕 Include location confirmation
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

            const res = await fetch(`/api/listings/${listingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listingData),
            })

            const responseData = await res.json()

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to update listing')
            }

            setSuccess(true)

            setTimeout(() => {
                router.push('/dashboard/my-listings')
            }, 2000)

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
                    <h2 className="fw-medium mb-0">Edit Listing</h2>
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

    if (success) {
        return (
            <>
                <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
                    <h2 className="fw-medium mb-0">Edit Listing</h2>
                </div>
                <div className="dashCaption p-xl-5 p-3 p-md-4">
                    <div className="text-center py-5">
                        <div className="square--80 circle bg-light-success mx-auto mb-4">
                            <i className="bi bi-check-circle fs-1 text-success"></i>
                        </div>
                        <h3 className="fw-semibold mb-3">Listing Updated Successfully!</h3>
                        <p className="text-muted mb-4">Your changes have been submitted for admin re-approval.</p>
                        <Link href="/dashboard/my-listings" className="btn btn-primary fw-medium">
                            Back to My Listings
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
                <div className="d-flex align-items-center gap-3">
                    <Link href="/dashboard/my-listings" className="btn btn-sm btn-light">
                        ← Back
                    </Link>
                    <h2 className="fw-medium mb-0">Edit Listing</h2>
                </div>
            </div>

            <div className="dashCaption p-xl-5 p-3 p-md-4">
                {initialData && (
                    <ListingForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        submitLabel="Update Listing"
                        loading={saving}
                        error={error}
                        isEdit={true}
                    />
                )}
            </div>
        </>
    )
}