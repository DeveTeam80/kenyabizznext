// Force dynamic rendering - data from API isn't available at build time
export const dynamic = 'force-dynamic';
import React from 'react';
import { Metadata } from 'next';
import { generateSEOMetadata } from '../../../lib/useSeo';

import NavbarDark from '@/app/components/navbar/navbar-dark';
import FooterTop from '@/app/components/footer-top';
import Footer from '@/app/components/footer/footer';
import BackToTop from '@/app/components/back-to-top';
import Breadcrumb from '@/app/components/breadcrumb';

import { BsCheckCircle, BsPerson, BsSearch } from 'react-icons/bs';

export default function AddListingPage() {
  const breadcrumbItems = [
    {
      label: 'Add Listing',
      active: true
    }
  ];

  const benefits = [
    {
      icon: BsCheckCircle,
      title: 'Verified Listings',
      description: 'Gain trust with a verified badge on your profile, showing customers you\'re a legitimate and trusted business.'
    },
    {
      icon: BsPerson,
      title: 'Custom Profile Page',
      description: 'Showcase your business with a beautiful profile, complete with images, videos, and all your essential details.'
    },
    {
      icon: BsSearch,
      title: 'Improved Local SEO',
      description: 'Increase your visibility in local search results and attract more customers in your area.'
    }
  ];

  return (
    <>
      <NavbarDark />

      {/* Hero Banner */}
      <div className="image-cover hero-banner overflow-hidden py-12" style={{ backgroundImage: `url('/img/banner/listing-banner.jpg')`, backgroundColor: '#e7f0eb' }}>
        <div className="container">
          <div className="row justify-content-center align-items-center text-center">
            <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
              <div className="position-relative py-4">
                {/* <h1 className="display-4 fw-bold mb-3 text-white">Ready to list your business with us?</h1> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <section className="py-3 bg-light border-bottom">
        <Breadcrumb items={breadcrumbItems} />
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="badge bg-primary text-white px-3 py-2 rounded-pill mb-3">Benefits</span>
              <h2 className="display-4 fw-bold mb-4">Why List Your Business on Kenya Bizz?</h2>
            </div>
          </div>

          <div className="row g-4 mt-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm text-center p-4">
                    <div className="card-body">
                      <div className="icon-wrapper mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: '60px', height: '60px' }}>
                          <Icon size={24} />
                        </div>
                      </div>
                      <h3 className="h5 fw-bold mb-3">{benefit.title}</h3>
                      <p className="text-muted mb-0">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-3">Submit Your Business Details</h2>
                <p className="lead text-muted">Fill out the form below to get your business featured on our directory. We're excited to have you join our community!</p>
              </div>

              {/* Embedded Form */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <iframe
                    src="https://app.visionarybizz.com/widget/form/aOxhEvXglRo4YHMlWYLx"
                    style={{ width: '100%', height: '776px', border: 'none', borderRadius: '8px' }}
                    id="inline-aOxhEvXglRo4YHMlWYLx"
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Listing Forms - Expo"
                    data-height="776"
                    data-layout-iframe-id="inline-aOxhEvXglRo4YHMlWYLx"
                    data-form-id="aOxhEvXglRo4YHMlWYLx"
                    title="Listing Forms - Expo"
                  />
                </div>
              </div>
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

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata('/add-listing');
}