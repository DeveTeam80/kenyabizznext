'use client';
import React from 'react';
import Link from 'next/link';
import { categoryData, CategoryData as CategoryType } from '../../data/data'; // Adjust path if needed

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// The interface is now imported from data.ts to avoid duplication
// interface CategoryData {
//   image: string; // Note: image is in your original interface but not used, you can remove it if you wish
//   icon: IconType;
//   title: string;
//   list: string;
//   link: string;
// }

export default function CategoryOne() {
  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <Swiper
          slidesPerView={6}
          spaceBetween={30}
          modules={[Autoplay]}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1200: { slidesPerView: 6 },
          }}
        >
          {categoryData.map((item: CategoryType, index: number) => {
            let Icon = item.icon;
            return (
              <SwiperSlide className="singleCategory" key={index}>
                <div className="category-small-wrapper light">
                  {/* Use the link from your data */}
                  <Link href={item.link} className="categoryBox">
                    <div className="categoryCapstions">
                      <div className="catsIcons">
                        <div className="icoBoxx"><Icon /></div>
                      </div>
                      <div className="catsTitle"><h5>{item.title}</h5></div>
                      <div className="CatsLists"><span className="categorycounter">{item.list}</span></div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}