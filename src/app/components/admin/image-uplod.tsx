// src/app/components/admin/image-uplod.tsx
'use client'

import React from 'react'
import CloudinaryUpload from './CloudinaryUpload'

interface ImageUploadProps {
  onLogoChange?: (url: string) => void
  onImageChange?: (url: string) => void
  onBannerChange?: (url: string) => void
  initialLogo?: string
  initialImage?: string
  initialBanner?: string
}

export default function ImageUpload({ 
  onLogoChange, 
  onImageChange, 
  onBannerChange,
  initialLogo,
  initialImage,
  initialBanner
}: ImageUploadProps) {
  
  return (
    <div className="card-body">
      <div className="row g-4">
        {/* Logo Upload */}
        <div className="col-lg-4 col-md-6">
          <CloudinaryUpload
            value={initialLogo || ''}
            onChange={(url) => onLogoChange?.(url)}
            imageType="logo"
            label="Business Logo"
            folder="logos"
          />
        </div>

        {/* Main Image Upload */}
        <div className="col-lg-4 col-md-6">
          <CloudinaryUpload
            value={initialImage || ''}
            onChange={(url) => onImageChange?.(url)}
            imageType="image"
            label="Main Listing Image"
            folder="main-images"
          />
        </div>

        {/* Banner Upload */}
        <div className="col-lg-4 col-md-12">
          <CloudinaryUpload
            value={initialBanner || ''}
            onChange={(url) => onBannerChange?.(url)}
            imageType="bannerImage"
            label="Banner Image"
            folder="banners"
          />
        </div>
      </div>
    </div>
  )
}