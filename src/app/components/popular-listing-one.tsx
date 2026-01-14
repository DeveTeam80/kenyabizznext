'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsStars } from 'react-icons/bs';

import { ListingContext } from '../lib/data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { BsPatchCheckFill, BsSuitHeart } from 'react-icons/bs';

interface PopularListingOneProps {
    context?: ListingContext;
}

/**
 * PopularListingOne Component
 * 
 * Displays featured listings in a carousel format with dynamic URL routing.
 * Fetches data from the API instead of using mock data.
 * 
 * @param context - The listing context to determine which listings to show:
 *   - ListingContext.LOCAL: Shows only Kenyan listings (uses /listings/ URLs)
 *   - ListingContext.GLOBAL: Shows only non-Kenyan listings (uses /global-listings/ URLs)
 *   - ListingContext.ALL: Shows all listings (uses /listings/ URLs by default)
 */

export default function PopularListingOne({ context = ListingContext.LOCAL }: PopularListingOneProps) {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const ratingStyles = {
        high: 'bg-primary',
        mid: 'bg-warning',
        low: 'bg-danger'
    };

    // Fetch featured listings from API
    useEffect(() => {
        async function fetchFeaturedListings() {
            try {
                setLoading(true);
                const contextParam = context === ListingContext.GLOBAL ? 'global' :
                    context === ListingContext.ALL ? 'all' : 'local';

                const res = await fetch(`/api/listings/public?featured=true&context=${contextParam}&limit=12`);

                if (!res.ok) {
                    console.error('Failed to fetch featured listings');
                    setListings([]);
                    return;
                }

                const data = await res.json();
                setListings(data.listings || []);
            } catch (error) {
                console.error('Error fetching featured listings:', error);
                setListings([]);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedListings();
    }, [context]);

    // Determine the correct URL prefix based on context
    const getUrlPrefix = () => {
        return context === ListingContext.GLOBAL ? '/global-listings' : '/listings';
    };

    if (loading) {
        return (
            <div className="row align-items-center justify-content-center">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-3">Loading featured listings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row align-items-center justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                {listings.length > 0 ? (
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={25}
                        modules={[Autoplay, Pagination]}
                        pagination={{ clickable: true }}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1440: { slidesPerView: 4 },
                        }}
                    >
                        {listings.map((item: any) => {
                            // Handle the data structure from API
                            const primaryCategory = item.categories?.find((cat: any) => cat.isPrimary);
                            const displayCategory = primaryCategory || item.categories?.[0];
                            const ratingClass = ratingStyles[item.rating as keyof typeof ratingStyles] || 'bg-primary';

                            return (
                                <SwiperSlide className="singleItem h-100" key={item.id}>
                                    <div className="listingitem-container">
                                        <div className="singlelisting-item uniform-listing-card">

                                            <div className="listing-top-item">
                                                <Link href={`${getUrlPrefix()}/${displayCategory?.slug}/${item.slug}`} className="topLink">
                                                    <div className="position-absolute start-0 top-0 ms-3 mt-3 z-2">
                                                        <div className="d-flex align-items-center justify-content-start gap-2">
                                                            <span className={`badge badge-xs text-uppercase ${item.isVerified ? 'listOpen' : 'listClose'}`}>
                                                                {item.statusText || (item.isVerified ? 'Verified' : 'Pending')}
                                                            </span>
                                                            <span className="badge badge-xs badge-transparent">
                                                                <BsStars className="mb-0 me-1" />Featured
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Image
                                                        src={item.image || '/img/placeholder.jpg'}
                                                        width={400}
                                                        height={250}
                                                        alt={item.title}
                                                        className="img-fluid"
                                                        style={{ width: '100%', height: '270px', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                                <div className="position-absolute end-0 bottom-0 me-3 mb-3 z-2">
                                                    <Link
                                                        href={`${getUrlPrefix()}/${displayCategory?.slug}/${item.slug}`}
                                                        className="bookmarkList"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-title="Save Listing"
                                                    >
                                                        <BsSuitHeart className="m-0" />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="listing-middle-item">
                                                <div className="listing-details">
                                                    <h4 className="listingTitle">
                                                        <Link href={`${getUrlPrefix()}/${displayCategory?.slug}/${item.slug}`} className="titleLink">
                                                            {item.title}
                                                            {item.isVerified && (
                                                                <span className="verified">
                                                                    <BsPatchCheckFill className="bi bi-patch-check-fill m-0" />
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </h4>
                                                    <p>{item.desc}</p>
                                                </div>
                                            </div>

                                            <div className="listing-footer-item">
                                                <div className="d-flex align-items-center justify-content-between gap-2">
                                                    <div className="catdWraps">
                                                        <div className="flex-start">
                                                            <Link
                                                                href={`${getUrlPrefix()}/${displayCategory?.slug}/${item.slug}`}
                                                                className="d-flex align-items-center justify-content-start gap-2"
                                                            >
                                                                <span className="catTitle">{displayCategory?.name || item.subCategories?.[0] || 'General'}</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="listing-rates">
                                                        <div className="d-flex align-items-center justify-content-start gap-1">
                                                            <span className={`ratingAvarage ${item.rating || 'high'}`}>
                                                                {item.ratingRate || '4.5'}
                                                            </span>
                                                            <span className="overallrates">{item.review || '(0 Reviews)'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No featured listings available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}