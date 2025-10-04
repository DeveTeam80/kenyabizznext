import React from 'react'
import Link from 'next/link'
import { ListData } from '@/app/data/data';

interface DescriptionsProps {
  listing: ListData;
}

export default function Descriptions({ listing }: DescriptionsProps) {
  return (
    <div className="listingSingleblock mb-4" id="descriptions">
      <div className="SingleblockHeader">
        <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed">
          <h4 className="listingcollapseTitle">Description</h4>
        </Link>
      </div>
      
      <div id="description" className="panel-collapse collapse show">
        <div className="card-body p-4 pt-2">
          {listing.fullDescription && listing.fullDescription.length > 0 ? (
            listing.fullDescription.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>{listing.desc}</p>
          )}
        </div>
      </div>
    </div>
  )
}