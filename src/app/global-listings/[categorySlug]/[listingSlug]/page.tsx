import React from 'react';
import { Metadata } from 'next';
import { generateListingPageSEOMetadata } from '../../../../../lib/useSeo';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import NavbarServerWrapper from '@/app/components/navbar/navabar-server';
import Descriptions from '@/app/components/list-detail/descriptions';
import Products from '@/app/components/list-detail/products';
import Maps from '@/app/components/list-detail/maps';
import SingleSidebarThree from '@/app/components/list-detail/single-sidebar-three';
import FooterTop from '@/app/components/footer-top';
import Footer from '@/app/components/footer/footer';
import BackToTop from '@/app/components/back-to-top';
import Breadcrumb from '@/app/components/breadcrumb';
import GlobalList from '@/app/components/globallist';
import { FiArrowRight } from 'react-icons/fi';
import { FaLocationDot } from 'react-icons/fa6';
import { BsBriefcase, BsSendCheck, BsX } from 'react-icons/bs';

import { getListingBySlug, getRelatedListings, getCategoryDetails, ListingContext } from '@/app/lib/data';

export default async function GlobalSingleListingPage({
    params
}: {
    params: Promise<{ categorySlug: string; listingSlug: string }>;
}) {
    const { categorySlug, listingSlug } = await params;

    const [listing, relatedListings, categoryDetails] = await Promise.all([
        getListingBySlug(categorySlug, listingSlug, ListingContext.GLOBAL),
        getRelatedListings(categorySlug, listingSlug, 3, ListingContext.GLOBAL),
        getCategoryDetails(categorySlug, ListingContext.GLOBAL)
    ]);

    if (!listing) {
        notFound();
    }

    const primaryCategory = listing.categories.find((cat: any) => cat.isPrimary);
    const displayCategory = primaryCategory || listing.categories[0];

    const breadcrumbItems = [
        {
            label: 'Global Listings',
            href: '/global-listings'
        },
        {
            label: listing.title,
            active: true
        }
    ];

    return (
        <>
            <NavbarServerWrapper />

            <section className="py-3 bg-light border-bottom">
                <Breadcrumb items={breadcrumbItems} />
            </section>

            <section className="bg-cover position-relative ht-500 py-0" style={{ backgroundImage: `url(${listing.bannerImage || listing.image})` }} data-overlay="4">
                <div className="container h-100">
                    <div className="row align-items-start">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                            <div className="mainlistingInfo">
                                <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                    <div className="firstColumn">
                                        <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                            <div className="listingAvatar">
                                                <Link href="#" className="d-block">
                                                    <Image src={listing.logo} width={95} height={95} className="img-fluid rounded-3" alt="Avatar" />
                                                </Link>
                                            </div>
                                            <div className="listingCaptioninfo">
                                                <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                    <h2 className="fw-semibold text-light mb-0">{listing.title}</h2>
                                                    {listing.isVerified && (
                                                        <span className="verified mt-1">
                                                            <Image
                                                                src='/img/tick.svg'
                                                                width={22}
                                                                height={22}
                                                                className="img-fluid"
                                                                alt="Verified Listing"
                                                            />
                                                        </span>
                                                    )}
                                                    <span className="badge bg-info text-white ms-2">Global</span>
                                                </div>
                                                <div className="listingsbasicInfo">
                                                    <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                        <div className="flexItem me-2">
                                                            <span className="text-md fw-medium text-light d-flex align-items-center">
                                                                <FaLocationDot className="me-2" />{listing.location}
                                                            </span>
                                                        </div>
                                                        <div className="flexItem me-2">
                                                            <span className="text-md fw-medium text-light d-flex align-items-center">
                                                                <BsBriefcase className="me-2" />{displayCategory?.name || listing.subCategory}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lastColumn">
                                        <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-3">
                                            <div className="flexStart Priceinfo d-flex flex-column">
                                                <span className="fw-medium text-light">Contact</span>
                                                <span className="fw-bold fs-6 text-light">{listing.call}</span>
                                            </div>
                                            <div className="flexlastButton">
                                                <button type="button" className="btn px-4 btn-whites text-primary fw-medium" data-bs-toggle="modal" data-bs-target="#messageModal">
                                                    <BsSendCheck className="me-2" />Send Message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gray-simple pt-4 pt-xl-5">
                <div data-bs-spy="scroll" data-bs-target="#scrollphyNav" data-bs-smooth-scroll="true" className="scrollspy-example" tabIndex={0}>
                    <div className="container">
                        <div className="row align-items-start gx-xl-5 g-4">
                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                <Descriptions listing={listing} />
                                <Products listing={listing} />
                                <Maps listing={listing} />
                                <GlobalList relatedListings={relatedListings} />
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                <SingleSidebarThree listing={listing} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterTop />
            <Footer />
            <BackToTop />

            <div className="modal modal-lg fade" id="messageModal" tabIndex={-1} aria-labelledby="messageModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-light border-0 px-md-5 d-flex justify-content-between">
                            <h4 className="modal-title fw-medium" id="messageModalLabel">Send Message to {listing.title}</h4>
                            <Link href="#" data-bs-dismiss="modal" aria-label="Close" className="square--40 circle bg-light-danger text-danger">
                                <BsX className="bi bi-x" />
                            </Link>
                        </div>
                        <div className="modal-body p-md-5">
                            <div className="messageForm">
                                <div className="form-group form-border">
                                    <textarea className="form-control" placeholder={`Type your message to ${listing.title}`}></textarea>
                                </div>
                                <button type="button" className="btn btn-primary fw-medium px-md-5">
                                    Send message<FiArrowRight className="ms-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// ✅ FIXED: params must be a Promise and must be awaited
export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ categorySlug: string; listingSlug: string }> 
}): Promise<Metadata> {
    const { categorySlug, listingSlug } = await params;
    return generateListingPageSEOMetadata(categorySlug, listingSlug, { 
        context: ListingContext.GLOBAL, 
        basePath: '/global-listings' 
    });
}