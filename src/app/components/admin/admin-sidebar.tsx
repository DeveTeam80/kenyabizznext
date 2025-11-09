'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import {
    // Icons for regular users
    BsSpeedometer, BsUiRadiosGrid, BsPatchPlus, BsPersonLinesFill,
    // Icons for admin users (add these)
    BsHouseDoor, BsClock, BsList, BsPerson,
    // Shared icon
    BsBoxArrowRight,
    // New icons for collapse/expand
    BsChevronLeft, BsChevronRight
} from 'react-icons/bs'

export default function AdminSidebar() {
    const router = useRouter()
    const [current, setCurrent] = useState('')
    const [user, setUser] = useState<any>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = usePathname()


    useEffect(() => {
        setCurrent(location)
        fetchUser()

        // Load collapsed state from localStorage
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('sidebarCollapsed')
            if (savedState) {
                setIsCollapsed(JSON.parse(savedState))
            }
        }
    }, [location])

    useEffect(() => {
        // Update CSS variable when collapsed state changes
        document.documentElement.style.setProperty(
            '--sidebar-width',
            isCollapsed ? '80px' : '250px'
        )
    }, [isCollapsed])

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

    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
        }
    }

    // Dynamically set menu items based on user role
    const menuItems = user?.role === 'admin'
        ? [
            { href: '/admin/dashboard', icon: BsHouseDoor, label: 'Admin Dashboard' },
            { href: '/admin/listings?status=pending', icon: BsClock, label: 'Pending Listings' },
            { href: '/admin/listings?status=all', icon: BsList, label: 'All Listings' },
            { href: '/admin/users', icon: BsPerson, label: 'Users' },
        ]
        : [
            { href: '/dashboard', icon: BsSpeedometer, label: 'Dashboard' },
            { href: '/dashboard/my-listings', icon: BsUiRadiosGrid, label: 'My Listings' },
            { href: '/dashboard/add-listing', icon: BsPatchPlus, label: 'Add Listing' },
            { href: '/dashboard/profile', icon: BsPersonLinesFill, label: 'My Profile' },
        ];

    return (
        <div
            className="d-lg-block d-none"
            style={{
                width: isCollapsed ? '80px' : '250px',
                minWidth: isCollapsed ? '80px' : '250px',
                maxWidth: isCollapsed ? '80px' : '250px',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                position: 'relative'
            }}
        >
            <div
                className="user-dashboard-inner h-100 border-end border-2 py-5 position-sticky"
                style={{
                    top: '0',
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: isCollapsed ? '1rem 0.5rem' : '1rem',
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Toggle Button */}
                <button
                    onClick={toggleCollapse}
                    className="btn btn-sm btn-light-primary position-absolute shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                        width: '30px',
                        height: '30px',
                        zIndex: 100,
                        top: '16px',
                        right: isCollapsed ? '25px' : '16px',
                        transition: 'right 0.3s ease',
                        borderRadius: '50%',
                        padding: '0'
                    }}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <BsChevronRight size={16} /> : <BsChevronLeft size={16} />}
                </button>

                {/* User Profile Section */}
                <div className={`dashboard_users mb-4 ${isCollapsed ? 'text-center px-0' : ''}`} style={{ marginTop: '3rem' }}>
                    <div
                        className="circle mx-auto mb-1 overflow-hidden"
                        style={{
                            width: isCollapsed ? '50px' : '80px',
                            height: isCollapsed ? '50px' : '80px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Image
                            src={user?.avatar || '/img/team-2.jpg'}
                            width={isCollapsed ? 50 : 80}
                            height={isCollapsed ? 50 : 80}
                            className="img-fluid circle"
                            alt="User Image"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    {!isCollapsed && (
                        <div className="user-nameTitle text-center">
                            <h4 className="lh-base fw-semibold text-light mb-0">Welcome Back</h4>
                            <h6 className="text-light fw-medium opacity-75 mb-0">{user?.name || 'Loading...'}</h6>
                            <span className="badge bg-light-success text-success mt-2 text-capitalize">{user?.role || 'User'}</span>
                        </div>
                    )}
                </div>

                {/* Menu Section */}
                <div className="dashboard_Menu">
                    <ul className={isCollapsed ? 'p-0' : ''}>
                        {menuItems.map((item, index) => (
                            <li key={index} className={isCollapsed ? 'mb-2' : ''}>
                                <Link
                                    href={item.href}
                                    className={`${current === item.href ? 'active' : ''} d-flex align-items-center ${isCollapsed ? 'justify-content-center p-2' : 'px-3 py-2'}`}
                                    title={isCollapsed ? item.label : ''}
                                    style={{
                                        minHeight: '40px',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <item.icon className={isCollapsed ? '' : 'me-2'} size={20} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        ))}

                        {/* Logout button */}
                        <li className="mt-4 pt-4 border-top">
                            <button
                                onClick={handleLogout}
                                className={`btn btn-light-danger fw-medium w-100 d-flex align-items-center gap-2 ${isCollapsed ? 'justify-content-center p-2' : 'justify-content-center py-2'}`}
                                title={isCollapsed ? 'Logout' : ''}
                                style={{
                                    minHeight: '40px',
                                    borderRadius: '8px'
                                }}
                            >
                                <BsBoxArrowRight size={20} />
                                {!isCollapsed && <span>Logout</span>}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}