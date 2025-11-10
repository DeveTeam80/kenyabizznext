import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// import NavbarServerWrapper from '@/app/components/navbar/navabar-server';
import NavbarServerWrapper from '@/app/components/navbar/navabar-server';
import FooterTop from '@/app/components/footer-top';
import Footer from '@/app/components/footer/footer';
import BackToTop from '@/app/components/back-to-top';
import Breadcrumb from '@/app/components/breadcrumb';

import { getListings, getCities, ListingContext } from '@/app/lib/data';
import { ListData } from '@/app/data/data';

// Group listings by category
function groupListingsByCategory(listings: ListData[]) {
    const grouped: { [key: string]: { categoryInfo: any; listings: ListData[] } } = {};

    listings.forEach(listing => {
        listing.categories.forEach(category => {
            if (category.isPrimary || !grouped[category.slug]) {
                if (!grouped[category.slug]) {
                    grouped[category.slug] = {
                        categoryInfo: category,
                        listings: []
                    };
                }
                if (!grouped[category.slug].listings.find(l => l.id === listing.id)) {
                    grouped[category.slug].listings.push(listing);
                }
            }
        });
    });

    return grouped;
}

// Get category descriptions
function getCategoryDescription(slug: string): string {
    const descriptions: { [key: string]: string } = {
        'real-estate': 'Homes, land, commercial property',
        'manufacturing': 'All manufacturers & suppliers hub',
        'shops-and-suppliers': 'Hardware, electronics, apparel, etc.',
        'services': 'Advisory, travel, logistics & more',
        'technology': 'Mobile, API, software & comms'
    };
    return descriptions[slug] || 'Business listings';
}

