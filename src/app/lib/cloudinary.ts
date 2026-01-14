// src/app/lib/cloudinary.ts
// Cloudinary utilities for image management

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Extract public ID from Cloudinary URL
 * Example: https://res.cloudinary.com/xxx/image/upload/v1234/kenyabizz/logos/abc123.jpg
 * Returns: kenyabizz/logos/abc123
 */
export function extractPublicIdFromUrl(url: string | null | undefined): string | null {
    if (!url || !url.includes('cloudinary.com')) return null

    try {
        // Match pattern: /upload/v{version}/{public_id}.{extension}
        const match = url.match(/\/upload\/v\d+\/(.+)\.\w+$/)
        if (match && match[1]) {
            return match[1]
        }

        // Alternative pattern without version: /upload/{public_id}.{extension}
        const altMatch = url.match(/\/upload\/(.+)\.\w+$/)
        if (altMatch && altMatch[1]) {
            return altMatch[1]
        }

        return null
    } catch {
        return null
    }
}

/**
 * Delete an image from Cloudinary
 * Returns true if successful or if image doesn't exist
 */
export async function deleteCloudinaryImage(url: string | null | undefined): Promise<boolean> {
    const publicId = extractPublicIdFromUrl(url)

    if (!publicId) {
        console.log('No valid Cloudinary public ID found in URL:', url)
        return true // Not a Cloudinary URL, nothing to delete
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log(`Cloudinary delete result for ${publicId}:`, result)
        return result.result === 'ok' || result.result === 'not found'
    } catch (error) {
        console.error('Failed to delete Cloudinary image:', error)
        return false
    }
}

/**
 * Delete multiple Cloudinary images
 */
export async function deleteMultipleCloudinaryImages(urls: (string | null | undefined)[]): Promise<void> {
    const deletePromises = urls
        .filter(url => url && url.includes('cloudinary.com'))
        .map(url => deleteCloudinaryImage(url))

    await Promise.allSettled(deletePromises)
}

export { cloudinary }
