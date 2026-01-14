// src/app/admin/listings/edit/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import ListingForm, { ListingFormData } from '@/app/components/admin/listing-form'
import { normalizeWorkingHours, is24_7Hours } from '@/app/lib/listing-helpers'

export default function AdminEditListingPage() {
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
            const res = await fetch(`/api/admin/listings/${listingId}`)

            if (!res.ok) {
                if (res.status === 403) {
                    router.push('/dashboard')
                    return
                }
                throw new Error('Failed to fetch listing')
            }

            const data = await res.json()
            const listing = data.listing

            // Helpers for hours
            const parsedHours = normalizeWorkingHours(listing.workingHours || [])
            const is24_7 = is24_7Hours(listing.workingHours || [])

            // 🟢 Prepare Initial Data
            // We use listing.subCategories (array) directly now
            setInitialData({
                title: listing.title,
                slug: listing.slug,
                desc: listing.desc,
                subCategories: listing.subCategories || [], // 🟢 Updated to Array
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
                workingHours: parsedHours,
                open24_7: is24_7,
                tags: listing.tags || [],
                socials: listing.socials || {},
                locationConfirmation: listing.locationConfirmation,
                // 🆕 FAQs and Reviews
                faqs: listing.faqs || [],
                enableFaqs: listing.enableFaqs || false,
                reviews: listing.reviews || [],
                enableReviews: listing.enableReviews || false,
                ghlFormUrl: listing.ghlFormUrl || '',
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
            // 🟢 Validation: Check subCategories length instead of subCategory string
            if (!data.title || !data.slug || !data.city || !data.desc || !data.call || !data.email || data.subCategories.length === 0) {
                throw new Error('Please fill in all required fields (including at least one subcategory)')
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

                // 🟢 Send the array
                subCategories: data.subCategories,

                call: data.call,
                email: data.email,
                website: data.website,
                ghlFormUrl: data.ghlFormUrl || '',
                // ghlSubAccountId: data.ghlSubAccountId || '',

                // 🟢 Send the categories directly from the form state
                // (Previously this was hacked to include the subcategory, but now we have real multi-select categories)
                categories: data.categories,

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
                // 🆕 Include location fields if needed for updates
                locationConfirmation: data.locationConfirmation,
                // 🆕 FAQs and Reviews
                faqs: data.faqs || [],
                enableFaqs: data.enableFaqs || false,
                reviews: data.reviews || [],
                enableReviews: data.enableReviews || false,
            }

            const res = await fetch(`/api/admin/listings/${listingId}`, {
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
                router.push('/admin/listings?status=all')
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
                    <h2 className="fw-medium mb-0">Edit Listing (Admin)</h2>
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
                    <h2 className="fw-medium mb-0">Edit Listing (Admin)</h2>
                </div>
                <div className="dashCaption p-xl-5 p-3 p-md-4">
                    <div className="text-center py-5">
                        <div className="square--80 circle bg-light-success mx-auto mb-4">
                            <i className="bi bi-check-circle fs-1 text-success"></i>
                        </div>
                        <h3 className="fw-semibold mb-3">Listing Updated Successfully!</h3>
                        <p className="text-muted mb-4">Changes have been saved.</p>
                        <Link href="/admin/listings?status=all" className="btn btn-primary fw-medium">
                            Back to Listings
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
                    <Link href="/admin/listings?status=all" className="btn btn-sm btn-light">
                        ← Back
                    </Link>
                    <h2 className="fw-medium mb-0">Edit Listing (Admin)</h2>
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