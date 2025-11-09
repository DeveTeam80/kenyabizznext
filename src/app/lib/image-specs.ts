// src/app/lib/image-specs.ts

export const IMAGE_SPECS = {
  logo: {
    name: 'Business Logo',
    description: 'Square logo for your business',
    dimensions: {
      min: { width: 200, height: 200 },
      max: { width: 1000, height: 1000 },
      recommended: { width: 250, height: 250 }, // 🆕 Updated from 500x500
      aspectRatio: '1:1', // Square
    },
    maxSizeMB: 2,
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    usage: 'Displayed in listing cards, search results, and as profile picture',
  },
  
  image: {
    name: 'Main Listing Image',
    description: 'Primary thumbnail/preview image for grid pages',
    dimensions: {
      min: { width: 400, height: 267 }, // Minimum to maintain quality
      max: { width: 2000, height: 1334 },
      recommended: { width: 510, height: 340 }, 
      aspectRatio: '3:2', // 🆕 Updated from 4:3
    },
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    usage: 'Main image shown on listing cards and grid view',
  },
  
  bannerImage: {
    name: 'Banner Image',
    description: 'Wide cover image for listing detail page',
    dimensions: {
      min: { width: 1200, height: 338 }, // Minimum to maintain quality
      max: { width: 3840, height: 1080 },
      recommended: { width: 1920, height: 540 }, // 🆕 Updated from 1920x600
      aspectRatio: '32:9', // 🆕 Updated from 16:5 (ultra-wide)
    },
    maxSizeMB: 8,
    maxSizeBytes: 8 * 1024 * 1024, // 8MB
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    usage: 'Hero banner on listing detail page',
  },
  
  contentBlockImages: { // 🆕 Renamed from galleryImages
    name: 'Content Block Images',
    description: 'Images for content sections (projects, products, facilities)',
    dimensions: {
      min: { width: 400, height: 232 },
      max: { width: 2200, height: 1280 },
      recommended: { width: 550, height: 320 }, // 🆕 Updated from 1200x900
      aspectRatio: '55:32', // Approximately 1.72:1
    },
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB per image
    maxCount: 10, // Maximum 10 content block images
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    usage: 'Content gallery in listing details (Our Projects, Our Products, etc.)',
  },
} as const

// Helper function to validate image dimensions
export function validateImageDimensions(
  width: number,
  height: number,
  imageType: keyof typeof IMAGE_SPECS
): { valid: boolean; error?: string } {
  const specs = IMAGE_SPECS[imageType]
  
  if (width < specs.dimensions.min.width || height < specs.dimensions.min.height) {
    return {
      valid: false,
      error: `${specs.name} must be at least ${specs.dimensions.min.width}x${specs.dimensions.min.height}px. Your image is ${width}x${height}px.`,
    }
  }
  
  if (width > specs.dimensions.max.width || height > specs.dimensions.max.height) {
    return {
      valid: false,
      error: `${specs.name} must not exceed ${specs.dimensions.max.width}x${specs.dimensions.max.height}px. Your image is ${width}x${height}px.`,
    }
  }
  
  return { valid: true }
}

// Helper function to validate file size
export function validateImageSize(
  sizeBytes: number,
  imageType: keyof typeof IMAGE_SPECS
): { valid: boolean; error?: string } {
  const specs = IMAGE_SPECS[imageType]
  
  if (sizeBytes > specs.maxSizeBytes) {
    const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2)
    return {
      valid: false,
      error: `${specs.name} must not exceed ${specs.maxSizeMB}MB. Your file is ${sizeMB}MB.`,
    }
  }
  
  return { valid: true }
}

// Helper function to validate file type
export function validateImageType(
  mimeType: string,
  imageType: keyof typeof IMAGE_SPECS
): { valid: boolean; error?: string } {
  const specs = IMAGE_SPECS[imageType]
  
  if (!specs.formats.includes(mimeType as any)) {
    return {
      valid: false,
      error: `${specs.name} must be one of: ${specs.formats.join(', ')}. You uploaded: ${mimeType}`,
    }
  }
  
  return { valid: true }
}

// Helper to format bytes to human readable
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}