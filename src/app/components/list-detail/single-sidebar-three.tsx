'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Select = dynamic(()=>import('react-select'),{ssr:false})

import { BsBrowserChrome, BsCalendar, BsEnvelope, BsFacebook, BsInstagram, BsSuitHeart, BsTwitterX, BsWhatsapp, BsYoutube } from 'react-icons/bs'
import { BiPhone } from 'react-icons/bi'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { IconType } from 'react-icons'

interface Personal{
    icon: IconType;
    title: string;
    desc: string;
    link?: string; // Add link property for clickable items
}

interface Social{
    icon: IconType;
    style: string;
    link?: string; // Add link property
    name: string; // Add name for identification
}

interface ListData {
  id: number;
  slug: string;
  title: string;
  image: string;
  logo: string;
  user: string;
  statusText: 'Verified' | 'Unclaimed' | 'Pending Approval';
  featured: boolean;
  isVerified: boolean;
  desc: string;
  call: string;
  location: string;
  city: string;
  subCategory: string;
  categories: {
    slug: string;
    name: string;
    isPrimary: boolean;
  }[];
  rating: 'high' | 'mid' | 'low';
  ratingRate: string;
  review: string;
  bannerImage: string;
  fullDescription: string[];
  website: string;
  email: string;
  locations: {
    branchName: string;
    address: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    mapEmbedUrl?: string;
  }[];
  contentSectionTitle?: string;
  contentBlocks?: {
    title: string;
    description: string;
    image: string;
  }[];
  reviews?: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  workingHours?: {
    day: string;
    hours: string;
  }[];
  tags?: string[];
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
    tiktok?: string;
  };
}

interface SingleSidebarThreeProps {
  listing: ListData;
}

