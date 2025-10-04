import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsEnvelope } from 'react-icons/bs';

export default function WorkingProcessTwo() {
    return (
        <section className="pt-0">
            <div className="container">
                <div className="row align-items-center justify-content-between g-4">

                    <div className="col-xl-5 col-lg-5 col-md-6">
                        {/* ====== Image updated with max-height and object-fit ====== */}
                        <Image
                            src="/img/index-aboutus.png"
                            width={500}
                            height={500}
                            sizes='100vw'
                            style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover' }}
                            className="img-fluid rounded"
                            alt="Business professionals shaking hands"
                        />
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="workingCaption">
                            <div className="workingDescribe mb-4">
                                <h2 className="fw-bold lh-base display-6">Discover Kenya Bizz Directory<br />Your Gateway to Opportunities</h2>
                                <p className="text-muted">
                                    Kenya Bizz Directory is a national directory platform spotlighting diverse businesses,
                                    service providers, startups, institutions, and professionals across Kenya...
                                </p>
                            </div>

                            <div className="d-flex align-items-center gap-3 mb-4">
                                <Link href="/all-listings" className="btn btn-dark fw-medium px-lg-4 py-lg-3">
                                    {/* ====== Added text-light class to make text visible ====== */}
                                    <div className="d-block text-start text-light">
                                        <span className="text-uppercase fw-light fs-sm">Start Exploring</span>
                                        <h6 className="mb-0  fw-semibold" style={{ color: '#ffffff' }}>Browse Listings</h6>
                                    </div>
                                </Link>
                                <Link href="/listing" className="btn btn-dark fw-medium px-lg-4 py-lg-3">
                                    {/* ====== Added text-light class to make text visible ====== */}
                                    <div className="d-block text-start text-light">
                                        <span className="text-uppercase fw-light fs-sm">Join Our Network</span>
                                        <h6 className="mb-0  fw-semibold" style={{ color: '#ffffff' }}>List Business</h6>
                                    </div>
                                </Link>
                            </div>

                            <div className="newsletter-area">
                                <h5 className="fw-semibold mb-3">Don't Miss Updates from Kenya Bizz</h5>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <BsEnvelope />
                                    </span>
                                    <input type="email" className="form-control" placeholder="Your Email*" />
                                    <button type="button" className="btn btn-primary">Subscribe Now</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}