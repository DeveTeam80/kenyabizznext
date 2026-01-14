// src/app/services/digital-marketing/page.tsx
// Force dynamic rendering - data from API isn't available at build time
export const dynamic = 'force-dynamic';
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MdArrowForwardIos } from 'react-icons/md'
import {
  BsGlobe,
  BsSearch,
  BsMegaphone,
  BsGraphUp,
} from 'react-icons/bs'
import { Metadata } from 'next'
import { generateSEOMetadata } from '../../../../lib/useSeo';

import NavbarServerWrapper from '@/app/components/navbar/navabar-server'
import FooterTop from '@/app/components/footer-top'
import Footer from '@/app/components/footer/footer'
import BackToTop from '@/app/components/back-to-top'
import ContactForm from './contact-form' // 🔥 Import the client component

// Services data
const services = [
  {
    icon: BsGlobe,
    title: 'Online Directory Listing',
    description: 'Get your business listed on Kenya\'s premier online directory. Increase visibility and reach thousands of potential customers across all 47 counties.',
    features: [
      'Verified business profile',
      'Complete business information',
      'Photos and gallery',
      'Location mapping',
      'Customer reviews',
      'Direct contact details'
    ]
  },
  {
    icon: BsSearch,
    title: 'SEO Optimization',
    description: 'Improve your search engine rankings and get found by customers searching for your services online.',
    features: [
      'Keyword research & strategy',
      'On-page SEO optimization',
      'Local SEO for Kenya market',
      'Google My Business setup',
      'Monthly performance reports',
      'Competitor analysis'
    ]
  },
  {
    icon: BsMegaphone,
    title: 'Social Media Marketing',
    description: 'Build your brand presence across Facebook, Instagram, Twitter, and LinkedIn with engaging content and targeted campaigns.',
    features: [
      'Social media strategy',
      'Content creation & scheduling',
      'Community management',
      'Paid social advertising',
      'Influencer partnerships',
      'Analytics & reporting'
    ]
  },
  {
    icon: BsGraphUp,
    title: 'Digital Advertising',
    description: 'Run targeted advertising campaigns to reach your ideal customers and drive conversions.',
    features: [
      'Google Ads management',
      'Facebook & Instagram ads',
      'Display advertising',
      'Retargeting campaigns',
      'A/B testing',
      'ROI optimization'
    ]
  }
]

// Why choose us points
const benefits = [
  {
    title: 'Expert Team',
    description: 'Seasoned professionals with proven track records in driving business growth across diverse industries'
  },
  {
    title: 'Data-Driven Strategy',
    description: 'Advanced analytics and insights to optimize campaigns and maximize your return on investment'
  },
  {
    title: 'Premium Results',
    description: 'Delivering exceptional outcomes through cutting-edge techniques and best-in-class execution'
  },
  {
    title: 'Personalized Service',
    description: 'Dedicated account management with tailored strategies designed specifically for your business goals'
  }
]
// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata('/services/digital-marketing')
}

export default function DigitalMarketingPage() {
  return (
    <>
      <NavbarServerWrapper />

      {/* Hero Section */}
      <section
        className="bg-cover position-relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80')` }}
        data-overlay="6"
      >
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-8 col-lg-10 col-md-12">
              <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                <h1 className="text-light xl-heading">Digital Marketing Services</h1>
                <p className="text-light fs-5 mb-4">
                  Grow Your Business with Our Digital Marketing Agency
                </p>
                <nav id="breadcrumbs" className="breadcrumbs light">
                  <ul>
                    <li><Link href="/">Home</Link></li>
                    <MdArrowForwardIos className='ms-2' />
                    <li><Link href="#">Services</Link></li>
                    <MdArrowForwardIos className='ms-2' />
                    <li>Digital Marketing</li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-11">
              <div className="text-center mb-5">
                <span className="badge badge-success rounded-pill mb-3">Our Services</span>
                <h2 className="mb-3">Complete Digital Marketing Solutions for Kenyan Businesses</h2>
                <p className="fs-6 text-muted">
                  We help businesses establish and grow their online presence through strategic digital marketing.
                  From getting listed on our directory to running comprehensive marketing campaigns, we've got you covered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="col-xl-6 col-lg-6 col-md-12">
                  <div className="card border-0 rounded-4 p-4 h-100 shadow-sm">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: 'var(--bs-primary-bg-subtle)',
                          color: 'var(--bs-primary)'
                        }}
                      >
                        <Icon size={28} />
                      </div>
                      <div>
                        <h4 className="fw-medium mb-2">{service.title}</h4>
                        <p className="text-muted mb-3">{service.description}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 className="fw-medium mb-3">What's Included:</h6>
                      <ul className="list-unstyled">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="mb-2 d-flex align-items-start">
                            <span className="text-primary me-2">✓</span>
                            <span className="text-muted">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-xl-8 col-lg-9 text-center">
              <h2 className="mb-3">Why Choose Kenya Bizz Digital Marketing?</h2>
              <p className="text-muted">
                We're more than just a marketing agency – we're your growth partner
              </p>
            </div>
          </div>

          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-xl-3 col-lg-6 col-md-6">
                <div className="card border-0 bg-light-primary rounded-4 p-4 h-100">
                  <h5 className="fw-medium mb-2">{benefit.title}</h5>
                  <p className="mb-0 text-muted">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 USE CLIENT COMPONENT FOR FORM */}
      <ContactForm />

      <FooterTop />
      <Footer />
      <BackToTop />
    </>
  )
}