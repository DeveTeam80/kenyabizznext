// src/app/components/list-detail/reviews-section.tsx
// Using theme's reviews design pattern

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa6'

export interface Review {
  title: string        // Review headline
  comment: string      // Full review text
  name: string         // Reviewer name
  designation: string  // Role/company
  rating: number       // 1-5 stars
  date?: string        // Optional date
  avatar?: string      // Optional avatar image
}

interface ReviewsSectionProps {
  reviews: Review[]
  businessName: string
  averageRating?: number
}

// Sample data for preview
export const SAMPLE_REVIEWS: Review[] = [
  {
    title: "Best Wholesale Prices for Hardware Shops",
    comment: "I own a hardware shop in Eldoret and have been stocking Green Guard White Spirit and Turpentine for months. The quality is equal to the big brands like Seweco but the wholesale price is much better. Delivery to the Rift Valley was smooth. Highly recommend for bulk buyers.",
    name: "Joseph K.",
    designation: "Hardware Supplier",
    rating: 5,
    date: "2025-01-10"
  },
  {
    title: "Effective Wood Treatment for Coastal Construction",
    comment: "We used Green Guard Wood Preservative for a large roofing project in Diani. The anti-termite protection is excellent, and it penetrates the wood deeply. Much more affordable than using Crown preservatives for large timber projects. Great service from the Mombasa team.",
    name: "Coastal Builds & Renovations Ltd",
    designation: "Construction Company",
    rating: 5,
    date: "2025-01-08"
  },
  {
    title: "High Quality Thinner for Auto Spraying",
    comment: "As a garage owner in Nairobi, I need high-gloss thinners that dry fast. Green Guard Standard Thinner works perfectly with automotive paints. No blooming or cloudiness. We buy the 200L drums directly and save a lot of money.",
    name: "Maina",
    designation: "Auto Body Works",
    rating: 5,
    date: "2025-01-05"
  },
  {
    title: "Good Window Putty",
    comment: "Their Window Putty doesn't crack easily and stays workable even in the hot Mombasa sun. Better than Xpert putty which dries out too fast in the container. Good product for glaziers.",
    name: "Ahmed",
    designation: "Glass & Aluminium Contractor",
    rating: 5,
    date: "2025-01-02"
  },
  {
    title: "Reliable Manufacturer",
    comment: "Professional service. We ordered bulk Contact Adhesive and Wood Glue for our joinery workshop in Nakuru. Products arrived on time and the bonding strength is industrial grade. Good to see a local manufacturer supporting Kenyan businesses.",
    name: "Rift Valley Furniture Co.",
    designation: "Furniture Manufacturer",
    rating: 5,
    date: "2024-12-28"
  }
]

// Helper to render star ratings
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="d-flex align-items-center justify-content-start gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <FaStar className={`text-sm ${star <= rating ? 'text-warning active' : 'text-muted disabled'}`} />
        </span>
      ))}
    </div>
  )
}

// Helper to get initials for avatar fallback
function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ReviewsSection({
  reviews,
  businessName,
  averageRating
}: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  const avgRating = averageRating ||
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="listingSingleblock mb-4" id="reviews">
      <div className="SingleblockHeader">
        <Link
          data-bs-toggle="collapse"
          data-parent="#reviewsBlock"
          data-bs-target="#reviewsBlock"
          aria-controls="reviewsBlock"
          href="#"
          aria-expanded="true"
        >
          <h4 className="listingcollapseTitle">Reviews</h4>
        </Link>
      </div>

      <div id="reviewsBlock" className="panel-collapse collapse show">
        <div className="card-body p-4 pt-2">
          <div className="allreviewsWrapper">
            {/* Reviews count and average */}
            <div className="reviewsTitle d-flex align-items-center justify-content-between mb-4">
              <h5 className="mb-0">{String(reviews.length).padStart(2, '0')} Reviews</h5>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold fs-5">{avgRating.toFixed(1)}</span>
                <StarRating rating={Math.round(avgRating)} />
              </div>
            </div>

            {/* Reviews list */}
            <div className="allreviewsLists mb-4">
              {reviews.map((review, index) => (
                <div className="singlereviews" key={index}>
                  <div className="d-flex align-items-start justify-content-between flex-sm-wrap flex-wrap gap-3">
                    {/* Review content */}
                    <div className="reviewerMessage w-100">
                      <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
                        <div className="reviewerInfo">
                          <h6 className="mb-0">{review.name}</h6>
                          <p className="text-md mb-0 text-muted">
                            {review.designation}
                            {review.date && ` • ${formatDate(review.date)}`}
                          </p>
                        </div>
                        <div className="reviewsFlexlast">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>

                      {/* Review title */}
                      <h6 className="text-dark mb-2">{review.title}</h6>

                      {/* Review comment */}
                      <div className="messageDescription">
                        <p className="text-muted mb-0">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org Review markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": businessName,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": avgRating.toFixed(1),
              "reviewCount": reviews.length,
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": reviews.map(review => ({
              "@type": "Review",
              "author": { "@type": "Person", "name": review.name },
              "name": review.title,
              "datePublished": review.date,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": review.comment
            }))
          })
        }}
      />
    </div>
  )
}