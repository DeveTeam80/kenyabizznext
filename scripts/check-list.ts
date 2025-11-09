// scripts/check-listings.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get all listings
  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      approved: true,
      categories: true,
      subCategory: true
    },
    take: 10
  })

  console.log(`\n📊 Found ${listings.length} listings:\n`)

  listings.forEach(listing => {
    console.log(`---------------------------------`)
    console.log(`ID: ${listing.id}`)
    console.log(`Slug: ${listing.slug}`)
    console.log(`Title: ${listing.title}`)
    console.log(`Approved: ${listing.approved}`)
    console.log(`SubCategory: ${listing.subCategory}`)
    console.log(`Categories:`, JSON.stringify(listing.categories, null, 2))
    console.log(``)
  })

  // Check specifically for 'ema-advisory'
  const emaListing = await prisma.listing.findFirst({
    where: {
      slug: 'ema-advisory'
    }
  })

  if (emaListing) {
    console.log(`\n✅ Found 'ema-advisory' listing:`)
    console.log(JSON.stringify(emaListing, null, 2))
  } else {
    console.log(`\n❌ No listing with slug 'ema-advisory' found`)
    
    // Check for similar slugs
    const similarListings = await prisma.listing.findMany({
      where: {
        OR: [
          { slug: { contains: 'ema' } },
          { slug: { contains: 'advisory' } },
          { title: { contains: 'EMA' } },
          { title: { contains: 'Advisory' } }
        ]
      },
      select: {
        slug: true,
        title: true
      }
    })
    
    if (similarListings.length > 0) {
      console.log(`\n🔍 Found similar listings:`)
      similarListings.forEach(l => {
        console.log(`  - ${l.slug} (${l.title})`)
      })
    }
  }

  await prisma.$disconnect()
}

main().catch(console.error)