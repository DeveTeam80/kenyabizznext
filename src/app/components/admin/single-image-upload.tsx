// src/app/components/admin/single-image-upload.tsx
import React from 'react'
import CloudinaryUpload from './CloudinaryUpload'

interface SingleImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function SingleImageUpload({ value, onChange, label = 'Image' }: SingleImageUploadProps) {
  return (
    <CloudinaryUpload
      value={value}
      onChange={onChange}
      imageType="contentBlockImages"
      label={label}
      folder="content-blocks"
    />
  )
}