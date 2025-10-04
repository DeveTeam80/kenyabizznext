import React from 'react'
import Link from 'next/link'
import { ListData } from '@/app/data/data';

interface MapsProps {
  listing: ListData;
}

export default function Maps({ listing }: MapsProps) {
  // Use the first location's map embed URL, or fallback to a default
  const mapUrl = listing.locations?.[0]?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15090.183774083564!2d72.82822336977539!3d18.99565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cef0d17ace6f%3A0xba0d758b25d8b289!2sICICI%20Bank%20Curry%20Road%2C%20Mumbai-Branch%20%26%20ATM!5e0!3m2!1sen!2sin!4v1624183548415!5m2!1sen!2sin";

  return (
    <div className="listingSingleblock mb-4" id="maps">
      <div className="SingleblockHeader">
        <Link data-bs-toggle="collapse" data-parent="#map" data-bs-target="#map" aria-controls="map" href="#" aria-expanded="false" className="collapsed">
          <h4 className="listingcollapseTitle">Map</h4>
        </Link>
      </div>
      
      <div id="map" className="panel-collapse collapse show">
        <div className="card-body p-4 pt-2">
          <div className="map-container rounded-3 overflow-hidden">
            <iframe 
              src={mapUrl}
              className="full-width" 
              height="450" 
              style={{ border: '0' }} 
              allowFullScreen 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}