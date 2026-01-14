// src/app/components/list-detail/faq-section.tsx
// Using theme's accordion design

'use client'

import React from 'react'
import Link from 'next/link'

export interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  businessName: string
}

// Sample data for preview - remove after testing
export const SAMPLE_FAQS: FAQ[] = [
  {
    question: "Which is the best wood preservative for termites in Kenya?",
    answer: "For effective protection against termites (white ants) and wood rot, you need a deep-penetrating chemical treatment. Green Guard Wood Preservative is top-rated for coastal and inland timber protection. It prevents fungal decay in roofing rafters and fencing, offering a superior and more affordable alternative to standard market brands."
  },
  {
    question: "Where can I buy wholesale paint thinners and white spirit in bulk?",
    answer: "If you are a hardware store owner or contractor looking for factory-direct prices, buying from a local manufacturer is best. We supply high-quality Standard Thinners, White Spirit, and Mineral Turpentine in 20L and 200L drums across Nairobi, Mombasa, and Eldoret, cutting out the middleman to give you better margins."
  },
  {
    question: "Who are the suppliers of industrial solvents in Mombasa and Nairobi?",
    answer: "Leading suppliers of industrial solvents include manufacturers in the Coast region who distribute countrywide. We specialize in bulk Turpentine, White Spirit, and Thinners for the paint, coating, and cleaning industries, delivering to all major towns including Kisumu and Nakuru."
  },
  {
    question: "What is the difference between Green Guard White Spirit and Mineral Turpentine?",
    answer: "Both are excellent solvents. Our White Spirit is a high-purity solvent ideal for cleaning brushes and thinning oil-based paints without residue. Our Mineral Turpentine is a robust industrial solvent often used for degreasing and heavy-duty paint thinning."
  },
  {
    question: "Where is Green Guard located and do you deliver to Nairobi?",
    answer: "Green Guard is a leading manufacturer based in Nyali, Mombasa. Yes, we offer countrywide delivery. We supply hardware stores and construction sites in Nairobi, Kisumu, Eldoret, Nakuru, and the entire Coast region including Malindi and Diani."
  }
]

export default function FAQSection({ faqs, businessName }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <div className="listingSingleblock mb-4" id="faqs">
      <div className="SingleblockHeader">
        <Link
          data-bs-toggle="collapse"
          data-parent="#faqsBlock"
          data-bs-target="#faqsBlock"
          aria-controls="faqsBlock"
          href="#"
          aria-expanded="true"
        >
          <h4 className="listingcollapseTitle">Frequently Asked Questions</h4>
        </Link>
      </div>

      <div id="faqsBlock" className="panel-collapse collapse show">
        <div className="card-body p-4 pt-2">
          <div className="faqsWraps w-100">
            <div className="faqsCaps">
              <div className="accordion accordion-flush" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header rounded-2">
                      <button
                        className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-${index}`}
                        aria-expanded={index === 0 ? 'true' : 'false'}
                        aria-controls={`faq-${index}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`faq-${index}`}
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org FAQ markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  )
}