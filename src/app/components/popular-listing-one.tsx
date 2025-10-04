'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsStars } from 'react-icons/bs';

// Import the data and the type from your single data file
import { listData, ListData as ListType } from '../data/data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { BsGeoAlt, BsPatchCheckFill, BsSuitHeart, BsTelephone } from 'react-icons/bs';

export default function PopularListingOne() {
    const ratingStyles = {
        high: 'bg-primary',
        mid: 'bg-warning',
        low: 'bg-danger'
    }

    // Filter to only show featured listings
    const featuredListings = listData.filter((item: ListType) => item.featured === true);

    return (
        <div className="row align-items-center justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                {featuredListings.length > 0 ? (
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
                        {featuredListings.map((item: ListType) => {
                            // Updated to handle the new data structure
                            const primaryCategory = item.categories.find(cat => cat.isPrimary);
                            const displayCategory = primaryCategory || item.categories[0];
                            const ratingClass = ratingStyles[item.rating] || 'bg-primary';
                            
                            return (
                                <SwiperSlide className="singleItem h-100" key={item.id}>
                                    <div className="listingitem-container">
                                        <div className="singlelisting-item uniform-listing-card">
                                            
                                            <div className="listing-top-item">
                                                <Link href={`/listings/${displayCategory?.slug}/${item.slug}`} className="topLink">
                                                    <div className="position-absolute start-0 top-0 ms-3 mt-3 z-2">
                                                        <div className="d-flex align-items-center justify-content-start gap-2">
                                                            <span className={`badge badge-xs text-uppercase ${item.isVerified ? 'listOpen' : 'listClose'}`}>
                                                                {item.statusText}
                                                            </span>
                                                            <span className="badge badge-xs badge-transparent">
                                                                <BsStars className="mb-0 me-1"/>Featured
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Image
                                                        src={item.image}
                                                        width={400}
                                                        height={250}
                                                        alt={item.title}
                                                        className="img-fluid"
                                                        style={{ width: '100%', height: '270px', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                                <div className="position-absolute end-0 bottom-0 me-3 mb-3 z-2">
                                                    <Link 
                                                        href={`/listings/${displayCategory?.slug}/${item.slug}`} 
                                                        className="bookmarkList" 
                                                        data-bs-toggle="tooltip" 
                                                        data-bs-title="Save Listing"
                                                    >
                                                        <BsSuitHeart className="m-0"/>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="listing-middle-item">
                                                <div className="listing-details">
                                                    <h4 className="listingTitle">
                                                        <Link href={`/listings/${displayCategory?.slug}/${item.slug}`} className="titleLink">
                                                            {item.title}
                                                            {item.isVerified && (
                                                                <span className="verified">
                                                                    <BsPatchCheckFill className="bi bi-patch-check-fill m-0"/>
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </h4>
                                                    <p>{item.desc}</p>
                                                </div>
                                                {/* <div className="listing-info-details">
                                                    <div className="d-flex align-items-center justify-content-start gap-4">
                                                        <div className="list-calls">
                                                            <BsTelephone className="mb-0 me-2"/>{item.call}
                                                        </div>
                                                        <div className="list-distance">
                                                            <BsGeoAlt className="mb-0 me-2"/>{item.location}
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>

                                            <div className="listing-footer-item">
                                                <div className="d-flex align-items-center justify-content-between gap-2">
                                                    <div className="catdWraps">
                                                        <div className="flex-start">
                                                            <Link 
                                                                href={`/listings/${displayCategory?.slug}/${item.slug}`} 
                                                                className="d-flex align-items-center justify-content-start gap-2"
                                                            >
                                                                <span className="catTitle">{displayCategory?.name || item.subCategory}</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="listing-rates">
                                                        <div className="d-flex align-items-center justify-content-start gap-1">
                                                            <span className={`ratingAvarage ${item.rating}`}>
                                                                {item.ratingRate}
                                                            </span>
                                                            <span className="overallrates">{item.review}</span>
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