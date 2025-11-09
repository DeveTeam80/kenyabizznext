// scripts/export-mock-data.ts
// scripts/export-mock-data.ts
const { PrismaClient } = require('@prisma/client');
const { listData } = require('../src/app/data/data');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting data export...\n')

    // Create a default admin user if doesn't exist
    console.log('👤 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@kenyabizz.com' },
        update: {},
        create: {
            email: 'admin@kenyabizz.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'admin',
            avatar: '/img/team-1.jpg',
        },
    })
    console.log('✅ Admin user created/verified\n')

    // Create a default business owner user
    console.log('👤 Creating business owner user...')
    const ownerPassword = await bcrypt.hash('owner123', 10)

    const owner = await prisma.user.upsert({
        where: { email: 'owner@kenyabizz.com' },
        update: {},
        create: {
            email: 'owner@kenyabizz.com',
            password: ownerPassword,
            name: 'Business Owner',
            role: 'user',
            avatar: '/img/team-2.jpg',
        },
    })
    console.log('✅ Business owner created/verified\n')

    // Kenyan cities for location detection
    const KENYAN_CITIES = [
        'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi',
        'kitale', 'garissa', 'kakamega', 'meru', 'nyeri', 'machakos', 'kericho',
        'embu', 'migori', 'bungoma', 'kilifi', 'voi', 'kitui', 'homa bay',
        'kisii', 'lamu', 'nanyuki'
    ]

    // Import listings
    console.log(`📝 Importing ${listData.length} listings...\n`)

    let imported = 0
    let skipped = 0

    for (const listing of listData) {
        try {
            // Check if listing already exists
            const existing = await prisma.listing.findUnique({
                where: { slug: listing.slug },
            })

            if (existing) {
                console.log(`⏭️  Skipped: ${listing.title} (already exists)`)
                skipped++
                continue
            }

            // Determine if global based on city
            const isGlobal = !KENYAN_CITIES.includes(listing.city.toLowerCase())

            // Determine location detection method
            const locationDetection = isGlobal ? 'auto' : 'auto'
            const locationVerified = !isGlobal // Auto-verify Kenyan cities

            // Create listing
            await prisma.listing.create({
                data: {
                    userId: owner.id, // Assign to business owner
                    slug: listing.slug,
                    title: listing.title,
                    desc: listing.desc,
                    logo: listing.logo || '/img/logo-3.png',
                    image: listing.image,
                    bannerImage: listing.bannerImage,

                    // Location fields
                    city: listing.city,
                    location: listing.location,
                    isGlobal: isGlobal,
                    locationVerified: locationVerified,
                    locationDetection: locationDetection,

                    subCategory: listing.subCategory,
                    call: listing.call,
                    email: listing.email,
                    website: listing.website || '',

                    // Status - approve all imported listings
                    approved: true,
                    isVerified: listing.isVerified,
                    featured: listing.featured,
                    statusText: listing.statusText,

                    // Rating
                    rating: listing.rating,
                    ratingRate: listing.ratingRate,
                    review: listing.review,

                    // JSON fields
                    categories: JSON.parse(JSON.stringify(listing.categories)),
                    fullDescription: JSON.parse(JSON.stringify(listing.fullDescription)),
                    locations: JSON.parse(JSON.stringify(listing.locations)),
                    contentSectionTitle: listing.contentSectionTitle,
                    contentBlocks: JSON.parse(JSON.stringify(listing.contentBlocks || [])),
                    reviews: JSON.parse(JSON.stringify(listing.reviews || [])),
                    workingHours: JSON.parse(JSON.stringify(listing.workingHours || [])),
                    tags: JSON.parse(JSON.stringify(listing.tags || [])),
                    socials: JSON.parse(JSON.stringify(listing.socials || {})),
                    seo: JSON.parse(JSON.stringify(listing.seo || {})),
                },
            })

            console.log(`✅ Imported: ${listing.title} (${isGlobal ? '🌍 Global' : '🇰🇪 Kenya'})`)
            imported++
        } catch (error: any) {
            console.error(`❌ Failed to import ${listing.title}:`, error.message)
        }
    }

    console.log('\n📊 Import Summary:')
    console.log(`✅ Imported: ${imported}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`❌ Total in mock data: ${listData.length}`)
}

main()
    .catch((e) => {
        console.error('❌ Export failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })