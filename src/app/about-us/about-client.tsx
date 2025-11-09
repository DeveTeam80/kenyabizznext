// src/app/about/about-client.tsx
"use client"
import React from 'react'
import Link from 'next/link'
import CountUp from 'react-countup'
import Image from 'next/image'

import { MdArrowForwardIos, MdBusiness, MdVerified, MdTrendingUp } from 'react-icons/md'
import { BsCaretRight, BsSearch, BsClipboardCheck, BsRocketTakeoff } from 'react-icons/bs'
import { FaHandshake, FaLightbulb, FaChartLine } from 'react-icons/fa'

import FooterTop from '../components/footer-top'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

// Statistics data
const statsData = [
  { number: 500, symbol: '+', title: 'Active Businesses' },
  { number: 50, symbol: '+', title: 'Business Categories' },
  { number: 47, symbol: '', title: 'Counties Covered' },
  { number: 98, symbol: '%', title: 'Client Satisfaction' },
]

// How it works steps
const processSteps = [
  {
    icon: BsSearch,
    title: 'Discover Businesses',
    desc: 'Browse through our comprehensive directory of verified Kenyan businesses across all industries and locations.'
  },
  {
    icon: BsClipboardCheck,
    title: 'Verify & Connect',
    desc: 'Access verified business information including contacts, locations, and services to make informed decisions.'
  },
  {
    icon: BsRocketTakeoff,
    title: 'Grow Together',
    desc: 'List your business and reach thousands of potential customers searching for services like yours.'
  },
]

// Our values
const values = [
  {
    icon: FaHandshake,
    title: 'Trust & Transparency',
    desc: 'We verify every business listing to ensure authenticity and build trust within our community.'
  },
  {
    icon: FaLightbulb,
    title: 'Innovation',
    desc: 'Leveraging technology to make business discovery and networking easier for all Kenyans.'
  },
  {
    icon: FaChartLine,
    title: 'Growth',
    desc: 'Committed to helping Kenyan businesses grow their digital presence and reach more customers.'
  },
]

