// src/app/listings/[categorySlug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { generateCategoryPageSEOMetadata } from '../../../../lib/useSeo';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IconType } from 'react-icons';
import { BsGeoAlt, BsPatchCheckFill, BsSearch, BsStars, BsSuitHeart, BsTelephone } from 'react-icons/bs';

import NavbarServerWrapper from '@/app/components/navbar/navabar-server';
import ListSidebarOne from '@/app/components/list-sidebar-one';
import FooterTop from '@/app/components/footer-top';
import Footer from '@/app/components/footer/footer';
import BackToTop from '@/app/components/back-to-top';
import Pagination from '@/app/components/pagination';
import Breadcrumb from '@/app/components/breadcrumb';

import { getListings, getCategoryDetails, getSubCategories, getCities, ListingContext, FilterParams } from '@/app/lib/data';
import { ListData } from '@/app/data/data';
import HeroSearch from '@/app/components/hero-search';

interface SearchParams {
    subCategory?: string;
    city?: string;
    rating?: string;
    featured?: string;
    verified?: string;
    search?: string;
    page?: string;
}

export default async function ListingCategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<SearchParams>;
}) {
    const { categorySlug } = await params;
    const filters = await searchParams;

    const currentPage = parseInt(filters.page || '1');
    const itemsPerPage = 8;

    const filterParams: FilterParams = {
        subCategory: filters.subCategory,
        city: filters.city,
        rating: filters.rating,
        featured: filters.featured === 'true',
        verified: filters.verified === 'true',
        search: filters.search
    };

    const [{ listings, totalPages, totalItems }, category, subCategories, cities] = await Promise.all([
        getListings(ListingContext.LOCAL, filterParams, currentPage, itemsPerPage, categorySlug),
        getCategoryDetails(categorySlug, ListingContext.LOCAL),
        getSubCategories(categorySlug, ListingContext.LOCAL),
        getCities(categorySlug, ListingContext.LOCAL)
    ]);

    if (totalItems === 0 && currentPage === 1 && Object.keys(filterParams).every(key => !filterParams[key as keyof FilterParams])) {
        notFound();
    }

    const breadcrumbItems = [
        {
            label: 'All Listings',
            href: '/listings'
        },
        {
            label: category.name,
            active: true
        }
    ];

    return (
        <>
            <NavbarServerWrapper />

            <div className="image-cover hero-banner overflow-hidden py-5" style={{ backgroundImage: `url('/img/brand-section.png')`, backgroundColor: '#e7f0eb' }}>
                <div className="container">
                    <div className="row justify-content-start align-items-start">
                        <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
                            <div className="position-relative text-start py-4 mt-lg-0 mt-5">
                                <h2>{category.name} Business Directory</h2>
                                <p>{category.description}</p>
                                <HeroSearch
                                    context="local"
                                    categorySlug={categorySlug}
                                    placeholder={`Search in ${category.name}...`}
                                    locationPlaceholder="Location in Kenya"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-3 bg-light border-bottom">
                <Breadcrumb items={breadcrumbItems} />
            </section>

            <section>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <ListSidebarOne subCategories={subCategories} cities={cities} />
                        </div>

                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="row align-items-center justify-content-between mb-4">
                                <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">
                                    <p className="text-muted mb-0">
                                        Showing {listings.length} of {totalItems} results
                                        {Object.values(filterParams).some(v => v) && ' (filtered)'}
                                    </p>
                                </div>
                                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
                                    <div className="text-end">
                                        <div className="dropdown d-inline-flex p-0">
                                            <a href="#" className="py-2 px-3 dropdown-toggle toogleDrops" id="shortfilter" data-bs-toggle="dropdown" aria-expanded="false">
                                                Sort Listings
                                            </a>
                                            <div className="dropdown-menu border shadow-sm">
                                                <ul className="card rounded-0 p-0">
                                                    <li><a href="#" className="dropdown-item">Default Order</a></li>
                                                    <li><a href="#" className="dropdown-item">Highest Rated</a></li>
                                                    <li><a href="#" className="active dropdown-item">Most Reviewed</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {listings.length === 0 ? (
                                <div className="row">
                                    <div className="col-12 text-center py-5">
                                        <div className="py-5">
                                            <h5 className="mb-3">No listings found</h5>
                                            <p className="text-muted mb-4">
                                                {Object.values(filterParams).some(v => v)
                                                    ? 'Try adjusting your filters or search criteria.'
                                                    : 'There are no listings available in this category yet.'
                                                }
                                            </p>
                                            {Object.values(filterParams).some(v => v) && (
                                                <Link href={`/listings/${categorySlug}`} className="btn btn-primary">
                                                    Clear Filters
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="row align-items-center justify-content-center g-xl-4 g-3">
                                        {listings.map((item: ListData) => {
                                            const primaryCategory = item.categories.find(cat => cat.isPrimary);
                                            const displayCategory = primaryCategory || item.categories[0];

                                            return (
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" key={item.id}>
                                                    <div className="listingitem-container">
                                                        <div className="singlelisting-item">
                                                            <div className="listing-top-item">
                                                                <Link href={`/listings/${displayCategory?.slug}/${item.slug}`} className="topLink">
                                                                    <div className="position-absolute start-0 top-0 ms-3 mt-3 z-2">
                                                                        <div className="d-flex align-items-center justify-content-start gap-2">
                                                                            <span className={`badge badge-xs text-uppercase ${item.isVerified ? 'listOpen' : 'listClose'}`}>
                                                                                {item.statusText}
                                                                            </span>
                                                                            {item.featured && (
                                                                                <span className="badge badge-xs badge-transparent">
                                                                                    <BsStars className="mb-0 me-1" />Featured
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <Image
                                                                        src={item.image}
                                                                        width={400}
                                                                        height={250}
                                                                        style={{ width: '100%', height: '270px', objectFit: 'cover' }}
                                                                        className="img-fluid"
                                                                        alt={item.title}
                                                                    />
                                                                </Link>
                                                                <div className="position-absolute end-0 bottom-0 me-3 mb-3 z-2">
                                                                    <Link
                                                                        href={`/listings/${displayCategory?.slug}/${item.slug}`}
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
                                                                        <Link href={`/listings/${displayCategory?.slug}/${item.slug}`} className="titleLink">
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
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="row align-items-center justify-content-center mt-5">
                                        <div className="col-xl-12 col-lg-12 col-md-12">
                                            <Pagination currentPage={currentPage} totalPages={totalPages} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <FooterTop />
            <Footer />
            <BackToTop />
        </>
    );
}

// ✅ FIXED: params must be a Promise and must be awaited
export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ categorySlug: string }> 
}): Promise<Metadata> {
    const { categorySlug } = await params;
    return generateCategoryPageSEOMetadata(categorySlug, { pathname: `/listings/${categorySlug}` });
}