'use client'
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { BsBasket2Fill } from 'react-icons/bs'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import { ListData } from '@/app/data/data';

interface ProductsProps {
  listing: ListData;
}

export default function Products({ listing }: ProductsProps) {
  // If no content blocks, don't render the section
  if (!listing.contentBlocks || listing.contentBlocks.length === 0) {
    return null;
  }

  return (
    <div className="listingSingleblock mb-4" id="productss">
      <div className="SingleblockHeader">
        <Link data-bs-toggle="collapse" data-parent="#products" data-bs-target="#products" aria-controls="products" href="#" aria-expanded="false" className="collapsed">
          <h4 className="listingcollapseTitle">{listing.contentSectionTitle || 'Browse Products'}</h4>
        </Link>
      </div>
      
      <div id="products" className="panel-collapse collapse show">
        <div className="card-body p-4 pt-2">
          <Swiper
            slidesPerView={3}
            spaceBetween={15}
            modules={[Autoplay, Pagination]}
            pagination={true}
            loop={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 3 },
            }}
          >
            {listing.contentBlocks.map((item, index) => (
              <SwiperSlide className="singleItem" key={index}>
                <div className="catalogCard">
                  <div className="catalogThumb position-relative">
                    <Link href="#">
                      <figure>
                        <Image 
                          src={item.image} 
                          width={0} 
                          height={0} 
                          sizes='100vw' 
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                          className="img-fluid rounded-2" 
                          alt={item.title}
                        />
                      </figure>
                    </Link>
                  </div>
                  
                  <div className="catalogCaps">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div className="catalogProducttitle">
                        <h6 className="lh-base m-0">{item.title}</h6>
                        <p className="text-md m-0">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}