export default function AboutUsClient() {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="bg-cover position-relative" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071')` }} 
        data-overlay="6"
      >
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
              <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                <h1 className="text-light xl-heading">About Kenya Bizz</h1>
                <nav id="breadcrumbs" className="breadcrumbs light">
                  <ul>
                    <li><Link href="/">Home</Link></li>
                    <MdArrowForwardIos className='ms-2' />
                    <li>About Us</li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="pb-5">
        <div className="container">
          <div className="row justify-content-between align-items-center g-4 mb-5">
            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12">
              <div className="missionImg">
                <Image 
                  src="/img/side-img.png" 
                  width={0} 
                  height={0} 
                  sizes='100vw' 
                  style={{ width: '100%', height: 'auto' }} 
                  className="img-fluid rounded-4" 
                  alt="Kenya Bizz Directory"
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="missioncaps">
                <div className="d-block mb-4">
                  <div className="d-flex align-items-start mb-2">
                    <span className="badge badge-xs badge-success rounded-pill">Our Mission</span>
                  </div>
                  <h2>Empowering Kenyan Businesses to Thrive Digitally</h2>
                </div>
                <p>
                  Kenya Bizz Directory is your trusted partner in discovering and connecting with businesses across Kenya. 
                  We believe every business deserves visibility and every customer deserves easy access to quality services.
                </p>
                <p>
                  Our platform bridges the gap between businesses and customers by providing a comprehensive, verified 
                  directory of Kenyan businesses. Whether you're looking for local services or promoting your business, 
                  we make it simple, fast, and effective.
                </p>
                <p>
                  From Nairobi to Mombasa, Kisumu to Eldoret, we help businesses become visible and grow their digital 
                  presence across all 47 counties in Kenya.
                </p>
                <div className="d-flex align-items-start justify-content-md-start justify-content-center mt-4">
                  <Link href="/add-listing" className="btn btn-primary rounded-pill px-5">
                    List Your Business
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="row justify-content-between align-items-center g-4 border-top pt-5">
            {statsData.map((item, index) => (
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6" key={index}>
                <div className="counter-wrap text-center">
                  <h2 className="mb-0 text-primary">
                    <CountUp className="ctr me-1" end={item.number} />
                    {item.symbol}
                  </h2>
                  <p className="m-0 fw-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-light">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Why Choose <span className="text-primary">Kenya Bizz</span>
                </h3>
                <p>We're committed to connecting Kenyan businesses with their ideal customers</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center g-4">
            {values.map((item, index) => {
              const Icon = item.icon
              return (
                <div className="col-xl-4 col-lg-4 col-md-6" key={index}>
                  <div className="card border-0 rounded-4 p-4 h-100">
                    <div className="text-center">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: '70px',
                          height: '70px',
                          backgroundColor: 'var(--bs-primary-bg-subtle)',
                          color: 'var(--bs-primary)'
                        }}
                      >
                        <Icon size={32} />
                      </div>
                      <h4 className="fw-medium mb-3">{item.title}</h4>
                      <p className="m-0 text-muted">{item.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  How Kenya Bizz <span className="text-primary">Works</span>
                </h3>
                <p>Simple steps to discover businesses or promote yours</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center g-4">
            {processSteps.map((item, index) => {
              const Icon = item.icon
              return (
                <div className="col-xl-4 col-lg-4 col-md-6" key={index}>
                  <div className="processWrap px-xl-4">
                    <div className="text-center position-relative">
                      <div className="processIcons d-block mb-4">
                        <div 
                          className="d-inline-flex align-items-center justify-content-center rounded-circle position-relative"
                          style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'var(--bs-primary)',
                            color: 'white'
                          }}
                        >
                          <Icon size={36} />
                          <span 
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-primary"
                            style={{ fontSize: '0.9rem', padding: '0.5rem 0.7rem' }}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="processCaps">
                        <h4 className="fw-medium mb-3">{item.title}</h4>
                        <p className="m-0 text-muted">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-4">
                <Link href="/listings" className="btn btn-outline-primary rounded-pill px-5">
                  Browse Businesses
                </Link>
                <Link href="/add-listing" className="btn btn-primary rounded-pill px-5">
                  List Your Business <BsCaretRight className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section 
        className="bg-cover" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1687422810663-c316494f725a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')`, backgroundColor: '#ffffff' }} 
        data-overlay="5"
      >
        <div className="container">
          <div className="row">
            <div className="row justify-content-center align-items-center mb-5">
              <div className="col-xl-10 col-lg-10 col-md-12 col-sm-12">
                <div className="position-relative text-center py-5">
                  <div className="promoTitle d-flex align-items-center justify-content-center mb-4">
                    <span className="badge badge-xs badge-transparent rounded-pill">
                      Join Thousands of Kenyan Businesses
                    </span>
                  </div>
                  <div className="promoHeading mb-4">
                    <h2 className="text-light mb-3">
                      Ready to Grow Your Business?
                    </h2>
                    <h4 className="text-light fw-normal">
                      List your business on Kenya's leading directory and reach thousands of potential customers today
                    </h4>
                  </div>
                  <div className="promoButtons d-flex flex-wrap gap-3 justify-content-center">
                    <Link href="/add-listing" className="btn btn-whites fw-medium rounded-pill px-5">
                      <MdBusiness className="me-2" />
                      Add Your Business
                    </Link>
                    <Link href="/listings" className="btn btn-outline-light fw-medium rounded-pill px-5">
                      <MdVerified className="me-2" />
                      Browse Verified Businesses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-light">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  What We <span className="text-primary">Offer</span>
                </h3>
                <p>Comprehensive features to help your business succeed</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="card border-0 rounded-4 p-4 h-100 shadow-sm">
                <div className="mb-3">
                  <MdBusiness size={40} className="text-primary" />
                </div>
                <h5 className="fw-medium mb-3">Free Business Listings</h5>
                <p className="m-0 text-muted">
                  List your business for free with complete details, images, contact information, and location.
                </p>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="card border-0 rounded-4 p-4 h-100 shadow-sm">
                <div className="mb-3">
                  <MdVerified size={40} className="text-primary" />
                </div>
                <h5 className="fw-medium mb-3">Verified Businesses</h5>
                <p className="m-0 text-muted">
                  All businesses go through our verification process to ensure authenticity and quality.
                </p>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="card border-0 rounded-4 p-4 h-100 shadow-sm">
                <div className="mb-3">
                  <MdTrendingUp size={40} className="text-primary" />
                </div>
                <h5 className="fw-medium mb-3">Increased Visibility</h5>
                <p className="m-0 text-muted">
                  Reach more customers through our SEO-optimized platform and comprehensive search features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterTop />
      <Footer />
      <BackToTop />
    </>
  )
}