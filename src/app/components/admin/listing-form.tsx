// src/app/components/admin/listing-form.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const Select = dynamic(() => import('react-select'), { ssr: false })
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false }) // 🆕 Add this


import ImageUpload from '@/app/components/admin/image-uplod'
import SingleImageUpload from '@/app/components/admin/single-image-upload'
import { KENYAN_CITIES, detectLocationContext, LocationDetectionResult } from '@/app/lib/location-detection'
import { FaFile, FaHeart } from 'react-icons/fa6'
import {
    BsArrowRightCircle, BsGeoAlt, BsImages, BsPatchQuestionFill,
    BsStopwatch, BsTextParagraph, BsHash, BsGlobe,
    BsInfoCircle, BsBuilding, BsCheckCircle, BsExclamationCircle,
    BsQuestionCircle
} from 'react-icons/bs'

export interface ListingFormData {
    // Basic Info
    title: string
    slug: string
    desc: string
    subCategories: string[]
    logo: string
    image: string
    bannerImage: string
    city: string
    location: string
    call: string
    email: string
    website: string
    categories: { slug: string; name: string; isPrimary: boolean }[]
    fullDescription: string[]
    locations: {
        branchName: string
        address: string
        contactPerson?: string
        phone: string
        email?: string
        mapEmbedUrl?: string
    }[]
    contentSectionTitle: string
    contentBlocks: {
        title: string
        description: string
        image: string
    }[]
    workingHours: { day: string; opening: string; closing: string }[]
    open24_7: boolean
    tags: string[]
    socials: {
        facebook?: string
        instagram?: string
        linkedin?: string
        twitter?: string
        youtube?: string
        whatsapp?: string
        tiktok?: string
    }
    // 🆕 New location fields
    locationConfirmation?: 'kenya' | 'other'
    // 🆕 FAQs and Reviews (Premium Features)
    faqs: { question: string; answer: string }[]
    enableFaqs: boolean
    reviews: { title: string; comment: string; name: string; designation: string; rating: number; date?: string }[]
    enableReviews: boolean
    // 🆕 Go High Level Form URL
    ghlFormUrl?: string
}

interface ListingFormProps {
    initialData?: Partial<ListingFormData>
    onSubmit: (data: ListingFormData) => Promise<void>
    submitLabel: string
    loading: boolean
    error: string
    isEdit?: boolean
}

