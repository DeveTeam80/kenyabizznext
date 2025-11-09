// src/app/components/navbar/admin-navbar.tsx
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

import { 
  BsPersonCircle, BsBasket2, BsSearch, BsGeoAlt, BsSpeedometer, 
  BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, 
  BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, 
  BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, 
  BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, 
  BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, 
  BsGear, BsGeoAltFill, BsX 
} from "react-icons/bs"
import { FiX } from 'react-icons/fi'
import { FaSortDown, FaXmark } from 'react-icons/fa6'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'


export default function AdminNavbar() {
    const router = useRouter()
    const [scroll, setScroll] = useState(false)
    const [current, setCurrent] = useState('')
    const [windowWidth, setWindowWidth] = useState(0)
    const [toggle, setIsToggle] = useState(false)
    const [user, setUser] = useState<any>(null)

    const location = usePathname()
    
    useEffect(() => {
        fetchUser()
        
        if (typeof window === "undefined") return
        window.scrollTo(0, 0)
        setCurrent(location)

        const handlerScroll = () => {
            if (window.scrollY > 50) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }

        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth)
        }

        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('scroll', handlerScroll)
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('scroll', handlerScroll)
            window.removeEventListener('resize', handleResize)
        }
    }, [windowWidth, location])

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me')
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return (
        <>
            <div className={`header header-dark navdark ${scroll ? 'header-fixed' : ''}`} data-sticky-element="">
                <div className="container-fluid">
                    <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : "navigation navigation-portrait"}>
                        <div className="nav-header">
                            <Link className="nav-brand" href="/">
                                {/* <img src='/img/logo/kbd-white.png' className="logo" alt="Kenya Bizz"/> */}
                                <Image
                                src="/img/logo/kbd-white.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100px', height: 'auto' }}
                  className="logo"
                  alt="Kenya Bizz"
                  priority
                />
                            </Link>
                            <div className="nav-toggle" onClick={() => setIsToggle(!toggle)}></div>
                            <div className="mobile_nav">
                                <ul>
                                    <li>
                                        <Link 
                                            data-bs-toggle="offcanvas" 
                                            href="#offcanvasExample" 
                                            role="button" 
                                            aria-controls="offcanvasExample" 
                                            className="d-inline-flex py-0 pt-1 px-1"
                                        >
                                            <div className="d-inline-flex w-8 h-8 circle overflow-hidden">
                                                <img src={user?.avatar || '/img/team-2.jpg'} className="img-fluid" alt=""/>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider">
                                            <BsSearch className="me-1"/>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={`nav-menus-wrapper ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty: toggle ? 'none' : 'left'}}>
                            <div className='mobLogos'>
                                <img src='/img/logo.svg' className='img-fluid lightLogo' alt='Logo'/>
                            </div>
                            <span className='nav-menus-wrapper-close-button' onClick={() => setIsToggle(!toggle)}>✕</span>
                            <ul className="nav-menu">
                                <li className={`${current === '/dashboard' ? 'active' : ''}`}>
                                    <Link href="/dashboard">Dashboard</Link>
                                </li>

                                <li className={`${['/dashboard/my-listings', '/dashboard/add-listing'].includes(current) ? 'active' : ''}`}>
                                    <Link href="#">My Listings<span className="submenu-indicator"><span className="submenu-indicator-chevron"></span></span></Link>
                                    <ul className="nav-dropdown nav-submenu">
                                        <li className={`${current === '/dashboard/my-listings' ? 'active' : ''}`}>
                                            <Link href="/dashboard/my-listings" className='d-flex'>
                                                <BsUiRadiosGrid className="me-1 align-self-center"/>View Listings
                                            </Link>
                                        </li>
                                        <li className={`${current === '/dashboard/add-listing' ? 'active' : ''}`}>
                                            <Link href="/dashboard/add-listing" className='d-flex'>
                                                <BsPatchPlus className="me-1 align-self-center"/>Add Listing
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li className={`${current === '/dashboard/profile' ? 'active' : ''}`}>
                                    <Link href="/dashboard/profile">My Profile</Link>
                                </li>
                                
                                <li className="list-buttons d-lg-none">
                                    <Link href="/" className="btn btn-sm btn-light">Back to Site</Link>
                                </li>
                            </ul>

                            <ul className="nav-menu nav-menu-social align-to-right">
                                <li>
                                    <div className="btn-group account-drop">
                                        <Link href="#" className="nav-link btn-order-by-filt" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <div className="d-inline-flex w-8 h-8 circle overflow-hidden">
                                                <img src={user?.avatar || '/img/team-2.jpg'} className="img-fluid" alt=""/>
                                            </div>
                                            <span className="fw-medium d-inline-flex ms-2 text-light">
                                                {user?.name || 'User'}<FaSortDown className="ms-1"/>
                                            </span>
                                        </Link>
                                        <div className="dropdown-menu pull-right animated flipInX">
                                            <div className="drp_menu_headr bg-primary">
                                                <h4>Hi, {user?.name || 'User'}</h4>
                                                <div className="drp_menu_headr-right">
                                                    <Link href="/dashboard/profile" className="btn btn-whites text-dark">My Profile</Link>
                                                </div>
                                            </div>
                                            <ul>
                                                <li><Link href="/dashboard"><BsSpeedometer className="me-2"/>Dashboard</Link></li>
                                                <li><Link href="/dashboard/my-listings"><BsUiRadiosGrid className="me-2"/>My Listings</Link></li>
                                                <li><Link href="/dashboard/add-listing"><BsPatchPlus className="me-2"/>Add Listing</Link></li>
                                                <li><Link href="/dashboard/profile"><BsPersonLinesFill className="me-2"/>My Profile</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button onClick={handleLogout} className="dropdown-item text-danger">
                                                        <BsBoxArrowInRight className="me-2"/>Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-buttons">
                                    <Link href="/"><BsGeoAlt className="fs-6 me-1"/>Back to Site</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="clearfix"></div>

            {/* Mobile Offcanvas Menu */}
            <div className="offcanvas offcanvas-end offcanvas-menu" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-closes" data-bs-dismiss="offcanvas" aria-label="Close">
                        <FaXmark />
                    </button>
                </div>
                <div className="offcanvas-body" id="offcanvasExampleLabel">
                    <ul>
                        <li><a href="/dashboard"><BsSpeedometer className="me-2"/>Dashboard</a></li>
                        <li><a href="/dashboard/my-listings"><BsUiRadiosGrid className="me-2"/>My Listings</a></li>
                        <li><a href="/dashboard/add-listing"><BsPatchPlus className="me-2"/>Add Listing</a></li>
                        <li><a href="/dashboard/profile"><BsPersonLinesFill className="me-2"/>My Profile</a></li>
                        <li><hr /></li>
                        <li>
                            <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none w-100 text-start">
                                <BsBoxArrowInRight className="me-2"/>Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Search Slider */}
            <div className="offcanvas offcanvas-top h-auto" tabIndex={-1} id="searchSlider" aria-labelledby="searchSliderLabel">
                <div className="offcanvas-body" id="searchSliderLabel">
                    <div className="searchForm w-100 mb-3">
                        <div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
                            <div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
                            <div className="flex-fill">
                                <input type="search" className="form-control border-0 ps-0" placeholder="Search listings..."/>
                            </div>
                            <div className="closeSlides">
                                <Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close">
                                    <BsX />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}