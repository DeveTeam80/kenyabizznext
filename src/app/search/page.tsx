// Force dynamic rendering - data from API isn't available at build time
export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import NavbarServerWrapper from '@/app/components/navbar/navabar-server'
import ListSidebarOne from '@/app/components/list-sidebar-one';
import FooterTop from '@/app/components/footer-top';
import Footer from '@/app/components/footer/footer';
import BackToTop from '@/app/components/back-to-top';
import Pagination from '@/app/components/pagination';
import Breadcrumb from '@/app/components/breadcrumb';
import { BsSearch } from 'react-icons/bs';

import {
    searchListings,
    getSubCategories,
    getCities,
    ListingContext,
    SearchFilters
} from '@/app/lib/data';
import { ListData } from '@/app/data/data';
import { BsPatchCheckFill, BsStars, BsSuitHeart } from 'react-icons/bs';

interface SearchParams {
    q?: string;
    location?: string;
    category?: string;
    subCategory?: string;
    city?: string;
    rating?: string;
    featured?: string;
    verified?: string;
    page?: string;
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<SearchParams>;
}) {
    const filters = await searchParams;

    const currentPage = parseInt(filters.page || '1');
    const itemsPerPage = 8;

    const searchFilters: SearchFilters = {
        query: filters.q,
        location: filters.location,
        category: filters.category,
        subCategory: filters.subCategory,
        city: filters.city,
        rating: filters.rating,
        featured: filters.featured === 'true',
        verified: filters.verified === 'true',
    };

    // Fetch data in parallel
    const [{ listings, totalPages, totalItems }, subCategories, cities] = await Promise.all([
        searchListings(searchFilters, currentPage, itemsPerPage, ListingContext.LOCAL),
        getSubCategories(undefined, ListingContext.LOCAL),
        getCities(undefined, ListingContext.LOCAL)
    ]);

    const breadcrumbItems = [
        {
            label: 'Search Results',
            active: true
        }
    ];

    const getSearchSummary = () => {
        const parts = [];
        if (searchFilters.query) parts.push(`"${searchFilters.query}"`);
        if (searchFilters.location && searchFilters.location !== 'all-kenya') {
            const location = searchFilters.location.charAt(0).toUpperCase() + searchFilters.location.slice(1);
            parts.push(`in ${location}`);
        }
        if (searchFilters.category && searchFilters.category !== 'all') {
            const categoryName = searchFilters.category.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            parts.push(`in ${categoryName}`);
        }

        return parts.length > 0 ? `Search Results ${parts.join(' ')}` : 'All Search Results';
    };

    return (
        <>
            <NavbarServerWrapper />

            {/* Breadcrumb */}
            <section className="py-3 bg-light border-bottom">
                <Breadcrumb items={breadcrumbItems} />
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <ListSidebarOne subCategories={subCategories} cities={cities} />
                        </div>

                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            {/* Search Summary */}
                            <div className="row align-items-center justify-content-between mb-4">
                                <div className="col-xl-12 col-lg-12 col-md-12">
                                    <h2 className="mb-2">{getSearchSummary()}</h2>
                                    <p className="text-muted mb-2">
                                        Found {totalItems} result{totalItems !== 1 ? 's' : ''}
                                        {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
                                    </p>

                                    {/* Active filters display */}
                                    {(searchFilters.query || searchFilters.location || searchFilters.category || searchFilters.subCategory || searchFilters.featured || searchFilters.verified) && (
                                        <div className="row align-items-start mb-4">
                                            <div className="col-xl-12 col-lg-12 col-md-12">
                                                <div className="d-flex align-items-center justify-content-start gap-3 flex-wrap">

                                                    {searchFilters.query && (
                                                        <div className="alert tag-alert alert-light alert-dismissible fade show" role="alert">
                                                            <span>"{searchFilters.query}"</span>
                                                            <Link href={`/search?${new URLSearchParams({ ...(searchFilters.location && { location: searchFilters.location }), ...(searchFilters.category && { category: searchFilters.category }), ...(searchFilters.subCategory && { subCategory: searchFilters.subCategory }), ...(searchFilters.featured && { featured: 'true' }), ...(searchFilters.verified && { verified: 'true' }) }).toString()}`} className="btn-close" aria-label="Close"></Link>
                                                        </div>
                                                    )}

                                                    {searchFilters.location && searchFilters.location !== 'all-kenya' && (
                                                        <div className="alert tag-alert alert-light alert-dismissible fade show" role="alert">
                                                            <span>{searchFilters.location.charAt(0).toUpperCase() + searchFilters.location.slice(1)}</span>
                                                            <Link href={`/search?${new URLSearchParams({ ...(searchFilters.query && { q: searchFilters.query }), ...(searchFilters.category && { category: searchFilters.category }), ...(searchFilters.subCategory && { subCategory: searchFilters.subCategory }), ...(searchFilters.featured && { featured: 'true' }), ...(searchFilters.verified && { verified: 'true' }) }).toString()}`} className="btn-close" aria-label="Close"></Link>
                                                        </div>
                                                    )}

                                                    {searchFilters.category && searchFilters.category !== 'all' && (
                                                        <div className="alert tag-alert alert-light alert-dismissible fade show" role="alert">
                                                            <span>{searchFilters.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                                            <Link href={`/search?${new URLSearchParams({ ...(searchFilters.query && { q: searchFilters.query }), ...(searchFilters.location && { location: searchFilters.location }), ...(searchFilters.subCategory && { subCategory: searchFilters.subCategory }), ...(searchFilters.featured && { featured: 'true' }), ...(searchFilters.verified && { verified: 'true' }) }).toString()}`} className="btn-close" aria-label="Close"></Link>
                                                        </div>
                                                    )}

                                                    {searchFilters.subCategory && (
                                                        <div className="alert tag-alert alert-light alert-dismissible fade show" role="alert">
                                                            <span>{searchFilters.subCategory}</span>
                                                            <Link href={`/search?${new URLSearchParams({ ...(searchFilters.query && { q: searchFilters.query }), ...(searchFilters.location && { location: searchFilters.location }), ...(searchFilters.category && { category: searchFilters.category }), ...(searchFilters.featured && { featured: 'true' }), ...(searchFilters.verified && { verified: 'true' }) }).toString()}`} className="btn-close" aria-label="Close"></Link>
                                                        </div>
                                                    )}

                                                    <div className="clearList">
                                                        <Link href="/search" className="fw-medium text-primary text-md">Clear All</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sorting options */}
                            <div className="row align-items-center justify-content-between mb-4">
                                <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">
                                    <p className="text-muted mb-0">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                                    </p>
                                </div>
                                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
                                    <div className="text-end">
                                        <div className="dropdown d-inline-flex p-0">
                                            <a href="#" className="py-2 px-3 dropdown-toggle toogleDrops" id="shortfilter" data-bs-toggle="dropdown" aria-expanded="false">
                                                Sort Results
                                            </a>
                                            <div className="dropdown-menu border shadow-sm">
                                                <ul className="card rounded-0 p-0">
                                                    <li><a href="#" className="dropdown-item active">Best Match</a></li>
                                                    <li><a href="#" className="dropdown-item">Newest First</a></li>
                                                    <li><a href="#" className="dropdown-item">Featured First</a></li>
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
                                            <div className="mb-4">
                                                <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '80px', height: '80px' }}>
                                                    <BsSearch size={32} className="text-muted" />
                                                </div>
                                            </div>
                                            <h5 className="mb-3">No results found</h5>
                                            <p className="text-muted mb-4">
                                                Try adjusting your search terms or removing some filters.
                                            </p>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Link href="/search" className="btn btn-outline-primary">
                                                    Clear Filters
                                                </Link>
                                                <Link href="/listings" className="btn btn-primary">
                                                    Browse All Listings
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="row align-items-center justify-content-center g-xl-4 g-3">
                                        {listings.map((item: any) => {
                                            const primaryCategory = item.categories.find((cat: any) => cat.isPrimary);
                                            const displayCategory = primaryCategory || item.categories[0];
                                            // 🟢 FIX: Handle array of subcategories
                                            const displaySubCategory = item.subCategories?.[0] || 'General';

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
                                                                    <Link href={`/listings/${displayCategory?.slug}/${item.slug}`} className="bookmarkList">
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
                                                                                {/* 🟢 Use the updated displaySubCategory variable */}
                                                                                <span className="catTitle">{displayCategory?.name || displaySubCategory}</span>
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

                                    {totalPages > 1 && (
                                        <div className="row align-items-center justify-content-center mt-5">
                                            <div className="col-xl-12 col-lg-12 col-md-12">
                                                <Pagination currentPage={currentPage} totalPages={totalPages} />
                                            </div>
                                        </div>
                                    )}
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