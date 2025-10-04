'use client';

import React from "react";
import { BsFunnel, BsStarFill } from 'react-icons/bs';
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import Select, { OnChangeValue } from 'react-select'; 

interface ListSidebarOneProps {
  subCategories: string[];
  cities: string[];
}
type SelectOption = {
    value: string;
    label: string;
};

export default function ListSidebarOne({ subCategories, cities }: ListSidebarOneProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page'); // Reset page when filtering
      return params.toString();
    },
    [searchParams]
  );
      
 const handleMultiFilterChange = (filterType: string, selectedOptions: OnChangeValue<SelectOption, true>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(filterType); // Clear all existing values for this filter

        selectedOptions.forEach(option => {
            params.append(filterType, option.value);
        });

        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

     const handleFilterChange = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

  const handleSearchChange = (value: string) => {
    const queryString = createQueryString('search', value);
    router.push(`${pathname}?${queryString}`);
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };
   // Format cities for react-select: [{ value: 'nairobi', label: 'Nairobi' }]
    const cityOptions: SelectOption[] = cities.map(city => ({ value: city, label: city }));
    
    // Get all current 'city' params from the URL
    const currentCityValues = searchParams.getAll('city');
    // Find the full option objects that match the current values
    const selectedCityOptions = cityOptions.filter(option => currentCityValues.includes(option.value));

    // --- SubCategory Filter Setup --- (Assuming you want this to be multi-select too)
    const subCategoryOptions: SelectOption[] = subCategories.map(subCat => ({ value: subCat, label: subCat }));
    const currentSubCategoryValues = searchParams.getAll('subCategory');
    const selectedSubCategoryOptions = subCategoryOptions.filter(option => currentSubCategoryValues.includes(option.value));


  // Get current filter values
  const currentSubCategory = searchParams.get('subCategory') || '';
  const currentCity = searchParams.get('city') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentSearch = searchParams.get('search') || '';
  const isFeatured = searchParams.get('featured') === 'true';
  const isVerified = searchParams.get('verified') === 'true';

  return (
    <>
      <div className="searchingSidebar pe-xl-5">
        <div className="offcanvas offcanvas-start largeshow" data-bs-scroll="true" tabIndex={-1} id="filterSlider" aria-labelledby="filterSliderLabel">
          <div className="offcanvas-header border-bottom py-3">
            <h3 className="h5">Filters</h3>
            <button 
              type="button" 
              onClick={clearFilters}
              className="btn btn-link text-primary p-0 text-decoration-none small me-3"
            >
              Clear All
            </button>
            <button type="button" className="btn-close text-sm d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#filterSidebar" aria-label="Close"></button>
          </div>
          
          <div className="offcanvas-body overflow-x-hidden p-4 p-lg-0" id="filterSliderLabel">
            <div className="searchInner">
              <div className="search-inner">
                
                {/* Search Box */}
                <div className="filter-search-box mb-4">
                  <div className="form-group form-border mb-0">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search listing..."
                      value={currentSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div className="prtsTypes mb-4">
                  <div className="filterButton">
                    <div className="filterFlex">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="ratingsfilter" 
                        id="all"
                        checked={!currentRating}
                        onChange={() => handleFilterChange('rating', '')}
                      />
                      <label className="btn" htmlFor="all">
                        <BsStarFill className="me-1"/>All
                      </label>
                    </div>
                    
                    <div className="filterFlex">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="ratingsfilter" 
                        id="lowplus"
                        checked={currentRating === 'low'}
                        onChange={() => handleFilterChange('rating', 'low')}
                      />
                      <label className="btn" htmlFor="lowplus">
                        <BsStarFill className="me-1"/>Below 3.5
                      </label>
                    </div>
                    
                    <div className="filterFlex">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="ratingsfilter" 
                        id="midplus"
                        checked={currentRating === 'mid'}
                        onChange={() => handleFilterChange('rating', 'mid')}
                      />
                      <label className="btn" htmlFor="midplus">
                        <BsStarFill className="me-1"/>3.5 - 4.4
                      </label>
                    </div>
                    
                    <div className="filterFlex">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="ratingsfilter" 
                        id="highplus"
                        checked={currentRating === 'high'}
                        onChange={() => handleFilterChange('rating', 'high')}
                      />
                      <label className="btn" htmlFor="highplus">
                        <BsStarFill className="me-1"/>4.5+
                      </label>	
                    </div>
                  </div>
                </div>
                
                {/* Subcategories Filter */}
                <div className="filter-search-box mb-4">
                        <h6 className="mb-2 text-sm text-uppercase fw-medium">Sub-Categories</h6>
                        <Select
                            instanceId="subcat-select"
                            options={subCategoryOptions}
                            isMulti
                            isClearable={true}
                            value={selectedSubCategoryOptions}
                            onChange={(options) => handleMultiFilterChange('subCategory', options)}
                            placeholder="Select sub-categories..."
                        />
                    </div>
                
                {/* Cities Filter */}
                <div className="filter-search-box mb-4">
                        <h6 className="mb-2 text-sm text-uppercase fw-medium">Cities</h6>
                        <Select
                            instanceId="cities-select"
                            options={cityOptions}
                            isMulti // Enable multi-select
                            isClearable={true}
                            isSearchable={true}
                            value={selectedCityOptions} // Pass the array of selected options
                            onChange={(options) => handleMultiFilterChange('city', options)}
                            placeholder="Select one or more cities..."
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                
                {/* Special Features Filter */}
                <div className="filter-search-box mb-4">
                  <div className="filtersearch-title">
                    <h6 className="mb-2 lh-base text-sm text-uppercase fw-medium">Special Features</h6>
                  </div>
                  <div className="row align-items-center justify-content-between gy-2">
                    <div className="col-6">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="featured"
                          checked={isFeatured}
                          onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                        />
                        <label className="form-check-label" htmlFor="featured">Featured</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="verified"
                          checked={isVerified}
                          onChange={(e) => handleFilterChange('verified', e.target.checked ? 'true' : '')}
                        />
                        <label className="form-check-label" htmlFor="verified">Verified</label>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>							
            </div>
          </div>
        </div>
      </div>
      
      <Link 
        href="#filterSlider" 
        data-bs-toggle="offcanvas" 
        data-bs-target="#filterSlider" 
        aria-controls="filterSlider" 
        className="fixed-bottom z-sticky d-lg-none filterButtons"
      >
        <BsFunnel className=""/>Filter Options
      </Link>
    </>
  );
}