export default function SingleSidebarThree({ listing }: SingleSidebarThreeProps) {
    const [selectedOptions, setSelectedOptions] = useState<object>([]);
    const [guests, setGuests] = useState<boolean>(false);
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);

    // Use actual listing data for personal info
    const personal: Personal[] = [
        {
          icon: BsEnvelope,
          title: 'Email',
          desc: listing.email || 'No email provided',
          link: listing.email ? `mailto:${listing.email}` : undefined
        },
        {
          icon: BiPhone,
          title: 'Phone No.',
          desc: listing.call || 'No phone provided',
          link: listing.call ? `tel:${listing.call}` : undefined
        },
        {
          icon: BsBrowserChrome,
          title: 'Website',
          desc: listing.website || 'No website provided',
          link: listing.website
        },
    ]

    // Create social links array based on available socials data
    const social: Social[] = [
        {
            icon: BsFacebook,
            style: 'color--facebook',
            link: listing.socials?.facebook,
            name: 'Facebook'
        },
        {
            icon: BsTwitterX,
            style: 'color--twitter',
            link: listing.socials?.twitter,
            name: 'Twitter'
        },
        {
            icon: BsInstagram,
            style: 'color--instagram',
            link: listing.socials?.instagram,
            name: 'Instagram'
        },
        {
            icon: BsYoutube,
            style: 'color--pinterest',
            link: listing.socials?.youtube,
            name: 'YouTube'
        },
        {
            icon: BsWhatsapp,
            style: 'color--whatsapp',
            link: listing.socials?.whatsapp,
            name: 'WhatsApp'
        },
    ].filter(item => item.link); // Only show socials that have links
    
    const options = [
        { value: 'slice', label: 'Slice' },
        { value: 'burger', label: 'Burger' },
        { value: 'coffee', label: 'Coffee' },
        { value: 'thali', label: 'Indian Thali' },
        { value: 'tandoori', label: 'Tandoori' },
        { value: 'chips', label: 'Chips' },
    ];

    const option2 = [
        { value: '1', label: '07:00 AM' },
        { value: '2', label: '07:30 AM' },
        { value: '3', label: '08:00 AM' },
        { value: '4', label: '08:30 AM' },
        { value: '5', label: '09:00 AM' },
        { value: '6', label: '09:30 AM' },
        { value: '7', label: '10:30 AM' },
        { value: '8', label: '11:30 AM' },
        { value: '9', label: '12:30 AM' },
    ]

    // Use actual working hours or fallback to default
    const timeTable = listing.workingHours && listing.workingHours.length > 0 
        ? listing.workingHours.map(wh => ({ day: wh.day, time: wh.hours }))
        : [
            { day:'Monday', time:'8:00 Am To 10:00 PM'},
            { day:'Tuesday', time:'8:00 Am To 10:00 PM'},
            { day:'Wednesday', time:'8:00 Am To 10:00 PM'},
            { day:'Thursday', time:'8:00 Am To 10:00 PM'},
            { day:'Friday', time:'8:00 Am To 10:00 PM'},
            { day:'Saturday', time:'8:00 Am To 10:00 PM'},
            { day:'Sunday', time:'Closed'},
        ];

    const handleChange = (selected:any) => {
        setSelectedOptions(selected);
    };

    return (
        <div className="sidebarGroups d-flex flex-column gap-4">
            
            <div className="card">
                <div className="avatarInfo mb-2">
                    {personal.map((item: Personal, index: number) => {
                        let Icon = item.icon
                        return(
                            <div className="py-3 px-3 border-top" key={index}>
                                <div className="infoFlexio d-flex align-items-center justify-content-start gap-2">
                                    <div className="square--40 rounded bg-light-primary"><Icon className="text-primary"/></div>
                                    <div className="infoDetails">
                                        <p className="text-muted lh-base mb-0">{item.title}</p>
                                        {item.link ? (
                                            <Link href={item.link} className="text-dark lh-base fw-medium fs-6 mb-0 text-decoration-none">
                                                {item.desc}
                                            </Link>
                                        ) : (
                                            <p className="text-dark lh-base fw-medium fs-6 mb-0">{item.desc}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                {/* Only show social footer if there are social links */}
                {social.length > 0 && (
                    <div className="card-footer bg-white border-top">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                            {social.map((item: Social, index: number) => {
                                let Icon = item.icon
                                return(
                                    <div className="flexSocial" key={index}>
                                        <Link 
                                            href={item.link || '#'} 
                                            className="square--40 circle border"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={item.name}
                                        >
                                            <Icon className={item.style}/>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="card">
                <div className="card-header py-3">
                    <div className="headerFirst"><h6>Opening Hours</h6></div>
                    <div className="headerLast">
                        <span className="badge badge-xs badge-success rounded-pill">Now Open</span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="openingsInfo">
                        {timeTable.map((item,index)=>{
                            return(
                                <div className="py-3 px-3 border-top" key={index}>
                                    <div className="infoFlexio d-flex align-items-center justify-content-between">
                                        <p className="text-dark text-md fw-medium lh-base mb-0">{item.day}</p>
                                        <p className="text-dark text-sm fw-medium lh-base mb-0">{item.time}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-body px-3">
                    <div className="form-group mb-1">
                        <button type="button" className="btn btn-whites border rounded-pill fw-medium w-100">
                            <BsSuitHeart className="me-2"/>Bookmark This Listing
                        </button>
                    </div>
                    <div className="form-group text-center mb-4">
                        <p className="text-md">45 People Bookmark This Place</p>
                    </div>
                    
                    {/* Only show share buttons if there are social links */}
                    {social.length > 0 && (
                        <div className="form-group m-0">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                {social.slice(0, 3).map((item: Social, index: number) => {
                                    let Icon = item.icon
                                    return(
                                        <Link
                                            key={index}
                                            href={item.link || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`btn btn-md btn-whites border rounded-pill ${item.style} flex-fill text-decoration-none`}
                                        >
                                            <Icon className="me-1"/>{item.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}