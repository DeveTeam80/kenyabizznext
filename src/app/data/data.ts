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
    subCategory: string
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

export const listData: ListData[] = [
    {
        id: 1,
        slug: 'smb-properties',
        title: 'SMB Properties',
        logo: '/img/logo-3.png',
        image: '/img/listings/smb-properties/smb-grid.png',
        city: 'Mombasa',
        location: '2nd Floor, Fairdeal Plaza, Nyali Road, Mombasa',
        subCategory: 'Residential Properties',
        isVerified: true,
        featured: true,
        statusText: 'Verified',
        ratingRate: '4.9',
        review: '(31 Reviews)',
        user: '/img/avatars/avatar-1.jpg',
        rating: 'high',
        categories: [
            { slug: 'real-estate', name: 'Real Estate', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/smb-properties/smbproperties-banner.jpg',
        desc: 'Leading real estate agency specializing in residential and commercial properties.',

        fullDescription: [
            "SMB are privately-owned luxury property developers that bring to life residential projects that are designed with pristine detail for a premium living experience. Our aim as a new venture is to build projects with distinct craftsmanship and deliver the best end property result to please our clients. We’re passionate about curating unique homes, with custom materials and details for our homes to be a rewarding investment for the years to come.",
            "We strive to be renowned for every property we design, develop and create that distinguishes it from the rest in the market. With stunning yet accessible locations, the residents in our homes will be able to enjoy gorgeous views. Our personal approach to really connect with our client’s needs and deliver accordingly allows us to be build and create strong links of associations and trusted relationships. Through this extensive network, we are able to remain professional and grow into an entity that is able to develop bespoke property solutions for extraordinary living."
        ],
        website: "https://smb.ke/",
        email: "sales@smbproperties.co.ke",
        call: "+254 110 052 052",
        locations: [
            {
                branchName: "Mombasa Office",
                address: "2nd Floor, Fairdeal Plaza, Nyali Road, Mombasa",
                phone: "+254 110 052 052",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.144936753173!2d39.6857714!3d-4.0349131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18401286754d512d%3A0x1b3366b5b6d09db9!2sFairdeal%20Plaza%20-%20Mombasa!5e0!3m2!1sen!2ske!4v1691574393796!5m2!1sen!2ske"
            }
        ],
        contentSectionTitle: "Our Projects",
        contentBlocks: [
            {
                title: "Le Mirage",
                description: "Le Mirage offers modern comfort in a prime location, with easy access to dining, shopping, and entertainment.",
                image: "/img/listings/smb-properties/smb-gallery.png"
            },
            {
                title: "SMB Suites",
                description: "SMB Suites in Mombasa offers private luxury living with top amenities, including a rooftop pool, gym, mini theatre, BBQ area, and kids’ playground perfect for families or holiday stays.",
                image: "/img/listings/smb-properties/smb-gallery-2.png"
            },
            {
                title: "SMB Karura View",
                description: "SMB Karura View offers luxury 2–4 bedroom homes in Parklands with forest views, penthouses, and easy access to Westlands.",
                image: "/img/listings/smb-properties/smb-gallery-3.png"
            }
        ],
        reviews: [
            {
                "author": "Aisha N.",
                "rating": 5,
                "comment": "The team at SMB was incredibly professional and helped us find our dream apartment. Highly recommended!",
                "date": "2025-07-18"
            }
        ],
        workingHours: [
            { "day": "Monday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Tuesday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Wednesday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Thursday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Friday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Home", "Residence", "Real estate", "Fancyhouse"],
        socials: {
            facebook: "https://www.facebook.com/smb.properties",
            instagram: "https://www.instagram.com/smb.properties/?hl=en",
            whatsapp: "https://api.whatsapp.com/send/?phone=254110052052"
        },
    },
    {
        id: 2,
        slug: 'pearl-of-africa-natural-spices-ltd',
        title: 'Uganda Natural Spice',
        logo: '/img/logo-3.png',
        image: '/img/listings/pearl-of-africa-natural-spices-ltd/unitedpearls-grid.jpg',
        city: 'Kampala',
        location: 'Plot 492 Bukasa Road, Muyenga, Kampala, Uganda',
        subCategory: 'Food Processing',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.5',
        review: '(15 Reviews)',
        user: '/img/avatars/avatar-2.jpg',
        rating: 'high',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/pearl-of-africa-natural-spices-ltd/unitedpearls-banner.jpg',
        desc: 'Exporters of high-quality, organic spices from the heart of Africa.',
        fullDescription: [
            "Uganda Natural Spice is a premier Ugandan spice merchant, delivering the true taste of Uganda to the world. Leveraging the country's ideal climate and fertile soil, they cultivate and export a wide range of aromatic and flavorful spices.",
            "Their commitment is to provide products that are 100% natural and untouched by chemicals or artificial flavors. With a focus on freshness and intense flavor, their spices are saturated with color and have a rich, textured taste designed to bring food to life. From exotic vanilla to fiery Bird's Eye Chilli, they offer superior, pure, and authentic Ugandan spices."
        ],
        website: "https://ugandanaturalspice.com/",
        email: "sales@pearlofafrica.com",
        call: "+256772733364",
        locations: [
            {
                branchName: "Main Office",
                address: "Plot 492 Bukasa Road, Muyenga, Kampala, Uganda",
                phone: "+256 772 733364",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.765922126461!2d32.62126437713934!3d0.29364309893889434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc27a71a4661%3A0x39e572bdd1b05856!2s492%20Bukasa%20Rd%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sin!4v1754457334494!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Spice Range",
        contentBlocks: [
            {
                title: "Vanilla",
                description: "High-quality, plump vanilla beans from Uganda, prized for their rich aroma and creamy flavor.",
                image: "/img/listings/pearl-of-africa-natural-spices-ltd/unitedpearls1.jpg"
            },
            {
                title: "Bird's Eye Chilli",
                description: "Authentic Ugandan Bird's Eye Chilli, known for its intense heat and vibrant, fruity flavor.",
                image: "/img/listings/pearl-of-africa-natural-spices-ltd/unitedpearls2.jpg"
            },
            {
                title: "Cardamom",
                description: "Premium green cardamom pods with a rich, complex flavor ideal for both sweet and savory recipes.",
                image: "/img/listings/pearl-of-africa-natural-spices-ltd/unitedpearls3.jpg"
            },
            {
                title: "Cloves",
                description: "Whole, aromatic cloves delivering a warm, sweet spice for a variety of culinary uses.",
                image: "/img/listings/pearl-of-africa-natural-spices-ltd/unitedpearls4.jpg"
            }
        ],
        reviews: [], // No reviews listed on the page
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Spices", "Organic", "Vanilla", "Uganda", "Exporter", "Natural"],
        socials: {
            facebook: "https://www.facebook.com/Fresh-Bite-Tomato-Ketchup-109053147536256/",
            whatsapp: "https://web.whatsapp.com/send?phone=256755997475"
        },
    },
    {
        id: 3,
        slug: 'fairdeal-properties',
        title: 'Fairdeal Properties',
        logo: '/img/logo-3.png',
        image: '/img/listings/fairdeal-properties/fairdeal-grid.png',
        city: 'Nairobi',
        location: 'M4, Parkview Heights, Opp Nextgen Mall, Mombasa Road',
        subCategory: 'Commercial Properties',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.7',
        review: '(22 Reviews)',
        user: '/img/avatars/avatar-3.jpg',
        rating: 'high',
        categories: [
            { slug: 'real-estate', name: 'Real Estate', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/fairdeal-properties/fairdeal-banner.png',
        desc: 'Affordable and reliable property solutions for buyers and renters.',
        fullDescription: [
            "Fairdeal Properties was founded in 2008 with the vision of providing quality solutions across all segments of the Kenyan real estate market. Leveraging on the experience of our sister companies which are involved in building materials, glass & furniture, Fairdeal Properties has experienced tremendous growth with a number of successfully completed projects both in Mombasa and Nairobi.",
            "Over the years, our reputation has grown steadily, driven by a strong track record of successfully completed residential, commercial, and mixed-use projects in key urban centers like Mombasa and Nairobi. Each project reflects our unwavering commitment to architectural excellence, modern living standards, and customer satisfaction. At Fairdeal Properties, we are more than just property developers we are partners in building thriving communities and creating long-term value."
        ],
        website: "https://fairdeal.properties/",
        email: "sales@fairdealproperties.biz",
        call: "+254 705 791 702",
        locations: [
            {
                branchName: "Main Office",
                address: "M4, Parkview Heights, Opp Nextgen Mall, Mombasa Road",
                phone: "+254 705 791 702",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.21534687984!2d36.8452776!3d-1.3229648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11c4029ce67b%3A0x35de844f8490766a!2sFairdeal%20Properties!5e0!3m2!1sen!2ske!4v1722783243806!5m2!1sen!2ske"
            }
        ],
        contentSectionTitle: "Our Projects",
        contentBlocks: [
            {
                title: "Aqual Vista Residences",
                description: "Aqua Vista Residences in Old Nyali, Mombasa is a premium residential project offering 1-, 2-, and 3-bedroom apartments designed for modern coastal living.",
                image: "/img/listings/fairdeal-properties/fairdeal-1.png"
            },
            {
                title: "Fairvalley Heights Nairobi",
                description: "FairValley Heights in Athi River, near Nairobi, is a residential project offering 1- to 4-bedroom units designed for modern living.",
                image: "/img/listings/fairdeal-properties/fairdeal-2.png"
            },
            {
                title: "Lantana Sky Apartment",
                description: "Lantana Sky Apartments on Lantana Road, Westlands, is a new mid- to high-end development offering 1-, 2-, and 3-bedroom units.",
                image: "/img/listings/fairdeal-properties/fairdeal-3.png"
            },
            {
                title: "Sky Terrace Nairobi",
                description: "Sky Terrace on Brookside Drive, Nairobi, is a new mid- to high-end residential development offering 1-, 2-, and 3-bedroom apartments.",
                image: "/img/listings/fairdeal-properties/fairdeal-4.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Tuesday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Wednesday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Thursday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Friday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Home", "Residence", "Real estate", "Fancyhouse"],
        socials: {
            facebook: "https://www.facebook.com/fairdealpropertieske/",
            whatsapp: "https://api.whatsapp.com/send?phone=254705791702"
        },
    },
    {
        id: 4,
        slug: 'royal-group-kenya',
        title: 'Royal Group Kenya',
        logo: '/img/logo-3.png',
        image: '/img/listings/royal-group-kenya/royalgroup-grid.jpg',
        city: 'Nairobi',
        location: 'Royal ICT Business Park, Mombasa Road, Nairobi, Kenya',
        subCategory: 'Construction & Consulting',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.2',
        review: '(10 Reviews)',
        user: '/img/avatars/avatar-4.jpg',
        rating: 'mid',
        categories: [
            { slug: 'real-estate', name: 'Real Estate', isPrimary: true },
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: false },
            { slug: 'services', name: 'Services', isPrimary: false },
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/royal-group-kenya/royalgroup-banner.jpg',
        desc: 'A prominent and diversified business conglomerate in East Africa.',
        fullDescription: [
            "From its humble beginnings as a single glass mart in 1954, Royal Group of Companies has evolved over seven decades into one of East Africa's most prominent and diversified business conglomerates. Headquartered at the Royal ICT Business Park in Nairobi, the group's portfolio spans multiple industries, including real estate development (Kings Developers Ltd), manufacturing (Royal Industries Ltd, Royal Steel Mills Ltd), logistics (Royal Freight Ltd), and retail.",
            "Guided by a core philosophy of integrity, client focus, and excellence, Royal Group's vision is to be a leader in every market it serves, delivering quality products and exceptional value to its customers across the region."
        ],
        website: "https://www.royalgroupkenya.com/",
        email: "info@royalgroupkenya.com",
        call: "+254728888777",
        locations: [
            {
                branchName: "Headquarters",
                address: "Royal ICT Business Park, Mombasa Road, Nairobi, Kenya",
                phone: "+254728888777",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31910.136285734563!2d36.785920274316375!3d-1.315318000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f113148a8aa31%3A0xbcde6dc5c86c3ffd!2sRoyal%20business%20park!5e0!3m2!1sen!2sin!4v1754398170064!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Diverse Portfolio",
        contentBlocks: [
            {
                title: "Kings Manufacturers Limited (KML)",
                description: "Manufacturing ultra-high quality products from wooden furniture and uPVC windows to concrete bricks.",
                image: "/img/listings/royal-group-kenya/royalgroup1.jpg"
            },
            {
                title: "Royal Industries Ltd.",
                description: "Manufacturing international quality PVC pipes, tanks, and fittings certified by the Kenya Bureau of Standards (KEBS).",
                image: "/img/listings/royal-group-kenya/royalgroup2.jpg"
            },
            {
                title: "Royal Steel Mills Ltd.",
                description: "Produces Africa's toughest TMT and HSD steel bars for construction, known for high ductility and earthquake resistance.",
                image: "/img/listings/royal-group-kenya/royalgroup3.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Friday", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["RealEstate", "Manufacturing", "Logistics", "Kenya", "Diversified", "Excellence"],
        socials: {
            facebook: "https://www.facebook.com/royalgroupkenya/",
            instagram: "https://www.instagram.com/royalgroupkenya/",
            linkedin: "https://www.linkedin.com/company/royal-group-of-companies-ea/"
        },
    },
    {
        id: 5,
        slug: 'impala-glass',
        title: 'Impala Glass Industries',
        logo: '/img/logo-3.png',
        image: '/img/listings/impala-glass/impalaglass-grid.jpg',
        city: 'Nairobi',
        location: 'Addis Ababa Road, Industrial Area Nairobi, Kenya',
        subCategory: 'Glass Manufacturing',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.6',
        review: '(19 Reviews)',
        user: '/img/avatars/avatar-5.jpg',
        rating: 'high',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/impala-glass/impala-banner.jpg',
        desc: 'Leading glass processing and supply for construction and automotive industries.',
        fullDescription: [
            "Impala Glass Industries Ltd stands as a leading glass processing company in Kenya, driven by a well-trained and committed workforce. Their success is built on strong customer support and advanced product development skills, positioning them to lead the future of glass processing in the region.",
            "Their vision is to be the preferred local provider of cost-effective, high-quality architectural and automotive glass solutions. Through a world-class processing platform, skilled employees, and strategic partnerships, Impala Glass is dedicated to maintaining market leadership and delivering exceptional value and integrity to all stakeholders."
        ],
        website: "https://www.impalaglass.com/",
        email: "communications@impala.co.ke",
        call: "+254786606052",
        locations: [
            {
                branchName: "Main Office",
                address: "Addis Ababa Road, Industrial Area Nairobi, Kenya",
                phone: "+254786606052",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1994.3962948427918!2d36.840733!3d-1.299233!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1113fd778605%3A0xf17e4da988b59a0d!2sImpala%20Glass%20Industries%20Ltd!5e0!3m2!1sen!2sus!4v1754374769595!5m2!1sen!2sus"
            }
        ],
        contentSectionTitle: "Our Products & Projects",
        contentBlocks: [
            {
                title: "Architectural Glass",
                description: "High-quality glass solutions for modern buildings, including facades, windows, and custom designs.",
                image: "/img/listings/impala-glass/impala1.jpg"
            },
            {
                title: "Automotive Glass",
                description: "Durable and safe glass for all types of vehicles, ensuring clarity and protection on the road.",
                image: "/img/listings/impala-glass/impala2.jpg"
            },
            {
                title: "Advanced Glass Processing",
                description: "Utilizing state-of-the-art technology for precise cutting, tempering, and laminating services.",
                image: "/img/listings/impala-glass/impala3.jpg"
            },
            {
                title: "Custom Solutions",
                description: "Bespoke glass products tailored to meet the unique requirements of any project or design.",
                image: "/img/listings/impala-glass/impala4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Friday", "hours": "7:30 AM - 4:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["AutomotiveGlass", "ArchitecturalGlass", "GlassProcessing", "Kenya", "Construction", "SafetyGlass"],
        socials: {
            facebook: "https://www.facebook.com/ImpalaGlass",
            instagram: "https://instagram.com/impalaglass_automotive?igshid=1xicro3a2pug",
            twitter: "https://twitter.com/impalaglass",
            linkedin: "http://linkedin.com/in/impala-glass-industries-ltd-263835183",
            youtube: "https://www.youtube.com/user/ImpalaGlass",
            whatsapp: "https://wa.me/+254786606052"
        },
    },
    {
        id: 6,
        slug: 'multi-cable-ltd',
        title: 'Multi Cable Limited',
        logo: '/img/logo-3.png',
        image: '/img/listings/multi-cable-ltd/multicable-grid.jpg',
        city: 'Dar Es Salaam',
        location: 'Dar Es Salaam, Tanzania',
        subCategory: 'Electrical Manufacturing',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.4',
        review: '(11 Reviews)',
        user: '/img/avatars/avatar-1.jpg',
        rating: 'mid',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/multi-cable-ltd/multicable-banner.jpg',
        desc: 'High-quality electrical cables and wiring for all industrial needs.',
        fullDescription: [
            "Since its establishment in the early 2000s, Multi Cable Limited (MCL) has grown from a proud Tanzanian company into a regional powerhouse with a strong presence in Kenya, Zambia, and Uganda. Committed to unwavering excellence, MCL is a distinguished manufacturer and supplier of a diverse range of products, including cables, pipes, steel, and transformers.",
            "In addition to its own manufacturing capabilities, MCL is a leading importer and the sole distributor for renowned international brands such as Panasonic, Havells, and Bajaj, making it a comprehensive solution provider for industrial and consumer needs across East Africa."
        ],
        website: "https://www.multicable.co.tz",
        email: "info@multicable.co.tz",
        call: "+255222123468",
        locations: [
            {
                branchName: "Head Office",
                address: "Dar Es Salaam, Tanzania (Branches Across East Africa)",
                phone: "+255 22 212 3468",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5765036883768!2d39.281362474756136!3d-6.821248893176521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b135d790923%3A0xc55703e247ed54c8!2sMulti%20Cable%20Limited%20(MCL)%20DSM%20-%20Clocktower!5e0!3m2!1sen!2sin!4v1754387445249!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Product Categories",
        contentBlocks: [
            {
                title: "Cables",
                description: "A wide range of high-quality electrical cables for residential, commercial, and industrial applications.",
                image: "/img/listings/multi-cable-ltd/multicable1.jpg"
            },
            {
                title: "Pipes and Plastics",
                description: "Durable PVC pipes, fittings, and other plastic products for plumbing and construction needs.",
                image: "/img/listings/multi-cable-ltd/multicable2.jpg"
            },
            {
                title: "Steel Products",
                description: "Reliable steel products for construction and industrial use, ensuring strength and longevity.",
                image: "/img/listings/multi-cable-ltd/multicable3.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Friday", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Cables", "Pipes", "Tanzania", "Industrial", "Panasonic", "Havells"],
        socials: {
            facebook: "https://www.facebook.com/pages/category/Shopping---retail/Multi-Cable-Limited-442615569554861/",
            instagram: "https://www.instagram.com/multicable.limited/",
            youtube: "https://www.youtube.com/channel/UCrYtnGlOmEYCSzR6j7VtiBA",
            whatsapp: "https://wa.me/+255742655347"
        }
    },
    {
        id: 7,
        slug: 'hebatullah',
        title: 'Hebatullah Bros LTD',
        logo: '/img/logo-3.png',
        image: '/img/listings/hebatullah-bros-ltd/hebatullah-grid.jpg',
        city: 'Nairobi',
        location: 'Airport North Rd, Embakasi Nairobi, Kenya',
        subCategory: 'Hardware Manufacturing',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.8',
        review: '(25 Reviews)',
        user: '/img/avatars/avatar-2.jpg',
        rating: 'high',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/hebatullah-bros-ltd/hebatullah-banner1.jpg',
        desc: 'Specialists in industrial hardware and building materials supply.',
        fullDescription: [
            "From a small shop on Biashara Street in 1930, Hebatullah Bros LTD (HBL) has grown into a titan of the Kenyan glass industry. As a leading importer, supplier, and manufacturer, HBL has consistently pioneered modern architectural solutions in East Africa. The company introduced the first mirror work industry in 1958 and brought the first powder coating facility for aluminum profiles to Kenya in 1986.",
            "Continuing its legacy of innovation, HBL introduced the Curtain Walling System in 1992 and has since invested in state-of-the-art Italian machinery for superior glass processing, a toughening plant for flat and curved glass, and an automated PVB lamination plant for enhanced safety. Today, HBL offers a comprehensive range of products, including uPVC solutions, sandblasted mirrors, shower cubicles, and custom glass furniture, solidifying its reputation for quality, durability, and aesthetic excellence."
        ],
        website: "https://www.hebatullah.com/",
        email: "info@hebatullah.com",
        call: "+254722786606",
        locations: [
            {
                branchName: "Main Office",
                address: "Airport North Rd, Embakasi Nairobi, Kenya",
                phone: "0722 / 0733-786 606",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7471261408305!2d36.88853377472458!3d-1.3277150986596966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f126b3ce48be1%3A0x19fff5e98084376a!2sHebatullah%20Brothers%20Limited%20-%20Head%20Office!5e0!3m2!1sen!2sin!4v1754371980776!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Products & Projects",
        contentBlocks: [
            {
                title: "Andy Building Glass Facade",
                description: "A comprehensive structural glazing project featuring high-performance, energy-efficient glass for the building's stunning curtain wall facade.",
                image: "/img/listings/hebatullah-bros-ltd/hebatullah1.jpg"
            },
            {
                title: "Apollo Building Glass Railings",
                description: "Supplied and installed custom-laminated safety glass for elegant balcony railings and expansive, soundproof windows.",
                image: "/img/listings/hebatullah-bros-ltd/hebatullah2.jpg"
            },
            {
                title: "ABC Phase 2 uPVC Windows",
                description: "Provided cost-effective and durable uPVC windows and toughened glass solutions for all residential units in this large-scale housing project.",
                image: "/img/listings/hebatullah-bros-ltd/hebatullah3.jpg"
            },
            {
                title: "Riana Towers Curved Glass",
                description: "Engineered and executed a complex facade using custom-curved, toughened glass panels, creating a signature architectural statement.",
                image: "/img/listings/hebatullah-bros-ltd/hebatullah4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Friday", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Glass", "Construction", "ToughenedGlass", "Architecture", "CurtainWalling", "uPVC"],
        socials: {
            facebook: "https://www.facebook.com/hebatullah.glass",
            instagram: "https://www.instagram.com/hebatullah53/",
            whatsapp: "https://web.whatsapp.com/send?phone=254722786606"
        }
    },
    {
        id: 8,
        slug: 'saifee-chemicals',
        title: 'Saifee Chemicals',
        logo: '/img/logo-3.png',
        image: '/img/listings/saifee-chemicals/saifee-chemicals-grid.jpg',
        city: 'Nairobi',
        location: '37 Funzi Road, Off Enterprise Road, Industrial Area, Nairobi, Kenya',
        subCategory: 'Chemical Supply',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.1',
        review: '(8 Reviews)',
        user: '/img/avatars/avatar-3.jpg',
        rating: 'mid',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/saifee-chemicals/saifeechemicals-bannner.jpg',
        desc: 'Industrial and commercial chemical supplier.',
        fullDescription: [
            "Established in Kenya in 2012, Saifee Chemicals has grown from a small operation into a leading manufacturer and exporter of high-quality industrial chemicals across Africa. With a steadfast commitment to quality and performance, Saifee Chemicals has become a trusted name for professionals and businesses.",
            "Their core expertise lies in producing a premium range of car body fillers, comparable to top international brands, alongside essential materials like unsaturated polyester resin for fiberglass and a variety of other industrial chemicals. Saifee Chemicals is dedicated to innovation and customer satisfaction, consistently delivering reliability and excellence with every product."
        ],
        website: "https://www.saifeechem.com/",
        email: "info@saifeechem.com",
        call: "+254733917792",
        locations: [
            {
                branchName: "Main Office",
                address: "37 Funzi Road, Off Enterprise Road, Industrial Area, Nairobi, Kenya",
                phone: "+254 733 917792 / +254 724 906184",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7855217172996!2d36.84440587472451!3d-1.303701798683918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f110e912b7775%3A0x44e08598cb30f8c9!2sSaifee%20Chemicals%20Ltd!5e0!3m2!1sen!2sin!4v1754394976933!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Product Range",
        contentBlocks: [
            {
                title: "Car Body Fillers",
                description: "A premium range of fillers for a smooth, professional finish in all automotive repair needs.",
                image: "/img/listings/saifee-chemicals/saifeechemicals1.jpg"
            },
            {
                title: "Fiberglass Raw Materials",
                description: "High-quality materials like unsaturated polyester resin, essential for durable fiberglass products.",
                image: "/img/listings/saifee-chemicals/saifeechemicals2.jpg"
            },
            {
                title: "Industrial Chemicals",
                description: "A diverse range of industrial chemicals for applications like coatings, adhesives, and cleaning agents.",
                image: "/img/listings/saifee-chemicals/saifeechemicals3.jpg"
            },
            {
                title: "Premium Ultimate Filler",
                description: "Our hero product, a premium-quality filler comparable to renowned brands like Isopon P38.",
                image: "/img/listings/saifee-chemicals/saifeechemicals4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:00 AM - 4:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["BodyFiller", "Chemicals", "Manufacturing", "Kenya", "Fiberglass", "Automotive"],
        socials: {
            facebook: "https://www.facebook.com/profile.php?id=61566528098036",
            instagram: "https://www.instagram.com/saifeechemicalskenya/",
            tiktok: "https://www.tiktok.com/@saifee.chemicals",
            whatsapp: "https://wa.me/254733917792"
        }
    },
    {
        id: 9,
        slug: 'rawat-foods',
        title: 'Rawat Foods',
        logo: '/img/logo-3.png',
        image: '/img/listings/rawat-foods/rawat-foods-grid.jpg',
        city: 'Kampala',
        location: 'Plot 653, Lugala - Mengo, Kampala, Uganda',
        subCategory: 'Food Processing',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.3',
        review: '(12 Reviews)',
        user: '/img/avatars/avatar-4.jpg',
        rating: 'mid',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/rawat-foods/rawatfoods-banner.jpg',
        desc: 'Quality food processing and packaging services.',
        fullDescription: [
            "Rawat Foods is a Kampala-based company dedicated to providing Halal, hygienic, healthy, and convenient food products. With a customer-driven and service-oriented approach, they are committed to a business model of excellence, using natural ingredients to create the healthiest options for their customers.",
            "They take pride in delivering a range of high-quality, affordable products. Their core offerings include delicious condiments such as Real Mayonnaise, Tomato Ketchup, Hot Chilli Sauce, and White Vinegar, all manufactured with a focus on nutritional value and great taste."
        ],
        website: "https://rawatfoods.com/",
        email: "customer@rawatfoods.com",
        call: "+256755558964",
        locations: [
            {
                branchName: "Main Office",
                address: "Plot 653, Lugala - Mengo, P.O. Box 1000, Kampala, Uganda",
                phone: "+256 755 558964 / +256 755 997475",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7557713722076!2d32.53623067472339!3d0.3208275996760217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb007431f0a7%3A0x4ac250fd41d9d809!2sRawat%20Food%20Industries!5e0!3m2!1sen!2ske!4v1754379070544!5m2!1sen!2ske"
            }
        ],
        contentSectionTitle: "Our Products",
        contentBlocks: [
            {
                title: "Real Mayonnaise",
                description: "Creamy and delicious mayonnaise made from natural ingredients, perfect for sandwiches and salads.",
                image: "/img/listings/rawat-foods/rawatfoods1.jpg"
            },
            {
                title: "Tomato Ketchup",
                description: "A rich and tangy tomato ketchup, a classic condiment for all your favorite meals.",
                image: "/img/listings/rawat-foods/rawatfoods2.jpg"
            },
            {
                title: "Hot Chilli Sauce",
                description: "A spicy and flavorful chilli sauce designed to add a fiery kick to your dishes.",
                image: "/img/listings/rawat-foods/rawatfoods3.jpg"
            },
            {
                title: "White Vinegar",
                description: "Pure and versatile white vinegar, ideal for cooking, pickling, and various household uses.",
                image: "/img/listings/rawat-foods/rawatfoods4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Sat", "hours": "9:00 AM - 6:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Food", "Manufacturing", "Ketchup", "Uganda", "Halal", "Condiments"],
        socials: {
            facebook: "https://www.facebook.com/Fresh-Bite-Tomato-Ketchup-109053147536256/",
            whatsapp: "https://web.whatsapp.com/send?phone=256755997475"
        }
    },
    {
        id: 10,
        slug: 'meps-fencing-system',
        title: 'MEPS Fencing Systems',
        logo: '/img/logo-3.png',
        image: '/img/listings/meps-fencing-system/mepfence-grid.jpg',
        city: 'Nairobi',
        location: 'Funzi Road, Industrial Area, Nairobi, Kenya',
        subCategory: 'Security Manufacturing',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.9',
        review: '(28 Reviews)',
        user: '/img/avatars/avatar-5.jpg',
        rating: 'high',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true },

        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/meps-fencing-system/mepsfencing-banner.png',
        desc: 'Advanced fencing and security solutions for commercial and residential use.',
        fullDescription: [
            "MEPS Fencing Systems Limited is a leading manufacturer and supplier of comprehensive security solutions based in Nairobi, Kenya. They specialize in a wide range of high-quality fencing products designed to meet diverse security needs for residential, commercial, and industrial clients.",
            "Their extensive product line includes electric fencing components like energizers and insulators, anti-climb fences, automatic gates, and advanced security systems such as CCTV and access control. By offering a complete suite of products, from fence wire and posts to installation tools, MEPS Fencing positions itself as a one-stop shop for all perimeter security requirements."
        ],
        website: "https://www.mepsfencing.com/",
        email: "info@mepsfencing.com",
        call: "+254719339981",
        locations: [
            {
                branchName: "Main Office",
                address: "Funzi Road, Industrial Area, Nairobi, Kenya",
                phone: "+254 719 339981 / 0722 514594",
                mapEmbedUrl: "" // No map was present in the HTML
            }
        ],
        contentSectionTitle: "Our Products & Services",
        contentBlocks: [
            {
                title: "Electric Fencing",
                description: "High-voltage energizers, insulators, and wiring for robust perimeter security solutions.",
                image: "/img/listings/meps-fencing-system/mepsfencing1.jpg"
            },
            {
                title: "Automatic Gates",
                description: "Reliable and secure automated gate systems for residential, commercial, and industrial properties.",
                image: "/img/listings/meps-fencing-system/mepsfencing2.jpg"
            },
            {
                title: "Chain Link Fencing",
                description: "Versatile and durable chain link solutions ideal for securing large areas, residential plots, and recreational fields.",
                image: "/img/listings/meps-fencing-system/mepsfencing3.jpg"
            },
            {
                title: "Anti-Climb Fence",
                description: "Specialized high-security mesh fencing with anti-climb features to deter and prevent unauthorized access.",
                image: "/img/listings/meps-fencing-system/mepsfencing4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Friday", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Fencing", "Security", "ElectricFence", "Kenya", "CCTV", "Automation"],
        socials: {
            facebook: "https://www.facebook.com/mepsfencing/",
            whatsapp: "https://web.whatsapp.com/send?phone=254719339981"
        }
    },
    {
        id: 11,
        slug: 'universal-m-enterprise',
        title: 'Universal Multipurpose Enterprises',
        logo: '/img/logo-3.png',
        image: '/img/listings/universal-multipurpose-enterprise/universal-m-ent-grid.png',
        city: 'Kampala',
        location: 'Plot 32B Katalima Crescent, Ntinda 2 Road, Naguru Kampala Uganda',
        subCategory: 'Property Management',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.6',
        review: '(18 Reviews)',
        user: '/img/avatars/avatar-1.jpg',
        rating: 'high',
        categories: [
            { slug: 'real-estate', name: 'Real Estate', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/universal-multipurpose-enterprises/universal-banner.png',
        desc: 'Comprehensive property management and real estate services.',
        fullDescription: [
            "Universal brings excellence to the development and management of affordable housing communities across the UGANDA. With the distinct view that long-term returns matter, from development to management, the growth-oriented, high-performance culture strives to ensure each of the stakeholders of UNIVERSAL are well-served. Residents gain apartments they are proud to call home; financial and community stakeholders gain a solid partner dedicated to growth and community vitality; Universal employees experience both an engaging place to work and the motivations to contribute to growth, whether in project development, enterprise excellence or in the long-term value of properties well-developed.",
            "Universal Multipurpose Enterprise is guided by long-term value, integrity, people development, and growth. We focus on delivering affordable housing that generates lasting returns for investors, partners, and communities. Integrity is at the core of our culture, with every team member upholding professionalism that endures over time. We invest in our people challenging, recognizing, and rewarding talent to build a high-performance culture. Through efficient use of resources and a focus on results, we drive growth for our company, our employees, and the communities we serve."
        ],
        website: "https://affordablehousing.ug/",
        email: "universal.m.sales@gmail.com",
        call: "+256 757 878443",
        locations: [
            {
                branchName: "Main Office",
                address: "Plot 32B Katalima Crescent, Ntinda 2 Road, Naguru Kampala Uganda",
                phone: "+256 757 878443",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.1939728404187!2d32.6090743!3d0.3431031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbbceae4570d3%3A0x28a908d7cb30607f!2s32%20Katalima%20Rd%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1690721300000!5m2!1sen!2sug"
            }
        ],
        contentSectionTitle: "Our Projects",
        contentBlocks: [
            {
                title: "Crane Heights Mbuya",
                description: "Crane Heights Mbuya is a luxurious 9‑storey condominium project in the prestigious Mbuya neighbourhood of Kampala, Uganda.",
                image: "/img/listings/universal-multipurpose-enterprises/ume-1.png"
            },
            {
                title: "Stork Elegance",
                description: "Stork Elegance in Ntinda, near Kampala, offers 1-3 bedroom apartments with modern finishes, maid rooms, and flexible payment plans priced from UGX 172M to 342M.",
                image: "/img/listings/universal-multipurpose-enterprises/ume-2.png"
            },
            {
                title: "Ruby Courts",
                description: "Ruby Courts in Kajjansi offers modern 1-3 bedroom apartments with quality finishes, blending contemporary living with the tranquility of a well-connected suburb near Kampala.",
                image: "/img/listings/universal-multipurpose-enterprises/ume-3.png"
            },
            {
                title: "Flamingo Estates",
                description: "Flamingo Estates Najeera offers 2-bedroom condos (~95 sqm) near Najeera Police Station with top amenities, priced from UGX 225M.",
                image: "/img/listings/universal-multipurpose-enterprises/ume-4.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Tuesday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Wednesday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Thursday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Friday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Home", "Residence", "Real estate", "Fancyhouse"],
        socials: {
            facebook: "https://www.facebook.com/affordablehousinguganda/",
            instagram: "https://www.instagram.com/affordablehousinguganda/",
            whatsapp: "https://api.whatsapp.com/send/?phone=256752225352"
        }
    },
    {
        id: 12,
        slug: 'fakhruddin-properties',
        title: 'Fakhruddin Properties',
        logo: '/img/logo-3.png',
        image: '/img/listings/fakhruddin-properties/fakhruddin-grid.png',
        city: 'Dubai',
        location: 'HC Floor, Lake Central Tower Al Marasi Drive, Business Bay, Dubai, UAE',
        subCategory: 'International Properties',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.9',
        review: '(45 Reviews)',
        user: '/img/avatars/avatar-2.jpg',
        rating: 'high',
        categories: [
            { slug: 'real-estate', name: 'Real Estate', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/fakhruddin-properties/fakhruddin-banner.png',
        desc: 'International property developer with a focus on luxury residential projects.',
        fullDescription: [
            "What began in 2003 as a vision to redefine real estate has grown into one of the Middle East’s most forward-thinking property developers. Fakhruddin Properties was born from the legacy of Fakhruddin Holdings a business established in 1963 with deep roots in entrepreneurship, community upliftment, and cross-border impact. Guided by this foundation, we set out to build more than structures we set out to build trust. From our earliest developments, we believed that homes should support well-being, reflect purpose, and contribute to the environments they occupy. That belief became our blueprint.",
            "Our strength lies in our diversity not just of people, but of perspectives. At Fakhruddin Properties, architects, engineers, designers, technologists, and sustainability experts come together to shape living environments that are as intelligent as they are inspiring. From urban planning to energy systems, from wellness integration to aesthetic detailing, our team works across disciplines to create spaces that are balanced, beautiful, and future-ready. It’s this convergence of minds that allows us to craft places with lasting identity rooted in purpose, built for people."
        ],
        website: "https://www.fakhruddinproperties.com/",
        email: "info@fakhruddinproperties.com",
        call: "+9718005253",
        locations: [
            {
                branchName: "Head Office",
                address: "HC Floor, Lake Central Tower Al Marasi Drive, Business Bay P.O. Box. 191327 Dubai, United Arab Emirates",
                phone: "+971 800 5253",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.1818016511153!2d55.2629817!3d25.1853266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682d7a2fffff%3A0x92667dd89b5b3376!2sFakhruddin%20Properties%20Development!5e0!3m2!1sen!2sae!4v1722784823113!5m2!1sen!2sae"
            }
        ],
        contentSectionTitle: "Our Projects",
        contentBlocks: [
            {
                title: "Treppan Tower",
                description: "Every residence at Treppan Tower is fully furnished with carefully curated pieces, blending sculptural lighting, bespoke cabinetry, and rich textures.",
                image: "/img/listings/fakhruddin-properties/fakhruddin-1.png"
            },
            {
                title: "Hatimi Residences",
                description: "Hatimi Residences features refined interiors inspired by organic forms and the building’s fluid architecture.",
                image: "/img/listings/fakhruddin-properties/fakhruddin-3.png"
            },
            {
                title: "Maimoon Gardens",
                description: "Maimoon Gardens offers sustainable urban living through modern design, smart layouts, and nature-inspired, energy-efficient spaces.",
                image: "/img/listings/fakhruddin-properties/fakhruddin-2.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Friday", "hours": "8:00 AM - 8:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Home", "Residence", "Real estate", "Fancyhouse"],
        socials: {
            instagram: "https://www.instagram.com/fakhruddin.properties/",
            youtube: "https://www.youtube.com/channel/UCyCQdlRdu-s3RQRkfnW0NJg",
            whatsapp: "https://api.whatsapp.com/send/?phone=9718005253"
        }
    },
    {
        id: 13,
        slug: 'ema-advisory',
        title: 'EMA Advisory',
        logo: '/img/logo-3.png',
        image: '/img/listings/ema-advisory/ema-grid.jpg',
        city: 'Nairobi',
        location: 'Kings Prism Towers, Upperhill, Nairobi, Kenya',
        subCategory: 'Financial Advisory',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.8',
        review: '(16 Reviews)',
        user: '/img/avatars/avatar-3.jpg',
        rating: 'high',
        categories: [
            { slug: 'services', name: 'Services', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/ema-advisory/ema-banner.jpg',
        desc: 'Expert financial advisory and consultancy services for businesses.',
        fullDescription: [
            "EMA Advisory LLP and EMA BIKO Advisory Ltd bring together a wealth of experience and expertise to provide comprehensive accounting, audit, tax, and business advisory services across Kenya and Rwanda. With over 25 years of combined partner experience, our firms are committed to helping businesses and organizations navigate their financial and operational challenges.",
            "We pride ourselves on building strong relationships with our clients, understanding their unique needs, and delivering personal, proactive, and results-oriented solutions. Our team of skilled professionals leverages advanced technology and in-depth sector knowledge to provide a wide range of services to a diverse clientele, including SMEs, NGOs, and closely held companies."
        ],
        website: "https://www.ema-advisory.com/",
        email: "info@ema-advisory.com",
        call: "+254718920912",
        locations: [
            {
                branchName: "Kenya Office",
                address: "Kings Prism Towers, 3rd Ngong Avenue, Upperhill, Nairobi",
                phone: "+254 718 920 912",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16338131.247433687!2d17.297973632812518!3d-1.2935302390231982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10c22d31fe77%3A0x2bacfebfb26aa339!2sThird%20Ngong%20Ave%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2sin!4v1754659297794!5m2!1sen!2sin"
            },
            {
                branchName: "Rwanda Office",
                address: "Makuza Peace Plaza, Kigali, Rwanda",
                phone: "+250 738 828 020",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d65078552.634349465!2d2.687397181703091!3d5.404840734776175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6837c3da637%3A0xe92055a959942ca6!2sKN%2048%20St%2C%20Kigali%2C%20Rwanda!5e0!3m2!1sen!2sin!4v1754659335709!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Services",
        contentBlocks: [
            {
                title: "Audit & Assurance",
                description: "Statutory audits, forensic audits, and project audits that meet the highest standards of independence and excellence.",
                image: "/img/listings/ema-advisory/ema1.jpg"
            },
            {
                title: "Taxation Services",
                description: "Aligning your tax strategy with your business goals, including corporate tax, VAT audits, and compliance checks.",
                image: "/img/listings/ema-advisory/ema2.jpg"
            },
            {
                title: "Outsourced Services",
                description: "Expert outsourced services including accounting, payroll, and internal audits to let you focus on your core functions.",
                image: "/img/listings/ema-advisory/ema3.jpg"
            },
            {
                title: "Advisory Services",
                description: "Multi-sector expertise in strategy, risk management, financial due diligence, and corporate restructuring.",
                image: "/img/listings/ema-advisory/ema4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "9:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "CLOSED" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Audit", "Advisory", "Tax", "Kenya", "Finance", "Rwanda"],
        socials: {
            facebook: "https://www.facebook.com/profile.php?id=61559394990213",
            instagram: "https://www.instagram.com/ema_advisory/",
            linkedin: "https://www.linkedin.com/in/ema-advisory-llp-4bbb12302/"
        }
    },
    {
        id: 14,
        slug: 'alfazal-saifiyah-ltd',
        title: 'Al-Fazal Saifiyah Limited',
        logo: '/img/logo-3.png',
        image: '/img/listings/al-fazal-saifiyah-ltd/alfazal-grid.jpg',
        city: 'Mombasa',
        location: 'EPIC BUSINESS PARK, LINKS RD - NYALI, MOMBASA',
        subCategory: 'General Trading',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.0',
        review: '(9 Reviews)',
        user: '/img/avatars/avatar-4.jpg',
        rating: 'mid',
        categories: [
            { slug: 'services', name: 'Services', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/al-fazal-saifiyah-ltd/alfazal-banner.jpg',
        desc: 'A Venture Capitalist Company in Kenya, created to cater to the East African market.',
        fullDescription: [
            "Al-Fazal Saifiyah Limited is a Venture Capitalist Company in Kenya, created to cater to the East African market of Kenya, Tanzania, Uganda, Zambia and Rwanda. At Al-Fazal, we provide capital to companies with high growth potential in exchange for an equity stake.",
            "Our team consists of a robust combination of sound businessmen, professionals, and analysts with wide-ranging experience in the East African market. At Al Fazal, we go beyond capital injection. We bring to the table an invaluable combination of strategic guidance, operational expertise, and an extensive network of industry connections to foster sustainable success."
        ],
        website: "https://www.alfazal.co.ke/",
        email: "info@alfazal.co.ke",
        call: "+254722415110",
        locations: [
            {
                branchName: "Mombasa Office",
                address: "EPIC BUSINESS PARK, LINKS RD - NYALI, MOMBASA",
                contactPerson: "Mustaq Bhai Dar",
                phone: "+254 722 415110",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31838.80884042341!2d39.689858!3d-4.050778!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1840126869fa97c5%3A0x704251da9ce32ba2!2sEpic%20Business%20Park!5e0!3m2!1sen!2ske!4v1754717506843!5m2!1sen!2ske"
            },
            {
                branchName: "Nairobi Office",
                address: "Nairobi, Kenya",
                contactPerson: "Shk Aliasger Dawoodbhai",
                phone: "+254 722 410465"
            }
        ],
        contentSectionTitle: "Our Services",
        contentBlocks: [
            {
                title: "Venture Capital",
                description: "Providing crucial capital to companies with high growth potential in exchange for an equity stake.",
                image: "/img/listings/al-fazal-saifiyah-ltd/alfazal1.jpg"
            },
            {
                title: "Strategic Guidance",
                description: "We bring invaluable strategic guidance and operational expertise to nurture the growth of our portfolio companies.",
                image: "/img/listings/al-fazal-saifiyah-ltd/alfazal2.jpg"
            },
            {
                title: "Network Access",
                description: "Leverage our extensive network of industry connections to foster sustainable success and open new opportunities.",
                image: "/img/listings/al-fazal-saifiyah-ltd/alfazal3.jpg"
            },
            {
                title: "Shariah Compliant Investing",
                description: "Specializing in Shariah and Government compliant investments, focusing on equity injection and shared growth.",
                image: "/img/listings/al-fazal-saifiyah-ltd/alfazal4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "9:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "CLOSED" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["VentureCapital", "Investment", "Finance", "Kenya", "EastAfrica", "Advisory"],

    },
    {
        id: 15,
        slug: 'african-quest-safaris',
        title: 'African Quest Safaris',
        logo: '/img/logo-3.png',
        image: '/img/listings/african-quest-safaris/africaquest-grid.jpg',
        city: 'Mombasa',
        location: 'Petrocity Mall, Links Road Nyali, Mombasa, Kenya',
        subCategory: 'Tours & Travel',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.9',
        review: '(42 Reviews)',
        user: '/img/avatars/avatar-5.jpg',
        rating: 'high',
        categories: [
            { slug: 'services', name: 'Services', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/african-quest-safaris/africaquest-banner.jpg',
        desc: 'Bespoke safari packages and travel services across East Africa.',
        fullDescription: [
            "Proudly into our 3rd decade, we are all about handcrafted experiences that become lifelong memories. Sister and brother, Tasneem and Taher, are fifth generation Kenyans who have spent our entire careers in African Tourism. Highly educated, we have built one of Kenya’s top ground tour companies.",
            "Backed by a team of 54 well trained professionals, the strength of AQS is our deep belief in Handcrafted experiences that require incredible attention to detail resulting in maximum satisfaction."
        ],
        website: "https://africanquestsafaris.com/",
        email: "info@africanquest.co.ke",
        call: "+254723114911",
        locations: [
            {
                branchName: "Head Office (Mombasa)",
                address: "Petrocity Mall, Links Road Nyali",
                phone: "+254 723 114 911",
            },
            {
                branchName: "Nairobi Office",
                address: "AQS House, Off Mombasa Road",
                phone: "+254 704 154 227",
                email: "aqsnbo@africanquest.co.ke"
            },
            {
                branchName: "Tanzania Office",
                address: "492 Kalenga Drive, Dar-es-Salaam",
                phone: "+255 784 389 877",
                email: "aqstz@africanquest.co.ke"
            }
        ],
        contentSectionTitle: "Our Experiences",
        contentBlocks: [
            {
                title: "Kenya Safaris",
                description: "Explore the iconic Maasai Mara, Amboseli, and more with our expertly guided tours in the heart of safari country.",
                image: "/img/listings/african-quest-safaris/africaquest1.jpg"
            },
            {
                title: "Tanzania Safaris",
                description: "Witness the Great Migration in the Serengeti or explore the Ngorongoro Crater on an unforgettable Tanzanian adventure.",
                image: "/img/listings/african-quest-safaris/africaquest2.jpg"
            },
            {
                title: "Uganda & Rwanda Tours",
                description: "Embark on a primate tracking adventure to see gorillas and chimpanzees in the lush forests of Uganda and Rwanda.",
                image: "/img/listings/african-quest-safaris/africaquest3.jpg"
            },
            {
                title: "Day Tours & Excursions",
                description: "Short on time? Discover the best of East Africa's cities and nearby attractions with our curated day trips.",
                image: "/img/listings/african-quest-safaris/africaquest4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Safaris", "Travel", "Kenya", "Tanzania", "Tours", "Africa"],
        socials: {
            facebook: "https://www.facebook.com/africanquestsafaris/",
            instagram: "https://www.instagram.com/africanquestsafaris/",
            twitter: "https://x.com/africanquest",
            youtube: "https://www.youtube.com/user/AQSkenya",
            whatsapp: "https://api.whatsapp.com/send/?phone=254723114911"
        }
    },
    {
        id: 16,
        slug: 'principal-forwarders-ltd',
        title: 'Principal Forwarders Ltd',
        logo: '/img/logo-3.png',
        image: '/img/listings/principal-forwarders-ltd/principal-grid.jpg',
        city: 'Mombasa',
        location: 'Crisp Road, Ganjoni, Mombasa, Kenya',
        subCategory: 'Logistics',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.7',
        review: '(21 Reviews)',
        user: '/img/avatars/avatar-1.jpg',
        rating: 'high',
        categories: [
            { slug: 'services', name: 'Services', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/principal-forwarders-ltd/principal-banner.jpg',
        desc: 'Reliable clearing, forwarding, and logistics solutions.',
        fullDescription: [
            "Welcome to Principal Forwarders Ltd. We provide the most efficient and hassle free clearing and forwarding service in the country, which is done through highly professional, qualified and experienced staff. Our office also employs the latest in technology and communications facilities to enable imports and exports to be handled professionally from documentation to release.",
            "Our facilities also enable documents to be tracked at any point in time, with expected arrival dates of the cargo and expected clearance date of the cargo being informed to the client at all times. The aim of this site is to provide you information about our reliable services and allow you to make an informed decision about engaging our services."
        ],
        website: "https://www.principal.co.ke/",
        email: "ganiwalla@principal.co.ke",
        call: "+254412228448",
        locations: [
            {
                branchName: "Main Office",
                address: "Crisp Road, Ganjoni (Off Moi Avenue), Mombasa, Kenya",
                phone: "+254 (41) 2228448 / 2223482",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15919.192027445832!2d39.668204!3d-4.061558!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1840132b9ca2a1a5%3A0x698d5e5f37f26ee7!2sPrincipal%20Forwarders!5e0!3m2!1sen!2suk!4v1754733530996!5m2!1sen!2suk"
            }
        ],
        contentSectionTitle: "Our Services",
        contentBlocks: [
            {
                title: "Sea Imports",
                description: "Facilitating clearance of all import consignments from Mombasa Port, including containerized, bulk, and project cargo.",
                image: "/img/listings/principal-forwarders-ltd/principal1.jpg"
            },
            {
                title: "Sea Exports",
                description: "Efficient clearing and forwarding services for all export consignments from Mombasa Port for all cargo types.",
                image: "/img/listings/principal-forwarders-ltd/principal2.jpg"
            },
            {
                title: "Air Freight",
                description: "Handling all export and import air freight to and from Mombasa International Airport, including loose and bulk cargo.",
                image: "/img/listings/principal-forwarders-ltd/principal3.jpg"
            },
            {
                title: "Automobile Imports",
                description: "Specialized clearing and forwarding services for all types of automobiles imported through Mombasa Port.",
                image: "/img/listings/principal-forwarders-ltd/principal4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Clearing", "Forwarding", "Logistics", "Mombasa", "Imports", "Kenya"],

    },
    {
        id: 17,
        slug: 'zafs-tours',
        title: 'ZAFS Tours',
        logo: '/img/logo-3.png',
        image: '/img/listings/zafs-tours/zafs-grid.jpg',
        city: 'Moshi',
        location: 'Moshi, Tanzania',
        subCategory: 'Tours & Travel',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.9',
        review: '(50+ Reviews)',
        user: '/img/avatars/avatar-2.jpg',
        rating: 'high',
        categories: [
            { slug: 'services', name: 'Services', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/zafs-tours/zafs-banner.jpg',
        desc: 'Family-owned Tanzanian tour operator specializing in handcrafted safaris, Kilimanjaro trekking, and Zanzibar holidays.',
        fullDescription: [
            "ZAFS is a family-owned business where the directors are born and raised at the foothills of Mt. Kilimanjaro in Moshi. Being avid travellers themselves makes this is a company showcasing travel curated by travellers.",
            "We believe that our ambition to present tourism in Africa in a renewed light is what makes us innovators in the industry. We strive to deliver value for money, aligning our goals with the satisfaction of our customers, while ensuring that our love for travel is displayed through the quality of our service."
        ],
        website: "https://zafstours.com/",
        email: "info@zafstours.com",
        call: "+255624023455",
        locations: [
            {
                branchName: "Main Office",
                address: "Moshi, Tanzania",
                phone: "+255 624 023 455"
            }
        ],
        contentSectionTitle: "Our Experiences",
        contentBlocks: [
            {
                title: "Wildlife Safari",
                description: "Witness the animal kingdom in their true habitat from the air in hot air balloons or in 4×4 vehicles on road during game drives.",
                image: "/img/listings/zafs-tours/zafs1.jpg"
            },
            {
                title: "Kilimanjaro Trekking",
                description: "Let us take you to the top one of the seven summits and Africa’s highest peak, all whilst creating a once in a lifetime adventure.",
                image: "/img/listings/zafs-tours/zafs2.jpg"
            },
            {
                title: "Zanzibar Island",
                description: "Experience the tropical paradise, where pristine beaches, azure waters, and a rich cultural heritage await your exploration.",
                image: "/img/listings/zafs-tours/zafs3.jpg"
            },
            {
                title: "Tanzanian Experiences",
                description: "In a country full of culture, history and lifestyle, don’t miss out on the hidden gems and experiences it has to offer.",
                image: "/img/listings/zafs-tours/zafs4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Saturday", "hours": "9:00 AM - 6:00 PM" },
            { "day": "Sunday", "hours": "By Appointment" }
        ],
        tags: ["Safari", "Travel", "Kilimanjaro", "Tanzania", "Zanzibar", "Tours"],
        socials: {
            instagram: "https://www.instagram.com/zafstours",
            whatsapp: "https://wa.me/+255620285462"
        }
    },
    {
        id: 18,
        slug: 'shabbiri-hardware',
        title: 'Shabbiri Hardware',
        logo: '/img/logo-3.png',
        image: '/img/listings/shabbiri-hardware/shabbiri-grid.png',
        city: 'Nairobi',
        location: 'Magadi Road, Ongata Rongai, Nairobi',
        subCategory: 'Hardware Store',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.5',
        review: '(14 Reviews)',
        user: '/img/avatars/avatar-3.jpg',
        rating: 'high',
        categories: [
            { slug: 'shops-and-suppliers', name: 'Shops & Suppliers', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/shabbiri-hardware/shabbiri-banner.png',
        desc: 'A leading supplier of quality hardware, tools, and building materials.',
        fullDescription: [
            "Shabbiri Hardware is a premier supplier of a wide array of hardware and construction materials in Nairobi, Kenya. They are committed to providing quality craftsmanship and reliable products for all building and renovation needs.",
            "Their extensive inventory includes everything from general hardware, power tools, and hand tools to sanitaryware, flooring solutions, and plumbing accessories. Shabbiri Hardware also offers a selection of paints and exterior wall panels, making them a comprehensive one-stop-shop for contractors, developers, and homeowners alike."
        ],
        website: "https://www.shabbirihardware.com/",
        email: "info@shabbirihardware.com",
        call: "+254741042484",
        locations: [
            {
                branchName: "Main Branch",
                address: "Magadi Road, Ongata Rongai, Nairobi",
                phone: "+254 741 042484",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.39136638112!2d36.768922!3d-1.389549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f05b7a54e029b%3A0x106e2854c30bc7d2!2sShabbiri%20Hardware%20Kenya%20Ltd!5e0!3m2!1sen!2ske!4v1690812800000!5m2!1sen!2ske"
            }
        ],
        contentSectionTitle: "Our Products",
        contentBlocks: [
            {
                title: "Power & Hand Tools",
                description: "A comprehensive range of high-quality power and hand tools for both professional and DIY projects.",
                image: "/img/listings/shabbiri-hardware/shabbiri-power-tools.png"
            },
            {
                title: "Sanitaryware",
                description: "Modern and durable sanitaryware, including fittings and accessories for stylish bathrooms and kitchens.",
                image: "/img/listings/shabbiri-hardware/shabbiri-1.png"
            },
            {
                title: "Flooring Solutions",
                description: "A variety of high-quality flooring options to suit any residential or commercial space with style and durability.",
                image: "/img/listings/shabbiri-hardware/shabbiri-flooring.png"
            },
            {
                title: "Exterior Wall Panels",
                description: "Weather-resistant and aesthetically pleasing exterior wall panels to enhance building facades.",
                image: "/img/listings/shabbiri-hardware/shabbiri-wall.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Hardware", "Tools", "Construction", "Nairobi", "Sanitaryware", "Flooring"],
        socials: {
            facebook: "https://www.facebook.com/Shabbirihardwarekenyalimited/",
            instagram: "https://www.instagram.com/shabbirihardware/",
            whatsapp: "https://api.whatsapp.com/send/?phone=%2B254745554008"
        }
    },
    {
        id: 19,
        slug: 'brain-touch',
        title: 'Braintouch LLC',
        logo: '/img/logo-3.png',
        image: '/img/listings/brain-touch-llp/brain-touch-grid.png',
        city: 'Nairobi',
        location: 'Off No 802, Chambers Heights, Chambers Road, Near Chandarma Supermarket, Ngara, Nairobi, Kenya',
        subCategory: 'IT & Electronics',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.8',
        review: '(25 Reviews)',
        user: '/img/avatars/avatar-4.jpg',
        rating: 'high',
        categories: [
            { slug: 'shops-and-suppliers', name: 'Shops & Suppliers', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/brain-touch-llp/braintouch-banner.png',
        desc: 'Your trusted partner for IT equipment and electronic components.',
        fullDescription: [
            "Braintouch LLC is a leading technology provider based in Nairobi, Kenya, specializing in the sale and distribution of premium computing and gaming products. We deal in a wide range of devices, including Apple MacBooks, all major laptop brands, desktop PCs, high-performance gaming PCs, PlayStation consoles, Xbox systems, and more.",
            "Our mission is to deliver top-quality products backed by exceptional customer service and reliable after-sales support. Whether you're a professional, student, gamer, or business owner, Braintouch LLC is your trusted source for authentic tech gadgets and computing solutions."
        ],
        website: "https://braintouchllc.com/",
        email: "info@braintouchllc.com",
        call: "+254796788090",
        locations: [
            {
                branchName: "Main Office",
                address: "Off No 802, Chambers Heights, Chambers Road, Near Chandarma Supermarket, Ngara, Nairobi, Kenya",
                phone: "+254 796 788090",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.9366555032!2d36.8172215!3d-1.2748542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1712bbe83af5%3A0x7f85f536de011715!2sChambers%20heights%20apartments!5e0!3m2!1sen!2ske!4v1690813200000!5m2!1sen!2ske"
            }
        ],
        contentSectionTitle: "Our Products",
        contentBlocks: [
            {
                title: "Apple Laptops",
                description: "Shop the best Apple laptops in Kenya at Brain Touch LLC. Get genuine MacBooks at great prices with warranty and fast delivery.",
                image: "/img/listings/brain-touch-llp/brain-touch-apple.png"
            },
            {
                title: "Laptop Sleeves",
                description: "Protect your laptop in style with premium sleeves from Brain Touch LLC. Sleek, durable, and perfect for everyday use.",
                image: "/img/listings/brain-touch-llp/brain-touch-laptop-sleeves.png"
            },
            {
                title: "Chargers & Adapters",
                description: "Find reliable chargers and adapters at Brain Touch LLC. Fast, safe, and compatible with all major devices.",
                image: "/img/listings/brain-touch-llp/brain-touch-chargers.png"
            },
            {
                title: "Screen Guards",
                description: "Keep your screens scratch-free with high-quality screen guards from Brain Touch LLC. Perfect fit for mobiles and laptops with crystal-clear protection.",
                image: "/img/listings/brain-touch-llp/brain-touch-screen-guard.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "8:00 AM - 1:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: [],

    },
    {
        id: 20,
        slug: 'hakimi-traders',
        title: 'Hakimi Traders L.L.C.',
        logo: '/img/logo-3.png',
        image: '/img/listings/hakimi-traders/hakimi-traders-grid.jpg',
        city: 'Sharjah',
        location: 'Al Gharb Al Ghuwair - Sharjah, United Arab Emirates',
        subCategory: 'General Traders',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.7',
        review: '(30 Reviews)',
        user: '/img/avatars/avatar-5.jpg',
        rating: 'high',
        categories: [
            { slug: 'shops-and-suppliers', name: 'Shops & Suppliers', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/hakimi-traders/hakimi-banner.png',
        desc: 'International traders specializing in a wide range of consumer goods.',
        fullDescription: [
            "Hakimi Traders L.L.C., founded in 1977 in Sharjah, UAE, is a long-standing wholesale supplier specializing in hardware tools, fasteners, ropes, nylon fishers, chains, clamps, hinges, and general industrial fittings.",
            "With over 40 years of experience, the company supplies to customers across the GCC and parts of India, offering products from well-known brands alongside in-house services tailored for industrial and construction needs."
        ],
        website: "https://www.hakimitr.com/",
        email: "hakimitradersdxb@gmail.com",
        call: "+971561889901",
        locations: [
            {
                branchName: "Main Office",
                address: "Al Gharb Al Ghuwair - Sharjah, United Arab Emirates",
                phone: "+971 56 188 9901",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28842.701645555306!2d55.390797!3d25.359996!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5be9941b538f%3A0xdd8fe0dc9ed8a89!2sHakimi%20traders%20llc!5e0!3m2!1sen!2sin!4v1754550706010!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Product Categories",
        contentBlocks: [
            {
                title: "Hardware Tools",
                description: "We offer a comprehensive selection of professional-grade power tools and hand tools for construction and industrial applications.",
                image: "/img/listings/hakimi-traders/hakimi-traders-1.png"
            },
            {
                title: "Fasteners & Fixings",
                description: "Explore our vast inventory of bolts, nuts, screws, and anchors, available in various sizes and materials to meet your project's needs.",
                image: "/img/listings/hakimi-traders/hakimi-2.png"
            },
            {
                title: "Ropes, Chains & Fittings",
                description: "From heavy-duty lifting chains to durable ropes and fittings, we supply reliable solutions for marine, construction, and industrial use.",
                image: "/img/listings/hakimi-traders/hakimi-3.png"
            },
            {
                title: "Hinges, Brackets & Hardware",
                description: "Discover our range of high-quality hinges, clamps, and general hardware, ensuring durability and performance for any application.",
                image: "/img/listings/hakimi-traders/hakimi-4.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Thu & Sat", "hours": "8:00 AM - 6:00 PM" },
            { "day": "Friday", "hours": "8:00 AM - 12:00 PM, 2:00 PM - 6:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Hardware", "Sharjah", "IndustrialSupplies", "Fasteners", "Wholesale", "UAESupplier"],
        socials: {
            facebook: "https://www.facebook.com/hakimi.traders.7",
            instagram: "https://www.instagram.com/hakimitradingllc/",
            whatsapp: "https://api.whatsapp.com/send?phone=971561889901"
        }
    },
    {
        id: 21,
        slug: 'asp-solar-and-electronix',
        title: 'ASP Solar & Electronix',
        logo: '/img/logo-3.png',
        image: '/img/listings/asp-solar-and-electronix/asp-grid.png',
        city: 'Dar Es Salaam',
        location: 'Kariakoo, Omari Londo Na Sikukuu Street, Block 20, Dar es Salaam, Tanzania',
        subCategory: 'Solar & Electronics',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.6',
        review: '(18 Reviews)',
        user: '/img/avatars/avatar-1.jpg',
        rating: 'high',
        categories: [
            { slug: 'shops-and-suppliers', name: 'Shops & Suppliers', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/asp-solar-and-electronix/asp-solar-electrnix.png',
        desc: 'Providers of solar power solutions and various electronic goods.',
        fullDescription: [
            "ASP is a leading supplier of energy and electronic solutions in Dar es Salaam, Tanzania. We are dedicated to providing high-quality, reliable products for residential, commercial, and industrial needs.",
            "Our extensive inventory covers a wide range of categories. In Solar Products, we offer everything from solar panels, inverters, and batteries to complete solar lighting and water heating systems. For Electrical Supplies, we stock cables, switches, circuit breakers, and more. Our Electronics department features a variety of consumer goods to enhance your lifestyle. Trust ASP for quality products and expert service."
        ],
        website: "https://asp.co.tz/",
        email: "sales@asp.co.tz",
        call: "+255785875830",
        locations: [
            {
                branchName: "Main Store",
                address: "Kariakoo, Omari Londo Na Sikukuu Street , Block Number 20. 3786 Dar es Salaam, Tanzania",
                phone: "+255 785 875 830",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1677317407494!2d39.2780996!3d-6.8234083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4bc297b92f37%3A0x80fea9c2789fdab0!2sASP%20SOLAR%20%26%20ELECTRONIX!5e0!3m2!1sen!2stz!4v1690813500000!5m2!1sen!2stz"
            }
        ],
        contentSectionTitle: "Our Products",
        contentBlocks: [
            {
                title: "Glue Guns",
                description: "Asp Solar and Electronics has the glue guns and hot melt glue sticks you need for all your crafting and repair projects.",
                image: "/img/listings/asp-solar-and-electronix/asp-gluegun.png"
            },
            {
                title: "Solar Panels",
                description: "Generate clean energy with high-efficiency solar panels from Asp Solar and Electronics. Our durable solar solutions are perfect for homes and businesses.",
                image: "/img/listings/asp-solar-and-electronix/asp-solar-panel.png"
            },
            {
                title: "Computers & Electronics Items",
                description: "Explore quality electronic items and tools at Asp Solar and Electronics. Find everything from multimeters and soldering irons to adapters and cables for your projects.",
                image: "/img/listings/asp-solar-and-electronix/asp-comp-accessories.png"
            },
            {
                title: "CCTV Products",
                description: "Secure your property with CCTV products from Asp Solar and Electronics. We offer a comprehensive range of CCTV cameras, DVRs, and accessories for reliable surveillance.",
                image: "/img/listings/asp-solar-and-electronix/asp-cctv.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "8:30 AM - 5:30 PM" },
            { "day": "Saturday", "hours": "8:30 AM - 2:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Solar", "Electronics", "Electrical", "Tanzania", "DarEsSalaam", "Kariakoo"],
        socials: {
            whatsapp: "https://api.whatsapp.com/send/?phone=255785875830"
        }
    },
    {
        id: 22,
        slug: 'nafees-creation',
        title: 'Nafees Creation',
        logo: '/img/logo-3.png',
        image: '/img/listings/nafees-creation/nafees-creation-grid.jpg',
        city: 'Karachi',
        location: 'Shop#6, Qasre Burhani, near Shabbir Square, Shabbirabad Block B, Karachi, Pakistan',
        subCategory: 'Fashion & Apparel',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.8',
        review: '(21 Reviews)',
        user: '/img/avatars/avatar-2.jpg',
        rating: 'high',
        categories: [
            { slug: 'shops-and-suppliers', name: 'Shops & Suppliers', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/nafees-creation/nafees-creation-banner.jpg',
        desc: 'Exquisite and creative fashion designs and apparel.',
        fullDescription: [
            "Welcome to Nafees Creation! I’m Fatima Kanchwala, mother of three and the founder of Nafees Creation. What began as a teenage passion project has blossomed into a vibrant clothing brand that I’m proud to share with you today.",
            "For the past 20 years, we’ve been dedicated to creating unique, stylish pieces that resonate with fashion enthusiasts and clothing lovers alike. At Nafees Creation, we believe that everyone deserves to express their individuality through clothing. Our collection reflects diverse styles, ensuring there’s something special for everyone. Quality and customer satisfaction are our top priorities, as we strive to exceed your expectations with every purchase. Thank you for being part of our journey—let’s celebrate creativity and self-expression together!"
        ],
        website: "https://nafeescreation.com/",
        email: "info@nafeescreation.com",
        call: "+923343397552",
        locations: [
            {
                branchName: "Main Shop",
                address: "Shop#6, Qasre Burhani, near Shabbir Square, Shabbirabad Block B, Karachi, Pakistan",
                phone: "+92 334 3397552",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57899.205189834734!2d67.01920963787998!3d24.90820164160164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f001bdfd1e1%3A0xc2455b1346424e08!2sNafees%20Creation%20(boutique)!5e0!3m2!1sen!2sin!4v1754458959147!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Collection",
        contentBlocks: [
            {
                title: "Ridas",
                description: "Elegant and beautifully crafted Ridas, blending traditional designs with contemporary styles for every occasion.",
                image: "/img/listings/nafees-creation/nafeescreation1.jpg"
            },
            {
                title: "Masallahs",
                description: "Exquisite Masallahs featuring intricate designs and quality materials, perfect for prayer and devotion.",
                image: "/img/listings/nafees-creation/nafeescreation3.jpg"
            },
            {
                title: "Joris",
                description: "A stylish collection of Joris, offering a perfect match for traditional attire with comfort and elegance.",
                image: "/img/listings/nafees-creation/nafeescreation2.jpg"
            },
            {
                title: "Bridals",
                description: "Stunning and exclusive bridal wear designed to make your special day unforgettable with timeless beauty.",
                image: "/img/listings/nafees-creation/nafeescreation4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Sat", "hours": "10:00 AM - 9:00 PM" },
            { "day": "Sunday", "hours": "Closed" }
        ],
        tags: ["WomensFashion", "Karachi", "StylishWear", "Fashion", "NafeesCreation", "Boutique"],
        socials: {
            instagram: "https://www.instagram.com/nafeescreationn/",
            whatsapp: "https://api.whatsapp.com/send/?phone=923343397552"
        }
    },
    {
        id: 23,
        slug: 'mishkaat',
        title: 'MISHKAAT®',
        logo: '/img/logo-3.png',
        image: '/img/listings/mishkaat/mishkaat-grid.png',
        city: 'Surat',
        location: 'Bazar Khadi Rd, Zampa Bazaar, Begampura, Surat, Gujarat',
        subCategory: 'Gifts & Decor',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.9',
        review: '(35 Reviews)',
        user: '/img/avatars/avatar-3.jpg',
        rating: 'high',
        categories: [
            { slug: 'shops-and-suppliers', name: 'Shops & Suppliers', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/mishkaat/mishkaat-banner.png',
        desc: 'A unique collection of gifts, decor, and artisanal items.',
        fullDescription: [
            "Welcome to MISHKAAT®, your premier destination for men's and kid's traditional wear in Surat. We specialize in an exclusive collection that blends tradition with a touch of elegance.",
            "Discover our signature Saya Kurta line, Namazi Pehrans, and Ridas, perfect for religious occasions like Shehre Ramadan. Elevate your special events with our exquisite embroidered Saya Kurtas, ideal for Nikah, Wedding Ceremonies, and Milad. At MISHKAAT®, we provide high-quality attire for every significant moment."
        ],
        website: "https://mishkaat.store/",
        email: "info@mishkaat.store",
        call: "+917383552552",
        locations: [
            {
                branchName: "Main Store",
                address: "Bazar Khadi Rd, opp. Zaini Masjid, Zampa Bazaar, Begampura, Surat, Gujarat 395002",
                phone: "+91 73835 52552",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.2795077518916!2d72.8330519!3d21.193527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f7ca65d2c3b%3A0x13d7a6955454dfd3!2sMishkaat!5e0!3m2!1sen!2sin!4v1690813900000!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Collection",
        contentBlocks: [
            {
                title: "Exclusive Kurtas",
                description: "Explore exclusive designer kurtas by Mishqaat, blending timeless elegance with modern style. Perfect for festive, formal, and everyday wear.",
                image: "/img/listings/mishkaat/mishkaat-trendy-kurta.png"
            },
            {
                title: "Funky Kids Kurta",
                description: "Brighten up your child's wardrobe with funky kids' kurtas by Mishqaat! Fun prints, vibrant colors, and comfy fits perfect for every little trendsetter.",
                image: "/img/listings/mishkaat/mishkaat-kids-kurta.png"
            },
            {
                title: "Wedding Kurtas",
                description: "Make a statement with elegant wedding kurtas by Mishqaat, crafted with rich fabrics, intricate detailing, and timeless designs perfect for grooms and wedding guests alike.",
                image: "/img/listings/mishkaat/mishkaat-wedding-kurta.png"
            },
            {
                title: "Mens Pehran",
                description: "A brief description of the product goes here, explaining its purpose and features.",
                image: "/img/listings/mishkaat/mishkaat-pehran.png"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Sat", "hours": "10:00 AM - 9:00 PM" },
            { "day": "Sunday", "hours": "10:00 AM - 1:00 PM" }
        ],
        tags: ["MensWear", "KidsWear", "Kurta", "Surat", "TraditionalWear", "Ridas"],
        socials: {
            facebook: "https://www.facebook.com/mishkaat52",
            instagram: "https://www.instagram.com/mishkaat52/"
        }
    },
    {
        id: 24,
        slug: 'beem',
        title: 'Beem Africa',
        logo: '/img/logo-3.png',
        image: '/img/listings/beem-africa/beem-grid.jpg',
        city: 'Dar Es Salaam',
        location: 'Dar es Salaam, Tanzania',
        subCategory: 'Communication API',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.9',
        review: '(40 Reviews)',
        user: '/img/avatars/avatar-4.jpg',
        rating: 'high',
        categories: [
            { slug: 'technology', name: 'Technology', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/beem-africa/beem-banner.jpg',
        desc: 'Mobile communication solutions for businesses across Africa.',
        fullDescription: [
            "At Beem, we envision an Africa powered by enterprises, empowered through technology. We enable communication and engagement across the continent through our suite of unified products. In the coming decades, Africa’s growth and commerce will be driven by mobile technology in enterprises.",
            "We have created an integrated communications & financial services platform with the largest mobile network reach in Africa, empowering enterprises to scale quickly and effectively. To drive commercial growth for our customers, we offer our advanced SMS, USSD, Airtime, Chatbot, and Mobile Money solutions through easy-to-integrate APIs as well as a self-service web portal."
        ],
        website: "https://beem.africa/",
        email: "info@beem.africa",
        call: "+255659457652",
        locations: [
            {
                branchName: "Head Office",
                address: "Dar es Salaam, Tanzania",
                phone: "+255 659 457 652"
            }
        ],
        contentSectionTitle: "Our Products",
        contentBlocks: [
            {
                title: "SMS Messaging",
                description: "Advanced SMS messaging, including Two-Way SMS, to connect and engage with customers across Africa.",
                image: "/img/listings/beem-africa/beem1.jpg"
            },
            {
                title: "USSD Services",
                description: "Reliable and scalable USSD solutions to provide interactive services and content to users on any mobile device.",
                image: "/img/listings/beem-africa/beem2.jpg"
            },
            {
                title: "Airtime & Mobile Payments",
                description: "Seamlessly integrate Airtime top-ups and Mobile Money payment solutions into your applications and services.",
                image: "/img/listings/beem-africa/beem3.jpg"
            },
            {
                title: "Chatbots & Automation",
                description: "Build and deploy intelligent Chatbots for automated customer engagement and data-driven communication.",
                image: "/img/listings/beem-africa/beem4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "9:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "CLOSED" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["API", "SMS", "USSD", "Mobile", "Payments", "Africa"],
        socials: {
            facebook: "https://www.facebook.com/beem.africa",
            instagram: "https://www.instagram.com/beem.africa/",
            twitter: "https://twitter.com/BeemAfrica",
            linkedin: "https://www.linkedin.com/company/beem-africa/",
            youtube: "https://www.youtube.com/c/BeemAfrica",
            whatsapp: "https://web.whatsapp.com/send?phone=255659457652"
        }
    },
    {
        id: 25,
        slug: 'aqiq-solutions',
        title: 'AQIQ Solutions Ltd',
        logo: '/img/logo-3.png',
        image: '/img/listings/aqiq-solutions-ltd/aqiq-grid.jpg',
        city: 'Nairobi',
        location: 'OUR MALL, 3rd Floor, Magadi Rd, Nairobi',
        subCategory: 'IT Solutions',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.8',
        review: '(28 Reviews)',
        user: '/img/avatars/avatar-5.jpg',
        rating: 'high',
        categories: [
            { slug: 'technology', name: 'Technology', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/aqiq-solutions-ltd/aqiq-banner.jpg',
        desc: 'Providing innovative IT and software solutions for modern businesses.',
        fullDescription: [
            "AQIQ Solutions Ltd was founded in 2019 as a leading provider of information technology solutions, specialising in ERP software, cloud infrastructure, security, surveillance, and Parking solutions. The company is committed to delivering tailored technology solutions that align with clients’ needs, ensuring top performance and a solid return on investment.",
            "As a strong and experienced ERPNext and Frappe partner in Kenya, AQIQ Solutions offers professional implementation services across a range of industries, empowering businesses with scalable, secure, and intelligent technology."
        ],
        website: "https://aqiqsolutions.com/",
        email: "info@aqiqsolutions.com",
        call: "+254735535251",
        locations: [
            {
                branchName: "Main Office",
                address: "OUR MALL, Avocado Lane, off, 3rd Floor Magadi Rd, Nairobi",
                phone: "+254 735 53 52 51",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2042210.089441838!2d36.761373!3d-1.361705!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b4fcc5b9151%3A0xb11fb3339fd53ada!2sAQIQ%20Solutions%20Limited!5e0!3m2!1sen!2sus!4v1754731293173!5m2!1sen!2sus"
            }
        ],
        contentSectionTitle: "Our Core Solutions",
        contentBlocks: [
            {
                title: "ERP Solutions",
                description: "Optimize and integrate your business processes with tailored ERP systems designed to boost efficiency and decision-making.",
                image: "/img/listings/aqiq-solutions-ltd/aqiq1.jpg"
            },
            {
                title: "Cloud Solutions",
                description: "Leverage secure, scalable, and cost-effective cloud infrastructure to power your digital operations and support growth.",
                image: "/img/listings/aqiq-solutions-ltd/aqiq2.jpg"
            },
            {
                title: "Cyber Security",
                description: "Protect your digital assets with advanced cybersecurity solutions, ensuring data integrity and resilience against threats.",
                image: "/img/listings/aqiq-solutions-ltd/aqiq3.jpg"
            },
            {
                title: "Parking Solutions",
                description: "Optimize space and streamline vehicle management with intelligent, automated parking systems for modern infrastructure.",
                image: "/img/listings/aqiq-solutions-ltd/aqiq4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Fri", "hours": "9:00 AM - 5:00 PM" },
            { "day": "Saturday", "hours": "CLOSED" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["ERP", "ITSolutions", "Cloud", "Kenya", "CyberSecurity", "ERPNext"],
        socials: {
            facebook: "https://www.facebook.com/aqiqsolutions",
            instagram: "https://www.instagram.com/aqiqsolutions/",
            linkedin: "https://www.linkedin.com/company/aqiqsolutions",
            youtube: "https://www.youtube.com/@AqiqSolutions"
        }
    },
    {
        id: 26,
        slug: 'unisaif-organic-cosmetics',
        title: 'Unisaif Organics',
        logo: '/img/logo-3.png',
        image: '/img/listings/unisaif-organic-cosmetics/unisaif-grid.jpg',
        city: 'Bhopal',
        location: 'Bhopal, Madhya Pradesh, India',
        subCategory: 'Cosmetics',
        isVerified: false,
        featured: true,
        statusText: 'Unclaimed',
        ratingRate: '4.7',
        review: '(17 Reviews)',
        user: '/img/avatars/avatar-1.jpg',
        rating: 'high',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/unisaif-organic-cosmetics/unisaif-banner.jpg',
        desc: 'Organic and natural cosmetic products manufacturer.',
        fullDescription: [
            "Unisaif Organics is a leading formulator and manufacturer of assured alcohol-free and chemical-free organic self-care products. Founded in 2018 by brothers Ibrahim and Hamza Ali, the brand operates under the Unisaif Healthcare group, carrying forward a legacy of stringent business ethics.",
            "Specializing in a holistic range of skincare, haircare, babycare, and perfumery, Unisaif's products are the outcome of in-depth research rooted in century-old natural formulas. With a commitment to quality over quantity and consumer satisfaction, the company offers a wholesome platter of non-toxic, eco-friendly products for the entire family, from infants to grandparents."
        ],
        website: "https://www.buyunisaif.com/",
        email: "unisaif1@gmail.com",
        call: "+919993800052",
        locations: [
            {
                branchName: "Main Office",
                address: "Nishat Heights, 1-2, Ahmedabad Palace Rd, Kohefiza, Bhopal, Madhya Pradesh 462001",
                phone: "+91 99938 00052",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.4763769612046!2d77.37226057509943!3d23.262134079006522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c6813fffffff9%3A0xd419d1de5beeef51!2sUnisaif%20Healthcare!5e0!3m2!1sen!2sin!4v1754395598309!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Natural Product Range",
        contentBlocks: [
            {
                title: "Facewash",
                description: "A wholesome range of non-toxic, organic facewashes to gently cleanse and rejuvenate your skin.",
                image: "/img/listings/unisaif-organic-cosmetics/unisaif1.jpg"
            },
            {
                title: "Face Scrub",
                description: "Natural exfoliating face scrubs designed to remove dead skin cells and reveal a brighter, smoother complexion.",
                image: "/img/listings/unisaif-organic-cosmetics/unisaif2.jpg"
            },
            {
                title: "Face Serum",
                description: "Potent and lightweight serums formulated with natural ingredients to target specific skin concerns.",
                image: "/img/listings/unisaif-organic-cosmetics/unisaif3.jpg"
            },
            {
                title: "Face Cream",
                description: "Nourishing and hydrating face creams to lock in moisture and maintain a healthy skin barrier.",
                image: "/img/listings/unisaif-organic-cosmetics/unisaif4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Sat", "hours": "10:00 AM - 8:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["Organic", "Skincare", "Haircare", "India", "ChemicalFree", "Babycare"],
        socials: {
            instagram: "https://www.instagram.com/unisaiforganicsindia/",
            whatsapp: "https://api.whatsapp.com/send?phone=919993800052"
        }
    },
    {
        id: 27,
        slug: 'fefco',
        title: 'Fefco',
        logo: '/img/logo-3.png',
        image: '/img/listings/fefco/fefco-grid.jpg',
        city: 'Dubai',
        location: 'Qusais Industrial Area 5, Dubai, UAE',
        subCategory: 'Industrial Supply',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.6',
        review: '(22 Reviews)',
        user: '/img/avatars/avatar-2.jpg',
        rating: 'high',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/fefco/fefco-banner.jpg',
        desc: 'Suppliers of industrial equipment and renewable energy solutions.',
        fullDescription: [
            "Fefco offers the best in renewable energy solutions, sourcing and providing high-quality solar panels, inverters, and other components to ensure maximum efficiency and longevity for your solar system. They specialize in a wide range of solar applications, including water heating, air conditioners, CCTV, and full PV systems.",
            "Beyond solar, Fefco provides comprehensive water solutions like filtration systems and chillers. Their expertise extends to innovative technologies such as daylighting systems that bring natural light indoors, reducing electricity consumption. With a focus on quality and customer satisfaction, Fefco delivers reliable and sustainable solutions for modern energy and water needs."
        ],
        website: "https://fefco.ae/",
        email: "info@fefco.ae",
        call: "+971507867872",
        locations: [
            {
                branchName: "Main Office",
                address: "Qusais Industrial Area 5, Dubai, UAE",
                phone: "+971 50 786 7872",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d28859.49287407281!2d55.405147!3d25.289531!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDE3JzIyLjMiTiA1NcKwMjQnMTguNSJF!5e0!3m2!1sen!2sus!4v1754458675827!5m2!1sen!2sus"
            }
        ],
        contentSectionTitle: "Our Solutions",
        contentBlocks: [
            {
                title: "Solar PV Systems",
                description: "High-quality solar panels and inverters to ensure maximum efficiency and clean energy generation.",
                image: "/img/listings/fefco/fefco1.jpg"
            },
            {
                title: "Solar Water Heating",
                description: "Reliable and affordable solar-powered water heating solutions for homes and businesses.",
                image: "/img/listings/fefco/fefco2.jpg"
            },
            {
                title: "Solar Air Conditioners",
                description: "Energy-efficient air conditioning systems that run on solar power, reducing electricity costs and your carbon footprint.",
                image: "/img/listings/fefco/fefco3.jpg"
            },
            {
                title: "Day Lighting System",
                description: "Innovative systems designed to bring natural light indoors, reducing electricity consumption.",
                image: "/img/listings/fefco/fefco4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Saturday", "hours": "8:00 AM - 6:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["SolarEnergy", "WaterSolutions", "Engineering", "UAE", "Renewable", "Industrial"],
        socials: {
            whatsapp: "https://api.whatsapp.com/send/?phone=971507867872"
        }
    },
    {
        id: 28,
        slug: 'modiyo',
        title: 'Modiyo',
        logo: '/img/logo-3.png',
        image: '/img/listings/modiyo/modiyo-grid.jpg',
        city: 'Jalgaon',
        location: '379/9 jilha Peth, Behind GPO, India',
        subCategory: 'General Manufacturing',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.2',
        review: '(9 Reviews)',
        user: '/img/avatars/avatar-3.jpg',
        rating: 'mid',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/modiyo/modiyo-banner.jpg',
        desc: 'Diverse manufacturing and production services for the food and beverage industry.',
        fullDescription: [
            "Modiyo is a food and beverage solutions company that provides flavor concentrates, ingredients, and industrial machinery for sectors like soft drinks, juices, dairy, ice cream, and bakery. They offer everything from processing and packaging equipment to ready-to-use formulations, helping businesses launch or scale their production.",
            "Under its brand Ekta Machines, Modiyo has delivered over 500 turnkey setups across India and globally, known for their cost-effective, high-performance solutions tailored for small to mid-scale beverage and dessert manufacturers."
        ],
        website: "https://modiyo.com/",
        email: "info@modiyo.com",
        call: "+918822686868",
        locations: [
            {
                branchName: "Main Office",
                address: "379/9 jilha Peth, Behind GPO, India",
                phone: "+91-8822-686868",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.784018818817!2d36.90561571475402!3d-1.3060419990505188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1262d5568289%3A0x63351f72787d554a!2sHebatullah%20Brothers%20Ltd!5e0!3m2!1sen!2sin!4v16600000000001"
            }
        ],
        contentSectionTitle: "Our Products & Services",
        contentBlocks: [
            {
                title: "Soda & Soft Drink Industry",
                description: "We offer a wide range of ingredients and machines for the soda and soft drink industry, helping you create delicious and refreshing beverages.",
                image: "/img/listings/modiyo/modiyo1.jpg"
            },
            {
                title: "Juice Industry",
                description: "From fruit concentrates to juicing machines, we provide everything you need to produce fresh and nutritious juices for your customers.",
                image: "/img/listings/modiyo/modiyo2.jpg"
            },
            {
                title: "Ice Cream & Frozen Dessert Industry",
                description: "Create creamy and flavorful ice creams and frozen desserts with our top-quality ingredients and state-of-the-art machines.",
                image: "/img/listings/modiyo/modiyo3.jpg"
            },
            {
                title: "Bakery & Confectionery Industry",
                description: "Enhance the taste and texture of your baked goods and confectionery products with our premium ingredients and advanced machinery.",
                image: "/img/listings/modiyo/modiyo4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Mon - Sat", "hours": "9:30 AM - 7:30 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["FoodProcessing", "Machinery", "Ingredients", "India", "Beverages", "Turnkey"],
        socials: {
            facebook: "https://www.facebook.com/profile.php?id=61556271655822",
            instagram: "https://www.instagram.com/modiyoglobal/",
            youtube: "https://www.youtube.com/channel/UC0ZZxSpnYn3lgnbdJLQAVOw"
        }
    },
    {
        id: 29,
        slug: 'national-agencies',
        title: 'National Agencies',
        logo: '/img/logo-3.png',
        image: '/img/listings/national-agencies/national-grid.jpg',
        city: 'Pune',
        location: 'Radha Nagari, #C9, Bhau Patil Road, Bopodi, Pune 411003',
        subCategory: 'Agency & Distribution',
        isVerified: false,
        featured: false,
        statusText: 'Unclaimed',
        ratingRate: '4.4',
        review: '(15 Reviews)',
        user: '/img/avatars/avatar-4.jpg',
        rating: 'mid',
        categories: [
            { slug: 'manufacturing', name: 'Manufacturing', isPrimary: true }
        ],

        // --- Detail Fields ---
        bannerImage: '/img/listings/national-agencies/national-banner.jpg',
        desc: 'National distribution and agency for various manufactured goods.',
        fullDescription: [
            "At National Agencies Rolling Shutter Manufacture, our business model revolves around delivering high-quality, durable, and secure rolling shutter solutions tailored to commercial, industrial, and residential needs.",
            "We utilize top-grade materials and advanced technology to produce manual and motorized rolling shutters, catering to diverse industry requirements. Our commitment to customer satisfaction, timely delivery, and reliable after-sales service makes us a trusted partner in the industry."
        ],
        website: "https://www.nationalagenciespune.com/",
        email: "sales@nationalagenciespune.com",
        call: "+919373321663",
        locations: [
            {
                branchName: "Main Office",
                address: "Radha Nagari, #C9, Bhau Patil Road, Bopodi, Opp. Anand Service Station, Pune 411003",
                phone: "+91-937 332 1663",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.0235985093996!2d73.83514149999999!3d18.5729748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf534386880f%3A0xead35b0880c1fe02!2sRadhanagri%20Cooperative%20Housing%20Society%20Ltd!5e0!3m2!1sen!2sin!4v1754574351128!5m2!1sen!2sin"
            }
        ],
        contentSectionTitle: "Our Products",
        contentBlocks: [
            {
                title: "Rolling Shutter",
                description: "High-quality, durable, and secure rolling shutter solutions for commercial, industrial, and residential needs.",
                image: "/img/listings/national-agencies/national1.jpg"
            },
            {
                title: "Double Wall Rolling Shutter",
                description: "Insulated and robust double-wall rolling shutters for enhanced security and thermal efficiency.",
                image: "/img/listings/national-agencies/national2.jpg"
            },
            {
                title: "High Speed Doors",
                description: "Advanced high-speed doors designed for fast-paced industrial environments, improving traffic flow and energy savings.",
                image: "/img/listings/national-agencies/national3.jpg"
            },
            {
                title: "Sectional Doors",
                description: "Modern and functional sectional doors offering excellent insulation and security for garages and commercial spaces.",
                image: "/img/listings/national-agencies/national4.jpg"
            }
        ],
        reviews: [],
        workingHours: [
            { "day": "Monday - Saturday", "hours": "9:00 AM - 6:00 PM" },
            { "day": "Sunday", "hours": "CLOSED" }
        ],
        tags: ["RollingShutter", "IndustrialDoors", "Security", "Pune", "Manufacturing"],
        socials: {
            whatsapp: "https://api.whatsapp.com/send/?phone=919373321663"
        }
    }
];



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
    { label: 'About Us', href: '#' }, // Keep as placeholder since you don't have this page
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