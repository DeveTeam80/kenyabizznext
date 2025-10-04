'use client'
import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Select = dynamic(() => import('react-select'), { ssr: false })

import { FaLocationDot } from 'react-icons/fa6'
import { BiSearch } from 'react-icons/bi';

interface SearchFormData {
  query: string;
  location: string;
  category: string;
}

interface FormTwoProps {
  categories?: Array<{ value: string, label: string }>;
  locations?: Array<{ value: string, label: string }>;
}

interface Suggestion {
  id: number;
  title: string;
  category: string;
  type: 'business' | 'category';
}

export default function FormTwo({ categories = [], locations = [] }: FormTwoProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SearchFormData>({
    query: '',
    location: '',
    category: ''
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fallback data if props are empty
  const defaultCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'shops-and-suppliers', label: 'Shops and Suppliers' },
    { value: 'services', label: 'Services' },
    { value: 'technology', label: 'Technology and Communication' },
  ];

  const defaultLocations = [
    { value: 'all-kenya', label: 'All Kenya' },
    { value: 'nairobi', label: 'Nairobi' },
    { value: 'mombasa', label: 'Mombasa' },
    { value: 'kisumu', label: 'Kisumu' },
    { value: 'nakuru', label: 'Nakuru' },
    { value: 'eldoret', label: 'Eldoret' },
  ];

  const categoryOptions = categories.length > 0 ? categories : defaultCategories;
  const locationOptions = locations.length > 0 ? locations : defaultLocations;

  // Get suggestions from your data
  const getSuggestions = async (query: string): Promise<Suggestion[]> => {
    if (query.length < 2) return [];

    try {
      const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const handleQueryChange = async (value: string) => {
    setFormData(prev => ({ ...prev, query: value }));

    // Clear existing timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = null;
    }

    if (value.length >= 2) {
      setIsLoadingSuggestions(true);

      // Debounce the API call
      suggestionTimeoutRef.current = setTimeout(async () => {
        const newSuggestions = await getSuggestions(value);
        setSuggestions(newSuggestions.slice(0, 6)); // Limit to 6 suggestions
        setShowSuggestions(true);
        setIsLoadingSuggestions(false);
        suggestionTimeoutRef.current = null;
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'business') {
      // Navigate directly to business
      const params = new URLSearchParams();
      params.append('q', suggestion.title);
      router.push(`/search?${params.toString()}`);
    } else if (suggestion.type === 'category') {
      // Set category and search
      setFormData(prev => ({ ...prev, category: suggestion.category, query: suggestion.title }));
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    if (field === 'query') {
      handleQueryChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCategoryChange = (selectedOption: any) => {
    setFormData(prev => ({ ...prev, category: selectedOption?.value || '' }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    const params = new URLSearchParams();

    if (formData.query.trim()) {
      params.append('q', formData.query.trim());
    }

    if (formData.location && formData.location !== 'all-kenya') {
      params.append('location', formData.location);
    }

    if (formData.category && formData.category !== 'all') {
      params.append('category', formData.category);
    }

    const searchUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
    router.push(searchUrl);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearch}>
      <div className="row align-items-start justify-content-center">
        <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12">
          <div className="heroSearch rounded-search style-01">
            <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">

              {/* Search Query Input with Autocomplete */}
              <div className="col-xl-4 col-lg-3 col-md-12 col-sm-12">
                <div className="form-group position-relative" ref={searchInputRef}>
                  <input
                    type="text"
                    className="form-control fs-6 fw-medium border-0 ps-md-2"
                    placeholder="What are you looking for?"
                    value={formData.query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
                    <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 1000, top: '100%' }}>
                      {isLoadingSuggestions ? (
                        <div className="p-3 text-center text-muted">
                          <small>Searching...</small>
                        </div>
                      ) : (
                        suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 border-bottom cursor-pointer hover-bg-light"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                {suggestion.type === 'business' ? (
                                  <BiSearch className="text-muted" size={14} />
                                ) : (
                                  <span className="badge badge-xs bg-light text-dark">{suggestion.category}</span>
                                )}
                              </div>
                              <div className="flex-grow-1">
                                <small className="text-dark">{suggestion.title}</small>
                                {suggestion.type === 'business' && (
                                  <div>
                                    <small className="text-muted">{suggestion.category}</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Input with Fixed Icon */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 side-border">
                <div className="form-group position-relative">
                  <Select
                    placeholder="Location"
                    options={locationOptions}
                    className="location-select"
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                    onChange={(selectedOption: any) =>
                      setFormData(prev => ({ ...prev, location: selectedOption?.value || '' }))
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: 'none',
                        boxShadow: 'none',
                        minHeight: '48px',
                        paddingRight: '40px', // Make room for the icon
                        backgroundColor: 'transparent',
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '8px 12px',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#6c757d',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#495057',
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        display: 'none', // Hide default dropdown indicator
                      }),
                    }}
                  />
                  {/* Fixed location icon */}
                  <div className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ pointerEvents: 'none' }}>
                    <FaLocationDot className="text-muted opacity-75" style={{ fontSize: '16px' }} />
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="form-group fw-medium lights-bg no-border">
                  <div className="selects">
                    <Select
                      placeholder="All Categories"
                      options={categoryOptions}
                      className="categories form-control border-0"
                      classNamePrefix="react-select"
                      onChange={handleCategoryChange}
                      isClearable
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: 'none',
                          boxShadow: 'none',
                          minHeight: '48px',
                          backgroundColor: 'transparent',
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: '8px 12px',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#6c757d',
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="col-xl-2 col-lg-3 col-md-12 col-sm-12">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill full-width fw-medium"
                    style={{ minHeight: '48px' }}
                  >
                    <BiSearch className="me-2" />Search
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>
  )
}