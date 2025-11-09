// src/app/components/admin/cloudinary-upload.tsx
'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsPatchPlus, BsCheckCircle, BsExclamationCircle, BsTrash } from 'react-icons/bs'
import { IMAGE_SPECS, validateImageDimensions, validateImageSize, validateImageType, formatFileSize } from '@/app/lib/image-specs'

interface CloudinaryUploadProps {
  value: string
  onChange: (url: string) => void
  imageType: keyof typeof IMAGE_SPECS
  label: string
  folder?: string
}

interface UploadedImage {
  url: string
  fileName: string
  size: number
  width: number
  height: number
  uploading?: boolean
  error?: string
}

export default function CloudinaryUpload({ 
  value, 
  onChange, 
  imageType,
  label,
  folder = 'listings'
}: CloudinaryUploadProps) {
  
  const [image, setImage] = useState<UploadedImage | null>(
    value ? { url: value, fileName: 'existing', size: 0, width: 0, height: 0 } : null
  )

  const uploadToCloudinary = async (file: File): Promise<UploadedImage> => {
    // Client-side validation first
    const typeValidation = validateImageType(file.type, imageType)
    if (!typeValidation.valid) {
      throw new Error(typeValidation.error)
    }

    const sizeValidation = validateImageSize(file.size, imageType)
    if (!sizeValidation.valid) {
      throw new Error(sizeValidation.error)
    }

    // Get image dimensions
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()
      
      reader.onload = (e) => {
        img.src = e.target?.result as string
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.onerror = () => reject(new Error('Failed to load image'))
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

    const dimensionValidation = validateImageDimensions(
      dimensions.width,
      dimensions.height,
      imageType
    )
    
    if (!dimensionValidation.valid) {
      throw new Error(dimensionValidation.error)
    }

    // Upload to Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const data = await response.json()
    
    return {
      url: data.url,
      fileName: file.name,
      size: data.bytes,
      width: data.width,
      height: data.height,
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // Show uploading state
    setImage({
      url: '',
      fileName: file.name,
      size: file.size,
      width: 0,
      height: 0,
      uploading: true,
    })

    try {
      const uploadedImage = await uploadToCloudinary(file)
      setImage(uploadedImage)
      onChange(uploadedImage.url)
    } catch (error: any) {
      setImage({
        url: '',
        fileName: file.name,
        size: file.size,
        width: 0,
        height: 0,
        error: error.message,
      })
    }
  }, [onChange, imageType, folder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: IMAGE_SPECS[imageType].maxSizeBytes,
  })

  const handleRemove = () => {
    setImage(null)
    onChange('')
  }

  const specs = IMAGE_SPECS[imageType]

  return (
    <div>
      <label className="lableTitle mb-2">{label}</label>
      
      {!image || image.error ? (
        <div {...getRootProps()} className={`dropzone dz-clickable p-4 ${image?.error ? 'border-danger' : isDragActive ? 'border-primary' : ''}`}>
          <input {...getInputProps()} />
          {image?.error ? (
            <div className="text-center">
              <BsExclamationCircle className="fs-2 mb-3 text-danger" />
              <p className="text-danger mb-2">{image.error}</p>
              <p className="text-sm text-muted">{image.fileName}</p>
              <button 
                type="button" 
                className="btn btn-sm btn-light-primary mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setImage(null)
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <BsPatchPlus className='fs-2 mb-3 text-muted'/>
              </div>
              <p className="text-center text-muted mb-2">
                {isDragActive ? 'Drop image here...' : `Drop ${label.toLowerCase()} here or click to upload`}
              </p>
              <p className="text-center text-sm text-muted mb-0">
                {specs.dimensions.recommended.width}x{specs.dimensions.recommended.height}px recommended
              </p>
            </>
          )}
        </div>
      ) : image.uploading ? (
        <div className="dropzone p-4 border-primary">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="text-muted mb-0">Uploading...</p>
          </div>
        </div>
      ) : (
        <div className="position-relative">
          {/* 🔧 FIXED: Proper aspect ratio container for preview */}
          <div 
            style={{ 
              maxWidth: '400px',
              width: '100%',
              aspectRatio: '16/9',
              overflow: 'hidden',
              borderRadius: '8px',
              position: 'relative'
            }}
          >
            <img 
              src={image.url} 
              alt={label} 
              className="img-fluid" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          </div>
          
          {/* Action buttons overlay */}
          <div className="position-absolute top-0 end-0 p-2 d-flex gap-2" style={{ right: '0' }}>
            <div className="square--40 circle bg-success text-white d-flex align-items-center justify-content-center shadow">
              <BsCheckCircle size={20} />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="square--40 circle bg-danger text-white border-0 d-flex align-items-center justify-content-center shadow"
              title="Remove image"
            >
              <BsTrash size={16} />
            </button>
          </div>
          
          {/* Image info */}
          {image.width > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted mb-0">
                {image.fileName} · {image.width}x{image.height}px · {formatFileSize(image.size)}
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-2">
        <p className="smart-text text-sm text-muted mb-0">
          <strong>Max size:</strong> {specs.maxSizeMB}MB · 
          <strong> Min:</strong> {specs.dimensions.min.width}x{specs.dimensions.min.height}px · 
          <strong> Format:</strong> JPG, PNG, WebP
        </p>
      </div>
    </div>
  )
}