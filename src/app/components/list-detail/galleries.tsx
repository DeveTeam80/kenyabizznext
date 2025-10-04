'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ListData } from '@/app/data/data';

interface GalleriesProps {
  listing: ListData;
}

export default function Galleries({ listing }: GalleriesProps) {
  let [isOpen, setisOpen] = useState<boolean>(false);
  let [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Create images array from content blocks
  const images = listing.contentBlocks?.map(block => block.image) || [listing.image];
  
  let handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setisOpen(true);
  };

  const slides = images.map((image) => ({ src: image }));

  return (
    <div className="listingSingleblock mb-4" id="Galleries">
      <div className="SingleblockHeader">
        <Link data-bs-toggle="collapse" data-parent="#gallery" data-bs-target="#gallery" aria-controls="gallery" href="#" aria-expanded="false" className="collapsed">
          <h4 className="listingcollapseTitle">Gallery</h4>
        </Link>
      </div>
      
      <div id="gallery" className="panel-collapse collapse show">
        <div className="card-body p-4 pt-2">
          <ul className="row align-items-center justify-content-center g-3 p-0">
            {images.map((item, index) => (
              <li className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6" key={index}>
                <Link href="#" className="mfp-gallery d-block" onClick={() => handleImageClick(index)}>
                  <Image 
                    src={item} 
                    width={0} 
                    height={0} 
                    sizes='100vw' 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                    className="img-fluid rounded" 
                    alt="Gallery Image"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Lightbox 
        open={isOpen} 
        close={() => setisOpen(false)} 
        slides={slides} 
        index={currentImageIndex}
      />
    </div>
  )
}