export default async function SitemapPage() {
    // Get all listings (both local and global)
    const [localListings, globalListings] = await Promise.all([
        getListings(ListingContext.LOCAL, {}, 1, 1000), // Get all local listings
        getListings(ListingContext.GLOBAL, {}, 1, 1000)  // Get all global listings
    ]);

    const allListings = [...localListings.listings, ...globalListings.listings];
    const groupedByCategory = groupListingsByCategory(allListings);

    const breadcrumbItems = [
        //   {
        //     label: 'Home',
        //     href: '/'
        //   },
        {
            label: 'Sitemap',
            active: true
        }
    ];

    return (
        <div className='sitemap-page'>
            <NavbarServerWrapper />

            {/* Hero Banner */}
            <div className="image-cover hero-banner overflow-hidden py-5" style={{ backgroundImage: `url('/img/brand-section.png')`, backgroundColor: '#e7f0eb' }}>
                <div className="container">
                    <div className="row justify-content-center align-items-center text-center">
                        <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
                            <div className="position-relative py-4">
                                <h1 className="display-4 fw-bold mb-3">Sitemap</h1>
                                <p className="fs-5 mb-0">Quick jump to any category hub or featured listing on Kenyabizz Directory.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <section className="py-3 bg-light border-bottom">
                <Breadcrumb items={breadcrumbItems} />
            </section>

            {/* Sitemap Content */}
            <section className="py-5">
                <div className="container">

                    {/* Category Hubs Overview */}
                    <div className="mb-5">
                        <h2 className="mb-4">All Business Listing Categories</h2>
                        <div className="row g-4">
                            {Object.entries(groupedByCategory).map(([categorySlug, categoryData]) => (
                                <div key={categorySlug} className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body p-4">
                                            <h5 className="card-title mb-2">
                                                <Link href={`/listings/${categorySlug}`} className="text-decoration-none text-primary">
                                                    {categoryData.categoryInfo.name}
                                                </Link>
                                            </h5>
                                            <p className="card-text text-muted small mb-3">
                                                {getCategoryDescription(categorySlug)}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    {categoryData.listings.length} listings
                                                </small>
                                                <Link href={`/listings/${categorySlug}`} className="btn btn-sm btn-outline-primary">
                                                    View All
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Category Listings */}
                    {Object.entries(groupedByCategory).map(([categorySlug, categoryData]) => (
                        <div key={categorySlug} id={categorySlug} className="mb-5">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h2>{categoryData.categoryInfo.name} Listings Directory</h2>
                                <Link href={`/listings/${categorySlug}`} className="btn btn-primary">
                                    View Category
                                </Link>
                            </div>

                            <div className="row g-3">
                                {categoryData.listings.slice(0, 12).map((listing) => {
                                    const isKenyan = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi'].some(city =>
                                        listing.city.toLowerCase().includes(city.toLowerCase()) ||
                                        listing.location.toLowerCase().includes(city.toLowerCase())
                                    );
                                    const baseUrl = isKenyan ? '/listings' : '/global-listings';

                                    return (
                                        <div key={listing.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-start gap-2 mb-2">
                                                        <Link
                                                            href={`${baseUrl}/${categorySlug}/${listing.slug}`}
                                                            className="text-decoration-none text-dark fw-medium flex-grow-1"
                                                        >
                                                            {listing.title}
                                                        </Link>
                                                        {!isKenyan && (
                                                            <span className="badge bg-info text-white badge-sm">Global</span>
                                                        )}
                                                        {listing.featured && (
                                                            <span className="badge bg-warning text-white badge-sm">Featured</span>
                                                        )}
                                                    </div>
                                                    <small className="text-muted d-flex align-items-center">
                                                        <i className="bi bi-geo-alt me-1"></i>
                                                        {listing.city}
                                                    </small>
                                                    {listing.isVerified && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-success badge-sm">Verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {categoryData.listings.length > 12 && (
                                <div className="text-center mt-4">
                                    <Link href={`/listings/${categorySlug}`} className="btn btn-outline-primary">
                                        View All {categoryData.listings.length} {categoryData.categoryInfo.name} Listings
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Global Listings Section */}
                    {globalListings.listings.length > 0 && (
                        <div className="mb-5">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h2>Global Business Directory</h2>
                                <Link href="/global-listings" className="btn btn-primary">
                                    View All Global Listings
                                </Link>
                            </div>

                            <div className="row g-3">
                                // Around line 203
                                {globalListings.listings.slice(0, 8).map((listing) => {
                                    const primaryCategory = listing.categories.find((cat: any) => cat.isPrimary);
                                    const displayCategory = primaryCategory || listing.categories[0];

                                    return (
                                        <div key={listing.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-start gap-2 mb-2">
                                                        <Link
                                                            href={`/global-listings/${displayCategory?.slug}/${listing.slug}`}
                                                            className="text-decoration-none text-dark fw-medium flex-grow-1"
                                                        >
                                                            {listing.title}
                                                        </Link>
                                                        <span className="badge bg-info text-white badge-sm">Global</span>
                                                        {listing.featured && (
                                                            <span className="badge bg-warning text-white badge-sm">Featured</span>
                                                        )}
                                                    </div>
                                                    <small className="text-muted d-flex align-items-center">
                                                        <i className="bi bi-geo-alt me-1"></i>
                                                        {listing.city}
                                                    </small>
                                                    <small className="text-muted d-block mt-1">
                                                        {displayCategory?.name}
                                                    </small>
                                                    {listing.isVerified && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-success badge-sm">Verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    {/* Improved Statistics */}
                    <div className="stats-section">
                        <div className="container">
                            <div className="stats-grid">
                                <div className="stat-card stat-total">
                                    <div className="stat-icon">
                                        <i className="bi bi-list-ul"></i>
                                    </div>
                                    <div className="stat-number">{allListings.length}</div>
                                    <p className="stat-label">Total Listings</p>
                                </div>

                                <div className="stat-card stat-kenya">
                                    <div className="stat-icon">
                                        <i className="bi bi-flag"></i>
                                    </div>
                                    <div className="stat-number">{localListings.listings.length}</div>
                                    <p className="stat-label">Kenya Listings</p>
                                </div>

                                <div className="stat-card stat-global">
                                    <div className="stat-icon">
                                        <i className="bi bi-globe"></i>
                                    </div>
                                    <div className="stat-number">{globalListings.listings.length}</div>
                                    <p className="stat-label">Global Listings</p>
                                </div>

                                <div className="stat-card stat-categories">
                                    <div className="stat-icon">
                                        <i className="bi bi-grid"></i>
                                    </div>
                                    <div className="stat-number">{Object.keys(groupedByCategory).length}</div>
                                    <p className="stat-label">Categories</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterTop />
            <Footer />
            <BackToTop />
        </div>
    );
}