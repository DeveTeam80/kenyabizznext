'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsSearch } from 'react-icons/bs';

interface HeroSearchProps {
  context?: 'local' | 'global';
  categorySlug?: string;
  placeholder?: string;
  locationPlaceholder?: string;
}

export default function HeroSearch({ 
  context = 'local', 
  categorySlug,
  placeholder = "What are you looking for?",
  locationPlaceholder = "Location"
}: HeroSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }
    
    if (location.trim()) {
      params.append('location', location.toLowerCase());
    }
    
    if (categorySlug) {
      params.append('category', categorySlug);
    }
    
    if (context === 'global') {
      params.append('global', 'true');
    }
    
    const searchUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
    router.push(searchUrl);
  };

  return (
    <div className="heroSearch rounded-search style-01 mt-4">
      <form onSubmit={handleSearch}>
        <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">
          <div className="col-xl-10 col-lg-9 col-md-12">
            <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="form-group">
                  <div className="mobSearch d-flex align-items-center justify-content-start">
                    <div className="flexStart ps-2">
                      <span className="fw-semibold text-dark">Find</span>
                    </div>
                    <input 
                      type="text" 
                      className="form-control fs-6 fw-medium border-0" 
                      placeholder={placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 single-border">
                <div className="form-group">
                  <div className="mobSearch d-flex align-items-center justify-content-start">
                    <div className="flexStart ps-2">
                      <span className="fw-semibold text-dark">Where</span>
                    </div>
                    <input 
                      type="text" 
                      className="form-control fs-6 fw-medium border-0" 
                      placeholder={locationPlaceholder}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-3 col-md-12 col-sm-12">
            <div className="form-group">
              <button type="submit" className="btn btn-primary rounded-pill w-100 fw-medium">
                <BsSearch className="me-2"/>Search
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}