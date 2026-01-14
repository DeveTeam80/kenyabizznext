import { BsBackpack, BsBarChart, BsBasket2, BsCameraReels, BsCodeSlash, BsCoin, BsCreditCard2Back, BsCupHot, BsCupStraw, BsEnvelopeAt, BsFacebook, BsFileEarmarkTextFill, BsGraphUpArrow, BsHouseCheck, BsInstagram, BsLamp, BsLayers, BsLinkedin, BsLungs, BsPatchCheck, BsPatchQuestion, BsPeopleFill, BsPersonCheck, BsPinMap, BsPinMapFill, BsPinterest, BsShop, BsSuitHeart, BsTwitter, BsYelp } from "react-icons/bs";
import { FaDumbbell, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { IconType } from "react-icons";
import { BsBuildings } from "react-icons/bs";
import { LiaIndustrySolid } from "react-icons/lia";
import { FaBriefcaseMedical, FaLaptopCode } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import { GiBigDiamondRing } from "react-icons/gi";
import { FaSearchLocation, FaHandshake, FaHeart, FaPlusCircle, FaPlaneDeparture, FaShippingFast } from 'react-icons/fa';
import { GiGears } from "react-icons/gi";


export interface CategoryData {
    icon: IconType;
    title: string;
    list: string;
    link: string;
}

export const categoryData: CategoryData[] = [
    {
        icon: BsBuildings,
        title: 'Real Estate',
        list: '25+ Listings',
        link: '/listings/real-estate',
    },
    {
        icon: LiaIndustrySolid,
        title: 'Manufacturing',
        list: '40+ Listings',
        link: '/listings/manufacturing',
    },
    {
        icon: BsShop,
        title: 'Shops & Suppliers',
        list: '80+ Listings',
        link: '/listings/shops-and-suppliers',
    },
    {
        icon: FaBriefcaseMedical,
        title: 'Health & Services',
        list: '30+ Listings',
        link: '#',
    },
    {
        icon: GiWheat,
        title: 'Agribusiness',
        list: '18+ Listings',
        link: '#', // Assuming a link for this page
    },
    {
        icon: FaLaptopCode,
        title: 'IT & Innovation',
        list: '22+ Listings',
        link: '#', // Assuming a link for this page
    },
];

// src/app/data/data.ts

export interface ListData {
    id: number
    slug: string
    title: string

    // 🆕 Updated image fields
    logo: string          // Business logo (200x200px+)
    image: string         // Main listing image (800x600px+)
    bannerImage: string   // Banner image (1920x600px+)

    user: string // avatar path
    statusText: 'Verified' | 'Unclaimed' | 'Pending Approval'
    featured: boolean
    isVerified: boolean
    desc: string
    call: string
    location: string
    city: string
    subCategories: string[]
    categories: {
        slug: string
        name: string
        isPrimary: boolean
    }[]
    rating: 'high' | 'mid' | 'low'
    ratingRate: string
    review: string

    // Detail fields
    fullDescription: string[]
    website: string
    email: string
    locations: {
        branchName: string
        address: string
        contactPerson?: string
        phone: string
        email?: string
        mapEmbedUrl?: string
    }[]
    contentSectionTitle?: string
    contentBlocks?: {
        title: string
        description: string
        image: string // Additional images (800x600px+)
    }[]
    reviews?: {
        author: string
        rating: number
        comment: string
        date: string
    }[]
    workingHours?: {
        day: string
        hours: string
    }[]
    tags?: string[]
    socials?: {
        facebook?: string
        instagram?: string
        linkedin?: string
        twitter?: string
        youtube?: string
        whatsapp?: string
        tiktok?: string
    }
    seo?: {
        title?: string
        description?: string
        keywords?: string
        ogImage?: string
        twitterImage?: string
        robots?: string
        canonical?: string
    }
}



export const reviewData = [
    {
        rate: [FaStar, FaStar, FaStar, FaStar, FaStar],
        title: '"One of the Superb Platform"',
        desc: `Absolutely love Advertize! whenever I'm in need of finding a job, Advertize is my #1 go to! wouldn't look anywhere else.`,
        image: '/img/team-1.jpg',
        name: 'Aman Diwakar',
        position: 'General Manager'
    },
    {
        rate: [FaStar, FaStar, FaStar, FaStar, FaStar],
        title: '"One of the Superb Platform"',
        desc: `Overall, the Advertize application is a powerful tool for anyone in the job market. Its reliability, extensive job listings, and user-friendly..`,
        image: '/img/team-2.jpg',
        name: 'Ridhika K. Sweta',
        position: 'CEO of Agreeo'
    },
    {
        rate: [FaStar, FaStar, FaStar, FaStar, FaStar],
        title: '"One of the Superb Platform"',
        desc: `I love this Advertize app. it's more legit than the other ones with advertisement. Once I uploaded my resume, then employers...`,
        image: '/img/team-3.jpg',
        name: 'Shushil Kumar Yadav',
        position: 'Brand Manager'
    },
    {
        rate: [FaStar, FaStar, FaStar, FaStar, FaStar],
        title: '"One of the Superb Platform"',
        desc: `Advertize the best job finder app out there right now.. they also protect you from spammers so the only emails I get due to...`,
        image: '/img/team-4.jpg',
        name: 'Ritika K. Mishra',
        position: 'HR Head at Google'
    },
    {
        rate: [FaStar, FaStar, FaStar, FaStar, FaStar],
        title: '"One of the Superb Platform"',
        desc: `Advertize the best job finder app out there right now.. they also protect you from spammers so the only emails I get due to...`,
        image: '/img/team-5.jpg',
        name: 'Shree K. Patel',
        position: 'Chief Executive'
    },
    {
        rate: [FaStar, FaStar, FaStar, FaStar, FaStar],
        title: '"One of the Superb Platform"',
        desc: `Advertize the best job finder app out there right now.. they also protect you from spammers so the only emails I get due to...`,
        image: '/img/team-6.jpg',
        name: 'Sarwan Kumar Patel',
        position: 'Chief Executive'
    },
]

export const blogData = [
    {
        id: 1,
        image: '/img/blog-2.jpg',
        title: '10 Must-Have Bootstrap Templates for Modern Web Design',
        desc: "Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date: '13th Sept 2025',
        views: '12k Views'
    },
    {
        id: 2,
        image: '/img/blog-3.jpg',
        title: 'Top 5 Bootstrap Themes for E-commerce Websites.',
        desc: "Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date: '29th Nov 2025',
        views: '33k Views'
    },
    {
        id: 3,
        image: '/img/blog-4.jpg',
        title: 'The Ultimate Guide to Customizing Bootstrap Templates',
        desc: "Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date: '13th March 2025',
        views: '15k Views'
    },
    {
        id: 4,
        image: '/img/blog-5.jpg',
        title: 'Top 10 Free Bootstrap Templates for Your Next Project',
        desc: "Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date: '5th May 2025',
        views: '12k Views'
    },
    {
        id: 5,
        image: '/img/blog-6.jpg',
        title: 'Creating Stunning Landing Pages with Bootstrap: Best Practices',
        desc: "Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date: '19th June 2025',
        views: '33k Views'
    },
    {
        id: 6,
        image: '/img/blog-1.jpg',
        title: 'The Benefits of Using Bootstrap for Your Web Development Projects',
        desc: "Think of a news blog that's filled with content political against opponent Lucius Sergius Catilina. Hourly on the day of going live.",
        date: '20th June 2025',
        views: '15k Views'
    },
]

// Link data for the Footer component
export const footerLink1 = [
    { label: 'About Us', href: '/about-us' }, // Keep as placeholder since you don't have this page
    { label: 'Global Listings', href: '/global-listings' },
    { label: 'Add Listing', href: '/add-listing' }, // Keep as placeholder
    { label: 'Blog', href: '#' } // Keep as placeholder
];

export const footerLink2 = [
    { label: 'All Listings', href: '/listings' },
    { label: 'Real Estate', href: '/listings/real-estate' },
    { label: 'Manufacturing', href: '/listings/manufacturing' },
    { label: 'Shops & Suppliers', href: '/listings/shops-and-suppliers' }
];

export const footerLink3 = [
    { label: 'Terms of Use', href: '#' }, // Keep as placeholder
    { label: 'Privacy Policy', href: '#' }, // Keep as placeholder
    { label: 'Contact Us', href: '#' }, // Keep as placeholder
    { label: 'Sitemap', href: '/sitemap' }
];

// Interface for the city data structure
export interface CityData {
    image: string;
    gridClass: string;
    listing: string;
    name: string;
    tag: string[];
    alt?: string;
}


export const cityData: CityData[] = [
    {
        image: '/img/city/nairobi-v2.png',
        gridClass: 'col-xl-7 col-lg-7 col-md-12',
        listing: '220+ Listings',
        name: 'Nairobi',
        tag: ['Capital', 'Commercial Hub', 'International Business'],
        alt: 'Skyline view of Nairobi city, Kenya',
    },
    {
        image: '/img/city/mombasa-web-v2.png',
        gridClass: 'col-xl-5 col-lg-5 col-md-6',
        listing: '130+ Listings',
        name: 'Mombasa',
        tag: ['Trade', 'Shipping', 'Tourism'],
        alt: 'Mombasa coastal city with port and ocean view',
    },
    {
        image: '/img/city/kisumu-v2.png',
        gridClass: 'col-xl-5 col-lg-5 col-md-6',
        listing: '85+ Listings',
        name: 'Kisumu',
        tag: ['Agriculture', 'Commerce', 'Logistics'],
        alt: 'Kisumu city on Lake Victoria in Kenya',
    },
    {
        image: '/img/city/nakunru-v2.png',
        gridClass: 'col-xl-7 col-lg-7 col-md-12',
        listing: '90+ Listings',
        name: 'Nakuru',
        tag: ['Agribusiness', 'Industrial', 'Enterprise'],
        alt: 'Nakuru city with surrounding highlands in Kenya',
    },
    {
        image: '/img/city/eldoret.jpg',
        gridClass: 'col-xl-4 col-lg-4 col-md-6',
        listing: '75+ Listings',
        name: 'Eldoret',
        tag: ['Agriculture', 'Education', 'Manufacturing'],
        alt: 'Eldoret city in Kenya, known for farming and education',
    },
    {
        image: '/img/city/malindi.webp',
        gridClass: 'col-xl-4 col-lg-4 col-md-6',
        listing: '50+ Listings',
        name: 'Malindi',
        tag: ['Coastal', 'Tourism', 'Marine Park'],
        alt: 'Malindi coastal town in Kenya with beaches and marine park',
    },
];


export const eventData = [
    {
        image: '/img/eve-1.jpg',
        date: '13',
        month: 'March',
        tag: 'Cooking',
        tagIcon: BsCupHot,
        iconStyle: 'badge badge-xs badge-danger',
        title: 'Learn Cooc with Shree Patel',
        time: '10:30 AM To 14:40 PM'
    },
    {
        image: '/img/eve-2.jpg',
        date: '5',
        month: 'May',
        tag: 'Nightlife',
        tagIcon: BsCupHot,
        iconStyle: 'badge badge-xs badge-success',
        title: 'Enjoy with Adobe Ceremoney',
        time: '20:0 AM To 22:30 PM'
    },
    {
        image: '/img/eve-3.jpg',
        date: '19',
        month: 'June',
        tag: 'Workshop',
        tagIcon: BsCupHot,
        iconStyle: 'badge badge-xs badge-warning',
        title: 'Join AI Community Workshop',
        time: '8:30 AM To 12:20 PM'
    },
]

export const workData = [
    {
        icon: FaSearchLocation,
        title: 'Discover',
        desc: 'Search by category, location, or service to find businesses near you—from Nairobi to Kisumu and everywhere in between.',
    },
    {
        icon: FaHandshake,
        title: 'Connect',
        desc: 'Reach out directly via call, WhatsApp, or website. No middlemen, no delays—just simple, direct communication.',
    },
    {
        icon: FaHeart,
        title: 'Support',
        desc: 'Buy, hire, or collaborate with trusted businesses and help grow Kenya’s vibrant economy.',
    },
    {
        icon: FaPlusCircle,
        title: 'Get Listed',
        desc: 'Own a business? Add your listing in minutes and get discovered by thousands of potential customers across Kenya.',
    },
];
export const reviewData2 = [
    {
        image: '/img/google.png',
        rate: '4.8',
        star: [FaStar, FaStar, FaStar, FaStar, FaStarHalfStroke],
        reviews: '422k Reviews'
    },
    {
        image: '/img/trustpilot.png',
        rate: '4.8',
        star: [FaStar, FaStar, FaStar, FaStar, FaStarHalfStroke],
        reviews: '422k Reviews'
    },
    {
        image: '/img/capterra.png',
        rate: '4.8',
        star: [FaStar, FaStar, FaStar, FaStar, FaStarHalfStroke],
        reviews: '422k Reviews'
    },
]

export const adminCounter = [
    {
        icon: BsPinMapFill,
        iconStyle: 'text-success',
        number: 23,
        symbol: '',
        title: 'Active Listings',
        bg: 'bg-light-success'
    },
    {
        icon: BsGraphUpArrow,
        iconStyle: 'text-danger',
        number: 32,
        symbol: 'K',
        title: 'Total Views',
        bg: 'bg-light-danger'
    },
    {
        icon: BsSuitHeart,
        iconStyle: 'text-warning',
        number: 4,
        symbol: 'K',
        title: 'Total Saved',
        bg: 'bg-light-warning'
    },
    {
        icon: BsYelp,
        iconStyle: 'text-info',
        number: 88,
        symbol: '',
        title: 'Total Reviews',
        bg: 'bg-light-info'
    },
]

export const chatData = [
    {
        image: '/img/team-8.jpg',
        name: 'Warlinton Diggs',
        time: '08:20 AM',
        msg: 'How are you stay dude?',
        pandding: false,
        message: 0
    },
    {
        image: '/img/team-7.jpg',
        name: 'Chad M. Pusey',
        time: '06:40 AM',
        msg: 'Hey man it is possible to pay mo..',
        pandding: true,
        message: 5
    },
    {
        image: '/img/team-6.jpg',
        name: 'Mary D. Homer',
        time: '08:10 AM',
        msg: 'Dear you have a spacial offers...',
        pandding: true,
        message: 3
    },
    {
        image: '/img/team-5.jpg',
        name: 'Marc S. Solano',
        time: '10:10 AM',
        msg: 'Sound good! We will meet you aft...',
        pandding: false,
        message: 0
    },
    {
        image: '/img/team-4.jpg',
        name: 'Sandra W. Barge',
        time: '07:20 PM',
        msg: 'I am also good and how are...',
        pandding: true,
        message: 2
    },
]

export const invoiceData = [
    {
        name: 'Basic Platinum Plan',
        id: '#PC01362',
        status: 'Paid',
        date: 'Sept 13,2025'
    },
    {
        name: 'Standard Platinum Plan',
        id: '#PC01363',
        status: 'Unpaid',
        date: 'March 13,2025'
    },
    {
        name: 'Extended Platinum Plan',
        id: '#PC01364',
        status: 'On Hold',
        date: 'June 19,2025'
    },
    {
        name: 'Basic Platinum Plan',
        id: '#PC01365',
        status: 'Paid',
        date: 'June 20,2025'
    },
]

export const bookingData = [
    {
        image: '/img/team-1.jpg',
        title: 'Mubarak Barbar Shop',
        tag: 'Salon',
        pending: true,
        unpaid: true,
        approved: false,
        cancelled: false,
        reject: true,
        approve: true,
        sendMsg: true,
        date: '13.03.2025 at 1:00 PM',
        info: '02 Adults, 01 Child',
        name: 'Kallay Mortin',
        contact: '41 125 254 2563',
        price: '$25.50'
    },
    {
        image: '/img/team-2.jpg',
        title: 'Sunrise Apartment',
        tag: 'Apartment',
        pending: false,
        unpaid: false,
        approved: true,
        cancelled: false,
        reject: false,
        approve: false,
        sendMsg: true,
        date: '14.06.2024 - 15.06.2025 at 11:30 AM',
        info: '02 Adults, 02 Child',
        name: 'Kalla Adroise',
        contact: '41 125 254 6258',
        price: '$17,00'
    },
    {
        image: '/img/team-3.jpg',
        title: 'Blue Star Cafe',
        tag: 'Restaurants',
        pending: false,
        unpaid: false,
        approved: false,
        cancelled: true,
        reject: false,
        approve: false,
        sendMsg: false,
        date: '12.05.2024 at 16:30 AM',
        info: '02 Adults, 01 Child',
        name: 'Sorika Michel',
        contact: '441 125 254 625',
        price: '$245.00'
    },
    {
        image: '/img/team-4.jpg',
        title: 'now Valley Resort',
        tag: 'Hotel',
        pending: false,
        unpaid: true,
        approved: true,
        cancelled: false,
        reject: false,
        approve: true,
        sendMsg: true,
        date: '14.10.2024 at 08:30 PM',
        info: '03 Adults, 01 Child',
        name: 'Kallay Mortin',
        contact: '41 125 254 2563',
        price: '$25.50'
    },
]
export const adminListing = [
    {
        image: '/img/list-1.jpg',
        title: 'The Big Bumbble Gym',
        location: '410 Apex Avenue, California USA',
        review: '412 Reviews',
        expired: false
    },
    {
        image: '/img/list-2.jpg',
        title: 'Greenvally Real Estate',
        location: '410 Apex Avenue, California USA',
        review: '152 Reviews',
        expired: true
    },
    {
        image: '/img/list-3.jpg',
        title: 'The Blue Ley Light',
        location: '520 Adde Resort, Liverpool UK',
        review: '302 Reviews',
        expired: false
    },
    {
        image: '/img/list-4.jpg',
        title: 'Shreya Study Center',
        location: '102 Hozri Avenue, California USA',
        review: '180 Reviews',
        expired: false
    },
]

export const message = [
    {
        id: 1,
        image: '/img/team-1.jpg',
        name: 'Karan Shivraj',
        time: 'Today'
    },
    {
        id: 2,
        image: '/img/team-2.jpg',
        name: 'Shree Preet',
        time: 'just Now'
    },
    {
        id: 3,
        image: '/img/team-3.jpg',
        name: 'Shikhar Musk',
        time: '30 min ago'
    },
    {
        id: 4,
        image: '/img/team-4.jpg',
        name: 'Mortin Mukkar',
        time: 'Yesterday'
    },
    {
        id: 5,
        image: '/img/team-5.jpg',
        name: 'Melly Arjun',
        time: 'Today'
    },
    {
        id: 6,
        image: '/img/team-6.jpg',
        name: 'Mortin Mukkar',
        time: 'Yesterday'
    },
]

export const adminReview = [
    {
        image: '/img/team-1.jpg',
        name: 'Karan Shivraj',
        date: '13th March 2025',
        desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
    {
        image: '/img/team-2.jpg',
        name: 'Shree Preet',
        date: '5th May 2025',
        desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
    {
        image: '/img/team-3.jpg',
        name: 'Shikhar Musk',
        date: '19th June 2025',
        desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
    {
        image: '/img/team-4.jpg',
        name: 'Mortin Mukkar',
        date: '20th June 2025',
        desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    },
]

export const earning = [
    {
        name: 'Swarna Apartment',
        id: '#PC01362',
        date: 'Dec 10,2025',
        value: '$200 USD',
        free: '$17.10 USD'
    },
    {
        name: 'Blue Cafe',
        id: '#PC01363',
        date: 'Jan 12,2025',
        value: '$150 USD',
        free: '$12.30 USD'
    },
    {
        name: 'Kanoop Barbar Shop',
        id: '#PC01364',
        date: 'Sep 22,2023',
        value: '$75.50 USD',
        free: '$10.20 USD'
    },
    {
        name: 'Classic Casino',
        id: '#PC01365',
        date: 'Dec 16,2024',
        value: '$652 USD',
        free: '$80.90 USD'
    },
]

export const counterData = [
    {
        number: 145,
        symbol: 'K',
        title: 'Daily New Visitors'
    },
    {
        number: 670,
        symbol: '',
        title: 'Active Listings'
    },
    {
        number: 22,
        symbol: '',
        title: 'Won Awards'
    },
    {
        number: 642,
        symbol: 'K',
        title: 'Happy Customers'
    },
]

export const teamData = [
    {
        image: '/img/team-1.jpg',
        name: 'Julia F. Mitchell',
        position: 'Chief Executive'
    },
    {
        image: '/img/team-2.jpg',
        name: 'Maria P. Thomas',
        position: 'Co-Founder'
    },
    {
        image: '/img/team-3.jpg',
        name: 'Willa R. Fontaine',
        position: 'Field Manager'
    },
    {
        image: '/img/team-4.jpg',
        name: 'Rosa R. Anderson',
        position: 'Business Executive'
    },
    {
        image: '/img/team-5.jpg',
        name: 'Jacqueline J. Miller',
        position: 'Account Manager'
    },
    {
        image: '/img/team-6.jpg',
        name: 'Oralia R. Castillo',
        position: 'Writing Manager'
    },
    {
        image: '/img/team-7.jpg',
        name: 'Lynda W. Ruble',
        position: 'Team Manager'
    },
]
export const mostViewBlog = [
    {
        image: '/img/blog-2.jpg',
        title: 'Top 10 Free Bootstrap Templates for Your Next Project',
        date: '13th Sept 2025'
    },
    {
        image: '/img/blog-3.jpg',
        title: 'Top 10 Free Bootstrap Templates for Your Next Project',
        date: '29th Nov 2025'
    },
    {
        image: '/img/blog-4.jpg',
        title: 'Top 10 Free Bootstrap Templates for Your Next Project',
        date: '13th March 2025'
    },
    {
        image: '/img/blog-5.jpg',
        title: 'Top 10 Free Bootstrap Templates for Your Next Project',
        date: '5th May 2025'
    },
    {
        image: '/img/blog-6.jpg',
        title: 'Top 10 Free Bootstrap Templates for Your Next Project',
        date: '19th June 2025'
    },
]

export const blogTag = ['Job', 'Web Design', 'Development', 'Figma', 'Photoshop', 'HTML']

export const blogSocial = [
    BsFacebook, BsTwitter, BsInstagram, BsPinterest, BsLinkedin
]

export const helpData = [
    {
        icon: BsPeopleFill,
        title: 'Community',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Share', 'Network', 'Discussion']
    },

    {
        icon: BsFileEarmarkTextFill,
        title: 'Order',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Tracking', 'Delivery', 'Management']
    },
    {
        icon: BsCoin,
        title: 'Refund Policy',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Methods', 'Process']
    },
    {
        icon: BsPersonCheck,
        title: 'Account Issues',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Profile', 'Settings', 'Password']
    },
    {
        icon: BsBarChart,
        title: 'Business Helps',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Dashboard', 'Report', 'Logistics']
    },
    {
        icon: BsCreditCard2Back,
        title: 'Payment',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Methods', 'VAT', 'Security']
    },
    {
        icon: BsCameraReels,
        title: 'Guides',
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Tutorials', 'Blogs', 'Newsletters']
    },
    {
        icon: BsPatchQuestion,
        title: `FAQ's`,
        desc: `Think of a news blog that's filled with content hourly on the day of going live.`,
        tag: ['Help', 'Articles']
    },
]

export const articles = [
    {
        title: 'What are Favorites?',
        desc: `"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title: 'How Do I Add Or Change My Billing Details?',
        desc: `"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title: 'How do I change my username?',
        desc: `"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title: 'How do I change my email address?',
        desc: `"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title: `I'm not receiving the verification email`,
        desc: `"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
    {
        title: 'How do I change my password?',
        desc: `"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you’re not ready to u...`
    },
]

export const faqData1 = [
    {
        id: 'collapseOne',
        title: 'How to Meet KenyaBizzDirectory Directory Agents?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseTwo',
        title: 'Can I see Property Visualy?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseThree',
        title: 'Can We Sell it?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseFour',
        title: 'Can We Customized it According me?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseFive',
        title: 'Can We Get Any Extra Services?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
]
export const faqData2 = [
    {
        id: 'collapseOne2',
        title: 'Can We Refund it Within 7 Days?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseTwo2',
        title: 'Can We Pay Via PayPal Service?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseThree2',
        title: 'Will You Accept American Express Card?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseFour2',
        title: 'Will You Charge Monthly Wise?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseFive2',
        title: 'Can We Get Any Extra Services?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
]
export const faqData3 = [
    {
        id: 'collapseOne3',
        title: 'Realcout Agent Can Chat Online?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseTwo3',
        title: 'Can I Call Agent on Site?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
    {
        id: 'collapseThree3',
        title: 'Is This Collaborate with Oyo?',
        desc: `In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.`
    },
]