export default function ListingForm({
    initialData,
    onSubmit,
    submitLabel,
    loading,
    error,
    isEdit = false
}: ListingFormProps) {

    const [formData, setFormData] = useState<ListingFormData>({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        desc: initialData?.desc || '',
        subCategories: initialData?.subCategories || [],
        logo: initialData?.logo || '',
        image: initialData?.image || '',
        bannerImage: initialData?.bannerImage || '',
        city: initialData?.city || '',
        location: initialData?.location || '',
        call: initialData?.call || '',
        email: initialData?.email || '',
        website: initialData?.website || '',
        categories: initialData?.categories || [],
        fullDescription: initialData?.fullDescription || [''],
        locations: initialData?.locations || [{
            branchName: 'Main Branch',
            address: '',
            phone: '',
            email: '',
        }],
        contentSectionTitle: initialData?.contentSectionTitle || '',
        contentBlocks: initialData?.contentBlocks || [],
        workingHours: initialData?.workingHours || [ // Already normalized
            { day: 'Monday', opening: '', closing: '' },
            { day: 'Tuesday', opening: '', closing: '' },
            { day: 'Wednesday', opening: '', closing: '' },
            { day: 'Thursday', opening: '', closing: '' },
            { day: 'Friday', opening: '', closing: '' },
            { day: 'Saturday', opening: '', closing: '' },
            { day: 'Sunday', opening: '', closing: '' },
        ],
        open24_7: initialData?.open24_7 || false,
        tags: initialData?.tags || [],
        socials: initialData?.socials || {},
        locationConfirmation: initialData?.locationConfirmation,
        // 🆕 FAQs and Reviews
        faqs: initialData?.faqs || [],
        enableFaqs: initialData?.enableFaqs || false,
        reviews: initialData?.reviews || [],
        enableReviews: initialData?.enableReviews || false,
        // 🆕 Go High Level Form URL
        ghlFormUrl: initialData?.ghlFormUrl || '',
    })
    const [selectedCategories, setSelectedCategories] = useState<Array<{ slug: string, name: string, isPrimary: boolean }>>(
        initialData?.categories || []
    )
    const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string, label: string }>>([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    // Fixed category options (curated, cannot be created by users)
    // const categoryOptions = [
    //     { value: 'real-estate', label: 'Real Estate' },
    //     { value: 'manufacturing', label: 'Manufacturing' },
    //     { value: 'services', label: 'Services' },
    //     { value: 'technology', label: 'Technology' },
    //     { value: 'shops-suppliers', label: 'Shops & Suppliers' },
    //     { value: 'healthcare', label: 'Healthcare' },
    //     { value: 'education', label: 'Education' },
    //     { value: 'hospitality', label: 'Hospitality & Tourism' },
    //     { value: 'finance', label: 'Finance & Banking' },
    //     { value: 'automotive', label: 'Automotive' },
    //     { value: 'construction', label: 'Construction' },
    //     { value: 'agriculture', label: 'Agriculture' },
    //     { value: 'logistics', label: 'Logistics & Transportation' },
    //     { value: 'media', label: 'Media & Entertainment' },
    // ]
    // SubCategory options from database
    const [subCategoryOptions, setSubCategoryOptions] = useState<Array<{ value: string, label: string }>>([])
    const [loadingSubCategories, setLoadingSubCategories] = useState(false)
    // Add useEffect to fetch categories on mount:
    useEffect(() => {
        fetchCategories()
    }, [])

    // Add fetch function:
    const fetchCategories = async () => {
        setLoadingCategories(true)
        try {
            const res = await fetch('/api/admin/categories')
            if (res.ok) {
                const data = await res.json()
                const options = data.categories
                    .filter((cat: any) => cat.isActive) // Only show active categories
                    .map((cat: any) => ({
                        value: cat.slug,
                        label: cat.name
                    }))
                setCategoryOptions(options)
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        } finally {
            setLoadingCategories(false)
        }
    }

    // Fetch subcategories when categories change
    useEffect(() => {
        if (selectedCategories.length > 0) {
            fetchSubCategories()
        }
    }, [selectedCategories])

    const fetchSubCategories = async (searchQuery?: string) => {
        setLoadingSubCategories(true)
        try {
            // Get all selected category slugs
            const categorySlugs = selectedCategories.map(c => c.slug).join(',')

            const params = new URLSearchParams({
                categories: categorySlugs, // Search across all selected categories
                limit: '20',
            })

            if (searchQuery && searchQuery.length >= 2) {
                params.append('search', searchQuery)
            }

            const res = await fetch(`/api/subcategories?${params}`)
            if (res.ok) {
                const data = await res.json()
                setSubCategoryOptions(data.subCategories || [])
            }
        } catch (error) {
            console.error('Failed to fetch subcategories:', error)
        } finally {
            setLoadingSubCategories(false)
        }
    }

    // Handle category selection
    const handleCategoryChange = (selectedOptions: any) => {
        const newCategories = selectedOptions.map((opt: any, index: number) => ({
            slug: opt.value,
            name: opt.label,
            isPrimary: index === 0, // First one is primary by default
        }))

        setSelectedCategories(newCategories)
        setFormData({
            ...formData,
            categories: newCategories
        })
    }

    // Set primary category
    const setPrimaryCategory = (slug: string) => {
        const updatedCategories = selectedCategories.map(cat => ({
            ...cat,
            isPrimary: cat.slug === slug
        }))

        setSelectedCategories(updatedCategories)
        setFormData({
            ...formData,
            categories: updatedCategories
        })
    }


    const timeOptions = [
        { value: 'Closed', label: 'Closed' },
        { value: '6:00 AM', label: '6:00 AM' },
        { value: '7:00 AM', label: '7:00 AM' },
        { value: '8:00 AM', label: '8:00 AM' },
        { value: '9:00 AM', label: '9:00 AM' },
        { value: '10:00 AM', label: '10:00 AM' },
        { value: '11:00 AM', label: '11:00 AM' },
        { value: '12:00 PM', label: '12:00 PM' },
        { value: '1:00 PM', label: '1:00 PM' },
        { value: '2:00 PM', label: '2:00 PM' },
        { value: '3:00 PM', label: '3:00 PM' },
        { value: '4:00 PM', label: '4:00 PM' },
        { value: '5:00 PM', label: '5:00 PM' },
        { value: '6:00 PM', label: '6:00 PM' },
        { value: '7:00 PM', label: '7:00 PM' },
        { value: '8:00 PM', label: '8:00 PM' },
        { value: '9:00 PM', label: '9:00 PM' },
        { value: '10:00 PM', label: '10:00 PM' },
    ]

    // 🆕 City input states
    const [showCustomCityInput, setShowCustomCityInput] = useState(false)
    const [cityInput, setCityInput] = useState(formData.city)
    const [locationDetection, setLocationDetection] = useState<LocationDetectionResult | null>(null)

    // 🔧 Fix: Check if initial city is in Kenyan cities list
    useEffect(() => {
        const cityFromData = initialData?.city
        if (cityFromData) {
            const isKenyanCity = KENYAN_CITIES.slice(0, 10).some(
                city => city.toLowerCase() === cityFromData.toLowerCase()
            )
            setShowCustomCityInput(!isKenyanCity)
            setCityInput(cityFromData)
        }
    }, [initialData?.city])

    // 🆕 Detect location when city changes
    useEffect(() => {
        if (cityInput && showCustomCityInput) {
            const detection = detectLocationContext(cityInput)
            setLocationDetection(detection)
        } else {
            setLocationDetection(null)
        }
    }, [cityInput, showCustomCityInput])

    // 🆕 Handle city change
    const handleCityChange = (value: string) => {
        setCityInput(value)
        setFormData(prev => ({ ...prev, city: value, locationConfirmation: undefined }))
    }

    // 🆕 City dropdown options
    const cityDropdownOptions = [
        ...KENYAN_CITIES.slice(0, 10).map(city => ({ value: city, label: city })),
        { value: 'CUSTOM', label: '✏️ Enter Custom City/Town' }
    ]

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setFormData({
            ...formData,
            title: value,
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        })
    }

    // Handle working hours
    const handleWorkingHourChange = (index: number, field: 'opening' | 'closing', value: string) => {
        const newHours = [...formData.workingHours]
        newHours[index] = { ...newHours[index], [field]: value }
        setFormData({ ...formData, workingHours: newHours })
    }

    // Handle full description paragraphs
    const addDescriptionParagraph = () => {
        setFormData({ ...formData, fullDescription: [...formData.fullDescription, ''] })
    }

    const updateDescriptionParagraph = (index: number, value: string) => {
        const newDesc = [...formData.fullDescription]
        newDesc[index] = value
        setFormData({ ...formData, fullDescription: newDesc })
    }

    const removeDescriptionParagraph = (index: number) => {
        if (formData.fullDescription.length > 1) {
            setFormData({
                ...formData,
                fullDescription: formData.fullDescription.filter((_, i) => i !== index)
            })
        }
    }

    // Handle multiple locations/branches
    const addLocation = () => {
        setFormData({
            ...formData,
            locations: [...formData.locations, {
                branchName: '',
                address: '',
                phone: '',
                email: '',
            }]
        })
    }

    const updateLocation = (index: number, field: string, value: string) => {
        const newLocations = [...formData.locations]
        newLocations[index] = { ...newLocations[index], [field]: value }
        setFormData({ ...formData, locations: newLocations })
    }

    const removeLocation = (index: number) => {
        if (formData.locations.length > 1) {
            setFormData({
                ...formData,
                locations: formData.locations.filter((_, i) => i !== index)
            })
        }
    }

    // Handle content blocks (gallery with descriptions)
    const addContentBlock = () => {
        setFormData({
            ...formData,
            contentBlocks: [...formData.contentBlocks, { title: '', description: '', image: '' }]
        })
    }

    const updateContentBlock = (index: number, field: string, value: string) => {
        const newBlocks = [...formData.contentBlocks]
        newBlocks[index] = { ...newBlocks[index], [field]: value }
        setFormData({ ...formData, contentBlocks: newBlocks })
    }

    const removeContentBlock = (index: number) => {
        setFormData({
            ...formData,
            contentBlocks: formData.contentBlocks.filter((_, i) => i !== index)
        })
    }

    // 🆕 Handle FAQs
    const addFaq = () => {
        setFormData({
            ...formData,
            faqs: [...formData.faqs, { question: '', answer: '' }]
        })
    }

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...formData.faqs]
        newFaqs[index] = { ...newFaqs[index], [field]: value }
        setFormData({ ...formData, faqs: newFaqs })
    }

    const removeFaq = (index: number) => {
        setFormData({
            ...formData,
            faqs: formData.faqs.filter((_, i) => i !== index)
        })
    }

    // 🆕 Handle Reviews
    const addReview = () => {
        setFormData({
            ...formData,
            reviews: [...formData.reviews, {
                title: '',
                comment: '',
                name: '',
                designation: '',
                rating: 5,
                date: new Date().toISOString().split('T')[0]
            }]
        })
    }

    const updateReview = (index: number, field: string, value: string | number) => {
        const newReviews = [...formData.reviews]
        newReviews[index] = { ...newReviews[index], [field]: value }
        setFormData({ ...formData, reviews: newReviews })
    }

    const removeReview = (index: number) => {
        setFormData({
            ...formData,
            reviews: formData.reviews.filter((_, i) => i !== index)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger mb-4" role="alert">
                    {error}
                </div>
            )}

            {isEdit && (
                <div className="alert alert-info mb-4">
                    <BsInfoCircle className="me-2" />
                    <strong>Note:</strong> After editing, your listing will need admin re-approval before going live again.
                </div>
            )}

            {/* 1. BASIC INFORMATION */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <FaFile className="text-primary me-2" />
                                Basic Information
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            Business Name *
                                            <BsPatchQuestionFill className="lableTip ms-1" title="Official name of your business" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded"
                                            placeholder="e.g., SMB Properties"
                                            value={formData.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">URL Slug (auto-generated)</label>
                                        <input
                                            type="text"
                                            className="form-control rounded bg-light"
                                            value={formData.slug}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* CATEGORIES SECTION */}
                                <div className="col-xl-12">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            Business Categories * (Select all that apply)
                                            <BsPatchQuestionFill className="lableTip ms-1" title="Select all categories your business operates in" />
                                        </label>
                                        <Select
                                            options={categoryOptions}
                                            placeholder={loadingCategories ? "Loading categories..." : "Select categories..."}
                                            className="categories"
                                            isMulti
                                            value={selectedCategories.map(cat => ({
                                                value: cat.slug,
                                                label: cat.name
                                            }))}
                                            onChange={handleCategoryChange}
                                            isLoading={loadingCategories}
                                            isDisabled={loadingCategories}
                                            required
                                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                        <small className="text-muted mt-1 d-block">
                                            Select all categories your business operates in (e.g., Real Estate + Manufacturing + Services)
                                        </small>
                                    </div>
                                </div>

                                {/* PRIMARY CATEGORY SELECTION */}
                                {selectedCategories.length > 1 && (
                                    <div className="col-xl-12">
                                        <div className="alert alert-info py-3">
                                            <label className="lableTitle mb-2">
                                                <BsInfoCircle className="me-2" />
                                                Select Primary Category (for URL/Listing Page)
                                            </label>
                                            <p className="small text-muted mb-2">
                                                This determines which category page your listing appears on:
                                                <code className="ms-1">/listings/{selectedCategories.find(c => c.isPrimary)?.slug || 'category'}/your-business</code>
                                            </p>
                                            <div className="d-flex flex-wrap gap-2">
                                                {selectedCategories.map((cat) => (
                                                    <button
                                                        key={cat.slug}
                                                        type="button"
                                                        className={`btn btn-sm ${cat.isPrimary ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => setPrimaryCategory(cat.slug)}
                                                    >
                                                        {cat.isPrimary && <BsCheckCircle className="me-1" />}
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUBCATEGORY */}
                                <div className="col-xl-12">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            SubCategories / Specialization *
                                            <BsPatchQuestionFill className="lableTip ms-1" title="Specific business type or specialization" />
                                        </label>
                                        <CreatableSelect
                                            isMulti
                                            options={subCategoryOptions}
                                            placeholder={
                                                selectedCategories.length === 0
                                                    ? "Select categories first..."
                                                    : loadingSubCategories
                                                        ? "Loading suggestions..."
                                                        : "Type or select subcategory..."
                                            }
                                            className="subcategories"
                                            // 1. Map string[] to {label, value} objects for display
                                            value={formData.subCategories.map(tag => ({
                                                label: tag,
                                                value: tag
                                            }))}

                                            // 2. 🟢 FIX: Add ': any' to newValue to fix the TypeScript error
                                            onChange={(newValue: any) => {
                                                // newValue is an array of objects: [{label: 'A', value: 'A'}, ...]
                                                // We map it back to a simple string array: ['A']
                                                const tags = newValue.map((option: any) => option.value);
                                                setFormData({
                                                    ...formData,
                                                    subCategories: tags
                                                })
                                            }}

                                            // 3. Handle typing/searching
                                            onInputChange={(inputValue) => {
                                                if (inputValue.length >= 2) {
                                                    fetchSubCategories(inputValue)
                                                }
                                            }}

                                            // 4. Handle creating a NEW option (when they press Enter on a new word)
                                            onCreateOption={(inputValue) => {
                                                const newTags = [...formData.subCategories, inputValue];
                                                setFormData({
                                                    ...formData,
                                                    subCategories: newTags
                                                })
                                            }}

                                            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                            isDisabled={selectedCategories.length === 0}
                                            isLoading={loadingSubCategories}
                                            isClearable
                                            required={formData.subCategories.length === 0}
                                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                menu: base => ({ ...base, maxHeight: '250px' })
                                            }}
                                            noOptionsMessage={() =>
                                                selectedCategories.length === 0
                                                    ? "Select categories first"
                                                    : "No suggestions found. Type to create new."
                                            }
                                        />
                                        <small className="text-muted mt-1 d-block">
                                            Examples: "Luxury Hotels", "Property Development", "Glass Manufacturing", "Diversified Conglomerate"
                                        </small>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            Short Description *
                                            <BsPatchQuestionFill className="lableTip ms-1" title="Brief overview (shown in listing cards)" />
                                        </label>
                                        <textarea
                                            className="form-control rounded"
                                            rows={3}
                                            placeholder="Brief description of your business..."
                                            value={formData.desc}
                                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. LOCATION - 🆕 UPDATED SECTION */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <BsGeoAlt className="text-primary me-2" />
                                Primary Location
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">Address *</label>
                                        <input
                                            type="text"
                                            className="form-control rounded"
                                            placeholder="e.g., 2nd Floor, Fairdeal Plaza, Nyali Road"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* 🆕 SMART CITY INPUT */}
                                <div className="col-xl-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">City/Town *</label>

                                        {!showCustomCityInput ? (
                                            <>
                                                <Select
                                                    options={cityDropdownOptions}
                                                    placeholder="Select City"
                                                    value={cityDropdownOptions.find(c => c.value === cityInput)}
                                                    onChange={(option: any) => {
                                                        if (option.value === 'CUSTOM') {
                                                            setShowCustomCityInput(true)
                                                        } else {
                                                            handleCityChange(option.value)
                                                        }
                                                    }}
                                                    required
                                                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />

                                                <small className="text-muted mt-1 d-block">
                                                    Don't see your city? Select "Enter Custom City/Town"
                                                </small>
                                            </>
                                        ) : (
                                            <>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter city name (e.g., Naivasha, Dubai, London)"
                                                        value={cityInput}
                                                        onChange={(e) => handleCityChange(e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() => {
                                                            setShowCustomCityInput(false)
                                                            setCityInput('')
                                                            setLocationDetection(null)
                                                        }}
                                                    >
                                                        ← Back to List
                                                    </button>
                                                </div>

                                                {/* 🆕 SMART DETECTION FEEDBACK */}
                                                {locationDetection && cityInput && (
                                                    <>
                                                        {locationDetection.context === 'kenya' && locationDetection.confidence === 'high' && (
                                                            <div className="alert alert-success mt-2 py-2 px-3 small">
                                                                <BsCheckCircle className="me-2" />
                                                                <strong>✓ Kenya Location Detected</strong>
                                                                <p className="mb-0 mt-1">{locationDetection.reason}</p>
                                                            </div>
                                                        )}

                                                        {locationDetection.context === 'other' && locationDetection.confidence === 'high' && (
                                                            <div className="alert alert-warning mt-2 py-2 px-3 small">
                                                                <BsGlobe className="me-2" />
                                                                <strong>🌍 Global Location Detected</strong>
                                                                <p className="mb-0 mt-1">This listing will be marked as "Global" (outside Kenya)</p>
                                                            </div>
                                                        )}

                                                        {locationDetection.needsUserConfirmation && (
                                                            <div className="alert alert-info mt-2 py-2 px-3 small">
                                                                <BsQuestionCircle className="me-2" />
                                                                <strong>⚠️ Please Confirm Location</strong>
                                                                <p className="mb-1 mt-1">{locationDetection.reason}</p>

                                                                <div className="mt-2">
                                                                    <label className="d-block mb-1 fw-semibold">Is this business located in Kenya?</label>
                                                                    <div className="form-check form-check-inline">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="locationConfirm"
                                                                            id="confirmKenya"
                                                                            checked={formData.locationConfirmation === 'kenya'}
                                                                            onChange={() => setFormData(prev => ({
                                                                                ...prev,
                                                                                locationConfirmation: 'kenya'
                                                                            }))}
                                                                            required
                                                                        />
                                                                        <label className="form-check-label" htmlFor="confirmKenya">
                                                                            ✓ Yes, in Kenya
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check form-check-inline">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="locationConfirm"
                                                                            id="confirmOther"
                                                                            checked={formData.locationConfirmation === 'other'}
                                                                            onChange={() => setFormData(prev => ({
                                                                                ...prev,
                                                                                locationConfirmation: 'other'
                                                                            }))}
                                                                            required
                                                                        />
                                                                        <label className="form-check-label" htmlFor="confirmOther">
                                                                            🌍 No, outside Kenya
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* 3. CONTACT INFORMATION */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <i className="bi bi-telephone text-primary me-2"></i>
                                Contact Information
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">Phone Number *</label>
                                        <input
                                            type="tel"
                                            className="form-control rounded"
                                            placeholder="+254 XXX XXX XXX"
                                            value={formData.call}
                                            onChange={(e) => setFormData({ ...formData, call: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control rounded"
                                            placeholder="business@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">Website (Optional)</label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://www.example.com"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. IMAGES */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <BsImages className="text-primary me-2" />
                                Images *
                            </h4>
                        </div>
                        <ImageUpload
                            initialLogo={formData.logo}
                            initialImage={formData.image}
                            initialBanner={formData.bannerImage}
                            onLogoChange={(url) => setFormData({ ...formData, logo: url })}
                            onImageChange={(url) => setFormData({ ...formData, image: url })}
                            onBannerChange={(url) => setFormData({ ...formData, bannerImage: url })}
                        />
                    </div>
                </div>
            </div>

            {/* 5. FULL DESCRIPTION (Multiple Paragraphs) */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="fs-5 fw-medium mb-0">
                                <BsTextParagraph className="text-primary me-2" />
                                Detailed Description
                            </h4>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={addDescriptionParagraph}
                            >
                                + Add Paragraph
                            </button>
                        </div>
                        <div className="card-body">
                            {formData.fullDescription.map((para, index) => (
                                <div key={index} className="form-group form-border position-relative">
                                    <label className="lableTitle">Paragraph {index + 1}</label>
                                    <div className="d-flex gap-2">
                                        <textarea
                                            className="form-control rounded"
                                            rows={4}
                                            placeholder="Write a detailed paragraph about your business..."
                                            value={para}
                                            onChange={(e) => updateDescriptionParagraph(index, e.target.value)}
                                        />
                                        {formData.fullDescription.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-light-danger"
                                                onClick={() => removeDescriptionParagraph(index)}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. MULTIPLE LOCATIONS/BRANCHES */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="fs-5 fw-medium mb-0">
                                <BsBuilding className="text-primary me-2" />
                                Branch Locations
                            </h4>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={addLocation}
                            >
                                + Add Branch
                            </button>
                        </div>
                        <div className="card-body">
                            {formData.locations.map((loc, index) => (
                                <div key={index} className="border rounded p-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Branch {index + 1}</h6>
                                        {formData.locations.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-light-danger"
                                                onClick={() => removeLocation(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Branch Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded"
                                                    placeholder="e.g., Main Branch, Westlands Office" value={loc.branchName}
                                                    onChange={(e) => updateLocation(index, 'branchName', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Contact Person (Optional)</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded"
                                                    placeholder="e.g., John Doe"
                                                    value={loc.contactPerson || ''}
                                                    onChange={(e) => updateLocation(index, 'contactPerson', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Address *</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded"
                                                    placeholder="Full address"
                                                    value={loc.address}
                                                    onChange={(e) => updateLocation(index, 'address', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Phone *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control rounded"
                                                    placeholder="+254 XXX XXX XXX"
                                                    value={loc.phone}
                                                    onChange={(e) => updateLocation(index, 'phone', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Email (Optional)</label>
                                                <input
                                                    type="email"
                                                    className="form-control rounded"
                                                    placeholder="branch@example.com"
                                                    value={loc.email || ''}
                                                    onChange={(e) => updateLocation(index, 'email', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Google Maps Embed URL (Optional)</label>
                                                <input
                                                    type="url"
                                                    className="form-control rounded"
                                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                                    value={loc.mapEmbedUrl || ''}
                                                    onChange={(e) => updateLocation(index, 'mapEmbedUrl', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. WORKING HOURS */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <BsStopwatch className="text-primary me-2" />
                                Working Hours
                            </h4>
                        </div>
                        <div className="card-body">
                            {formData.workingHours.map((wh, index) => (
                                <div className="form-group form-border" key={index}>
                                    <div className="row align-items-center g-3">
                                        <label className="lableTitle col-lg-2 col-md-3">{wh.day}</label>
                                        <div className="col-lg-5 col-md-4">
                                            <Select
                                                options={timeOptions}
                                                placeholder="Opening Time"
                                                value={timeOptions.find(t => t.value === wh.opening)}
                                                onChange={(option: any) => handleWorkingHourChange(index, 'opening', option.value)}
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                        <div className="col-lg-5 col-md-4">
                                            <Select
                                                options={timeOptions}
                                                placeholder="Closing Time"
                                                value={timeOptions.find(t => t.value === wh.closing)}
                                                onChange={(option: any) => handleWorkingHourChange(index, 'closing', option.value)}
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="form-check mt-4 ps-5">
                                <input
                                    id="t24"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.open24_7}
                                    onChange={(e) => setFormData({ ...formData, open24_7: e.target.checked })}
                                />
                                <label htmlFor="t24" className="form-check-label text-dark">
                                    This Business is open 24/7
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 8. CONTENT BLOCKS (Optional Gallery) */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="fs-5 fw-medium mb-1">
                                    <BsImages className="text-primary me-2" />
                                    Content Gallery (Optional)
                                </h4>
                                <p className="text-muted mb-0 small">Add images with titles and descriptions (e.g., projects, products, facilities)</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={addContentBlock}
                            >
                                + Add Content Block
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="form-group form-border mb-3">
                                <label className="lableTitle">Gallery Section Title (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control rounded"
                                    placeholder="e.g., Our Projects, Our Products, Our Facilities"
                                    value={formData.contentSectionTitle}
                                    onChange={(e) => setFormData({ ...formData, contentSectionTitle: e.target.value })}
                                />
                            </div>

                            {formData.contentBlocks.map((block, index) => (
                                <div key={index} className="border rounded p-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Content Block {index + 1}</h6>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light-danger"
                                            onClick={() => removeContentBlock(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded"
                                                    placeholder="e.g., Le Mirage Apartments"
                                                    value={block.title}
                                                    onChange={(e) => updateContentBlock(index, 'title', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group form-border">
                                                <label className="lableTitle">Description</label>
                                                <textarea
                                                    className="form-control rounded"
                                                    rows={3}
                                                    placeholder="Describe this content..."
                                                    value={block.description}
                                                    onChange={(e) => updateContentBlock(index, 'description', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group form-border">
                                                <SingleImageUpload
                                                    value={block.image}
                                                    onChange={(url) => updateContentBlock(index, 'image', url)}
                                                    label="Content Block Image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {formData.contentBlocks.length === 0 && (
                                <div className="text-center text-muted py-3">
                                    <p className="mb-0">No content blocks added yet. Click "Add Content Block" to showcase your projects, products, or facilities.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 9. TAGS & KEYWORDS */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <BsHash className="text-primary me-2" />
                                Tags & Keywords (Optional)
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="form-group form-border">
                                <label className="lableTitle">
                                    Tags (comma-separated)
                                    <BsPatchQuestionFill className="lableTip ms-1" title="Add relevant keywords for better searchability" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded"
                                    placeholder="e.g., real estate, property, apartments, rental"
                                    value={formData.tags.join(', ')}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                    })}
                                />
                                <small className="text-muted">Separate tags with commas</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 10. SOCIAL MEDIA LINKS */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <BsGlobe className="text-primary me-2" />
                                Social Media (Optional)
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-facebook me-2"></i>Facebook
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://facebook.com/yourpage"
                                            value={formData.socials.facebook || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, facebook: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-instagram me-2"></i>Instagram
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://instagram.com/yourpage"
                                            value={formData.socials.instagram || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, instagram: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-twitter me-2"></i>Twitter/X
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://twitter.com/yourpage"
                                            value={formData.socials.twitter || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, twitter: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-linkedin me-2"></i>LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://linkedin.com/company/yourpage"
                                            value={formData.socials.linkedin || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, linkedin: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-youtube me-2"></i>YouTube
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://youtube.com/@yourchannel"
                                            value={formData.socials.youtube || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, youtube: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-whatsapp me-2"></i>WhatsApp
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://wa.me/254XXXXXXXXX"
                                            value={formData.socials.whatsapp || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, whatsapp: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group form-border">
                                        <label className="lableTitle">
                                            <i className="bi bi-tiktok me-2"></i>TikTok
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control rounded"
                                            placeholder="https://tiktok.com/@yourpage"
                                            value={formData.socials.tiktok || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, tiktok: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🆕 9. FAQs (PREMIUM) */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4 d-flex align-items-center justify-content-between">
                            <h4 className="fs-5 fw-medium mb-0">
                                <BsPatchQuestionFill className="text-primary me-2" />
                                FAQs (Premium Feature)
                            </h4>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="enableFaqs"
                                    checked={formData.enableFaqs}
                                    onChange={(e) => setFormData({ ...formData, enableFaqs: e.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="enableFaqs">
                                    Enable FAQs
                                </label>
                            </div>
                        </div>
                        {formData.enableFaqs && (
                            <div className="card-body">
                                <p className="text-muted mb-4">
                                    Add frequently asked questions to help customers learn more about your business.
                                </p>

                                {formData.faqs.map((faq, index) => (
                                    <div key={index} className="border rounded-3 p-3 mb-3 bg-light">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <h6 className="mb-0">FAQ #{index + 1}</h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeFaq(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="lableTitle">Question *</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                placeholder="e.g., What services do you offer?"
                                                value={faq.question}
                                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                                required={formData.enableFaqs}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="lableTitle">Answer *</label>
                                            <textarea
                                                className="form-control rounded"
                                                rows={3}
                                                placeholder="Provide a detailed answer..."
                                                value={faq.answer}
                                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                                required={formData.enableFaqs}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={addFaq}
                                >
                                    + Add FAQ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🆕 10. REVIEWS (PREMIUM) */}
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4 d-flex align-items-center justify-content-between">
                            <h4 className="fs-5 fw-medium mb-0">
                                <i className="bi bi-star-fill text-warning me-2"></i>
                                Customer Reviews (Premium Feature)
                            </h4>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="enableReviews"
                                    checked={formData.enableReviews}
                                    onChange={(e) => setFormData({ ...formData, enableReviews: e.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="enableReviews">
                                    Enable Reviews
                                </label>
                            </div>
                        </div>
                        {formData.enableReviews && (
                            <div className="card-body">
                                <p className="text-muted mb-4">
                                    Add customer testimonials and reviews to build trust with potential customers.
                                </p>

                                {formData.reviews.map((review, index) => (
                                    <div key={index} className="border rounded-3 p-3 mb-3 bg-light">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="mb-0">Review #{index + 1}</h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeReview(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className="lableTitle">Reviewer Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g., Joseph K."
                                                        value={review.name}
                                                        onChange={(e) => updateReview(index, 'name', e.target.value)}
                                                        required={formData.enableReviews}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className="lableTitle">Role/Company</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g., Hardware Supplier"
                                                        value={review.designation}
                                                        onChange={(e) => updateReview(index, 'designation', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className="lableTitle">Rating *</label>
                                                    <select
                                                        className="form-select rounded"
                                                        value={review.rating}
                                                        onChange={(e) => updateReview(index, 'rating', parseInt(e.target.value))}
                                                        required={formData.enableReviews}
                                                    >
                                                        <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                                        <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                                        <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                                        <option value={2}>⭐⭐ (2 Stars)</option>
                                                        <option value={1}>⭐ (1 Star)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className="lableTitle">Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control rounded"
                                                        value={review.date || ''}
                                                        onChange={(e) => updateReview(index, 'date', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group mb-3">
                                                    <label className="lableTitle">Review Title *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g., Best Wholesale Prices for Hardware Shops"
                                                        value={review.title}
                                                        onChange={(e) => updateReview(index, 'title', e.target.value)}
                                                        required={formData.enableReviews}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label className="lableTitle">Review Comment *</label>
                                                    <textarea
                                                        className="form-control rounded"
                                                        rows={3}
                                                        placeholder="Customer's detailed review..."
                                                        value={review.comment}
                                                        onChange={(e) => updateReview(index, 'comment', e.target.value)}
                                                        required={formData.enableReviews}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={addReview}
                                >
                                    + Add Review
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row align-items-start g-4 mb-lg-5 mb-4">
                <div className="col-xl-12">
                    <div className="card rounded-3 shadow-sm">
                        <div className="card-header py-4 px-4">
                            <h4 className="fs-5 fw-medium">
                                <i className="bi bi-envelope-paper text-primary me-2"></i>
                                Contact Form Integration (Optional)
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-info mb-4">
                                <strong>📋 How to get your GoHighLevel form URL:</strong>
                                <ol className="mb-0 mt-2 ps-3">
                                    <li>Log into your GoHighLevel account</li>
                                    <li>Go to Sites → Funnels/Websites</li>
                                    <li>Find your contact form and click "Get Embed Code"</li>
                                    <li>Copy the URL from the iframe src attribute</li>
                                    <li>Paste it below</li>
                                </ol>
                            </div>

                            <div className="form-group form-border">
                                <label className="lableTitle">
                                    GoHighLevel Form Embed URL
                                    <BsPatchQuestionFill
                                        className="lableTip ms-1"
                                        title="Paste the iframe src URL from your GoHighLevel form"
                                    />
                                </label>
                                <input
                                    type="url"
                                    className="form-control rounded"
                                    placeholder="https://api.leadconnectorhq.com/widget/form/XXXXXXXXXX"
                                    value={formData.ghlFormUrl || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        ghlFormUrl: e.target.value
                                    })}
                                />
                                <small className="text-muted mt-1 d-block">
                                    Example: <code>https://api.leadconnectorhq.com/widget/form/abc123def456</code>
                                </small>
                                <small className="text-muted d-block">
                                    This form will appear in the sidebar of your listing page, allowing visitors to contact you directly.
                                </small>
                            </div>

                            {/* Preview */}
                            {formData.ghlFormUrl && (
                                <div className="mt-4">
                                    <h6 className="mb-3">Form Preview:</h6>
                                    <div className="border rounded" style={{ height: '400px', overflow: 'hidden' }}>
                                        <iframe
                                            src={formData.ghlFormUrl}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                border: 'none'
                                            }}
                                            title="Form Preview"
                                        />
                                    </div>
                                    <small className="text-muted d-block mt-2">
                                        ✓ Form loaded successfully! This is how it will appear on your listing page.
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="row align-items-start g-4">
                <div className="col-xl-12">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <Link href="/dashboard/my-listings" className="btn btn-light-primary fw-medium rounded-pill px-5">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary fw-medium rounded-pill px-5"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {isEdit ? 'Updating...' : 'Submitting...'}
                                </>
                            ) : (
                                <>
                                    {submitLabel}
                                    <BsArrowRightCircle className="ms-2" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="row align-items-start g-4 mt-4">
                <div className="col-xl-12">
                    <p className="text-muted m-0">
                        © {new Date().getFullYear()} Kenya Bizz. Developed with <FaHeart className="ms-1 text-danger" /> By Visionary Services
                    </p>
                </div>
            </div>
        </form>
    )
}