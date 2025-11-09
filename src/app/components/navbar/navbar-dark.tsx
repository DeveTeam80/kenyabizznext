'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  BsPersonCircle, BsSearch, BsGeoAlt, BsX
} from "react-icons/bs"
import { FiX } from 'react-icons/fi'

// Types
interface NavItem {
  href: string
  label: string
  submenu?: NavItem[]
}

interface NavbarDarkProps {
  categories?: NavItem[]
}

const MOBILE_BREAKPOINT = 991
const SCROLL_THRESHOLD = 50

const NavbarDark: React.FC<NavbarDarkProps> = ({ categories = [] }) => {
  // State management
  const [isScrolled, setIsScrolled] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // Navigation data with dynamic categories
  const navItems: NavItem[] = [
    { href: "/about-us", label: "About" },
    { href: "/#explore", label: "Explore Kenya" },
    {
      href: "#",
      label: "Listing",
      submenu: [
        { href: "/listings", label: "All Listings" },
        ...categories, // Spread the dynamic categories
      ]
    },
    { href: "/global-listings", label: "Global Listings" }
  ]

  const popularSearches = [
    "Real Estate", "Eat & Drink", "Shopping", "Nightlife", "Services"
  ]

  // Event handlers
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    setIsScrolled(scrollY > SCROLL_THRESHOLD)
  }, [])

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Effects
  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
      setWindowWidth(window.innerWidth)
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [handleScroll, handleResize])

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && windowWidth <= MOBILE_BREAKPOINT) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, windowWidth])

  // Helper functions
  const isActiveRoute = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isMobile = windowWidth <= MOBILE_BREAKPOINT

  // Render functions
  const renderNavItem = (item: NavItem) => (
    <li key={item.href} className={isActiveRoute(item.href) ? 'active' : ''}>
      <Link href={item.href} onClick={item.submenu ? undefined : closeMobileMenu}>
        {item.label}
        {item.submenu && (
          <span className="submenu-indicator">
            <span className="submenu-indicator-chevron" />
          </span>
        )}
      </Link>
      {item.submenu && (
        <ul className="nav-dropdown nav-submenu">
          {item.submenu.map(subItem => (
            <li key={subItem.href}>
              <Link href={subItem.href} onClick={closeMobileMenu}>
                {subItem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )

  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Main Header */}
      <div className={`header header-light ${isScrolled ? 'header-fixed' : ''}`} data-sticky-element="">
        <div className="container-fluid">
          <nav
            id="navigation"
            className={isMobile ? "navigation navigation-portrait" : "navigation navigation-landscape"}
          >
            {/* Nav Header */}
            <div className="nav-header">
              <Link className="nav-brand" href="/">
                <Image
                  src="/img/logo/logoa.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100px', height: 'auto' }}
                  className="logo"
                  alt="logo image"
                  priority
                />
              </Link>

              <div className="nav-toggle" onClick={toggleMobileMenu}></div>

              <div className="mobile_nav">
                <ul>
                  {/* <li>
                    <Link href="#login" className="d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#login">
                      <BsPersonCircle className="me-1" />
                    </Link>
                  </li> */}
                  <li>
                    <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider">
                      <BsSearch className="me-1" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Navigation Menu */}
            <div
              className={`nav-menus-wrapper ${isMobileMenuOpen ? 'nav-menus-wrapper-open' : ''}`}
              style={{ transitionProperty: isMobileMenuOpen ? 'none' : 'left' }}
            >
              <div className='mobLogos'>
                <Image
                  src='/img/logo/logoa.png'
                  width={0}
                  height={0}
                  sizes='100vw'
                  style={{ width: '140px', height: 'auto' }}
                  className='img-fluid lightLogo'
                  alt='Logo'
                />
              </div>

              <span className='nav-menus-wrapper-close-button' onClick={closeMobileMenu}>✕</span>

              <ul className="nav-menu">
                {navItems.map(renderNavItem)}
              </ul>

              <ul className="nav-menu nav-menu-social align-to-right">
                {/* <li>
                  <Link href="#login" className="d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#login">
                    <BsPersonCircle className="fs-6 me-1" />
                    <span className="navCl">Sign In / Sign Up</span>
                  </Link>
                </li> */}
                <li className="list-buttons">
                  <Link href="/add-listing" onClick={closeMobileMenu}>
                    <BsGeoAlt className="fs-6 me-1" />
                    Add Listing
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div className="clearfix"></div>

      {/* Login Modal */}
      <div
        className="modal fade"
        id="login"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="loginmodal"
        aria-hidden="true"
      >
        <div className="modal-dialog" id="loginmodal">
          <div className="modal-content">
            <div className="modal-header justify-content-end border-0 pb-0">
              <Link href="#" className="square--30 circle bg-light-danger text-danger" data-bs-dismiss="modal" aria-label="Close">
                <FiX />
              </Link>
            </div>

            <div className="modal-body px-4">
              <div className="text-center mb-5">
                <h2>Welcome Back</h2>
                <p className="fs-6">Login to manage your account.</p>
              </div>

              <form className="needs-validation px-lg-2" noValidate>
                <div className="row align-items-center justify-content-between g-3 mb-4">
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <Link
                      href="#"
                      className="btn btn-outline-secondary border rounded-3 text-md px-lg-2 full-width"
                    >
                      <Image
                        src="/img/google.png"
                        width={16}
                        height={16}
                        className="img-fluid me-2"
                        alt="Google logo"
                      />
                      Login with Google
                    </Link>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <Link
                      href="#"
                      className="btn btn-outline-secondary border rounded-3 text-md px-lg-2 full-width"
                    >
                      <Image
                        src="/img/facebook.png"
                        width={16}
                        height={16}
                        className="img-fluid me-2"
                        alt="Facebook logo"
                      />
                      Login with Facebook
                    </Link>
                  </div>
                </div>

                <div className="form-group form-border mb-4">
                  <label className="form-label" htmlFor="email01">Your email</label>
                  <input type="email" className="form-control" id="email01" placeholder="email@site.com" required />
                  <span className="invalid-feedback">Please enter a valid email address.</span>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label" htmlFor="pass01">Password</label>
                    <Link href="/forgot-password" className="link fw-medium text-primary">Forgot Password?</Link>
                  </div>

                  <div className="input-group-merge form-group form-border ">
                    <input type="password" className="form-control" id="pass01" placeholder="8+ characters required" required />
                  </div>
                  <span className="invalid-feedback">Please enter a valid password.</span>
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary fw-medium">Log in</button>
                </div>

                <div className="text-center">
                  <p>Don't have an account yet? <Link className="link fw-medium text-primary" href="/register">Sign up here</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Search Offcanvas */}
      <div
        className="offcanvas offcanvas-top h-auto"
        tabIndex={-1}
        id="searchSlider"
        aria-labelledby="searchSliderLabel"
      >
        <div className="offcanvas-body" id="searchSliderLabel">
          <div className="searchForm w-100 mb-3">
            <div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
              <div className="searchicons">
                <span><BsSearch className="fs-4 opacity-75" /></span>
              </div>
              <div className="flex-fill">
                <input type="search" className="form-control border-0 ps-0" placeholder="What are you looking for?" />
              </div>
              <div className="closeSlides">
                <Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close">
                  <BsX />
                </Link>
              </div>
            </div>
          </div>

          <div className="popularSearches d-flex align-items-center justify-content-center gap-2 flex-wrap">
            {popularSearches.map(text => (
              <div key={text} className="singleItem">
                <Link href="#" className="badge badge-xs badge-primary rounded-pill">
                  {text}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default NavbarDark