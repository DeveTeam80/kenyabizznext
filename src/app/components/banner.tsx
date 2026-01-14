// src/app/components/premium-banner.tsx
'use client'

import Link from 'next/link'
import { BsShieldCheck, BsArrowRight, BsInfoCircle } from 'react-icons/bs'

interface PremiumBannerProps {
  categoryName: string
  paidCount: number
  totalCount?: number
  showDetailedInfo?: boolean
}

export default function PremiumBanner({ 
  categoryName, 
  paidCount,
  totalCount,
  showDetailedInfo = true 
}: PremiumBannerProps) {
  return (
    <section className="bg-white py-3 border-bottom">
      <div className="container">
        <div className="row align-items-center">
          {/* Main Info */}
          <div className="col-lg-8 col-md-7">
            <div className="d-flex align-items-start gap-3">
              <div className="flex-shrink-0">
                <div 
                  className="square--50 circle bg-light d-flex align-items-center justify-content-center"
                  style={{ marginTop: '2px' }}
                >
                  <BsShieldCheck className="fs-4 text-primary" />
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="text-dark fw-bold mb-1 d-flex align-items-center gap-2">
                  Premium Business Directory
                  <span className="badge bg-light text-dark text-uppercase small fw-medium px-2 py-1">
                    Verified
                  </span>
                </h6>
                <p className="text-muted mb-0 small">
                  {showDetailedInfo ? (
                    <>
                      Showing <strong className="text-dark">{paidCount} verified premium {paidCount === 1 ? 'business' : 'businesses'}</strong> in {categoryName}.
                      {totalCount && totalCount > paidCount && (
                        <> Plus {totalCount - paidCount} free listings available.</>
                      )}
                    </>
                  ) : (
                    <>Curated selection of verified premium businesses in {categoryName}</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="col-lg-4 col-md-5 text-md-end mt-3 mt-md-0">
            <Link 
              href="/listings" 
              className="btn btn-sm btn-dark fw-medium px-4 d-inline-flex align-items-center gap-2"
            >
              <span>View All Listings</span>
              <BsArrowRight className="fs-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Alternative minimal version
export function PremiumBannerMinimal({ categoryName }: { categoryName: string }) {
  return (
    <div className="bg-white border-bottom py-2">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2 small text-dark">
            <BsInfoCircle className="text-primary" />
            <span>
              Showing premium listings in <strong>{categoryName}</strong>
            </span>
          </div>
          <Link 
            href="/listings" 
            className="text-dark text-decoration-none small fw-medium d-flex align-items-center gap-1"
          >
            <span>View all listings</span>
            <BsArrowRight className="small" />
          </Link>
        </div>
      </div>
    </div>
  )
}