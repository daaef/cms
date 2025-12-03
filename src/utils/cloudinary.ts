/**
 * Cloudinary Image Transformation Utilities
 * 
 * Use these utilities to apply transformations to Cloudinary images
 * in your frontend application.
 */

interface CropData {
  x?: number
  y?: number
  width?: number
  height?: number
}

interface CloudinaryTransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'limit' | 'pad' | 'crop'
  gravity?: 'auto' | 'center' | 'face' | 'faces' | string
  quality?: number | 'auto'
  format?: string | 'auto'
  dpr?: number | 'auto'
  customCrop?: CropData
}

/**
 * Generates a Cloudinary URL with transformations applied
 * 
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Transformed Cloudinary URL
 * 
 * @example
 * // Basic resize
 * const resized = getCloudinaryUrl(originalUrl, { width: 800, height: 600, crop: 'fill' })
 * 
 * @example
 * // With custom crop coordinates from CMS
 * const cropped = getCloudinaryUrl(originalUrl, {
 *   customCrop: media.cropData,
 *   width: 1200,
 * })
 * 
 * @example
 * // Responsive with auto quality/format
 * const responsive = getCloudinaryUrl(originalUrl, {
 *   width: 'auto',
 *   dpr: 'auto',
 *   quality: 'auto',
 *   format: 'auto',
 * })
 */
export function getCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }
  console.log('Original URL in cloudinary.ts:', url)

  const transformations: string[] = []

  // Apply custom crop coordinates if provided
  if (options.customCrop) {
    const { x, y, width, height } = options.customCrop
    if (x !== undefined && y !== undefined && width && height) {
      transformations.push(`x_${x},y_${y},w_${width},h_${height},c_crop`)
    }
  }

  // Apply width
  if (options.width) {
    transformations.push(`w_${options.width}`)
  }

  // Apply height
  if (options.height) {
    transformations.push(`h_${options.height}`)
  }

  // Apply crop mode
  if (options.crop) {
    transformations.push(`c_${options.crop}`)
  }

  // Apply gravity/focal point
  if (options.gravity) {
    transformations.push(`g_${options.gravity}`)
  }

  // Apply quality
  if (options.quality) {
    transformations.push(`q_${options.quality}`)
  }

  // Apply format
  if (options.format) {
    transformations.push(`f_${options.format}`)
  }

  // Apply DPR (device pixel ratio)
  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`)
  }

  if (transformations.length === 0) {
    return url
  }

  // Insert transformations into the URL
  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{public_id}
  const parts = url.split('/upload/')
  if (parts.length !== 2) {
    return url
  }

  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
}

/**
 * Common transformation presets for easy use
 */
export const cloudinaryPresets = {
  thumbnail: (url: string, cropData?: CropData) =>
    getCloudinaryUrl(url, {
      width: 150,
      height: 150,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto',
      customCrop: cropData,
    }),

  card: (url: string, cropData?: CropData) =>
    getCloudinaryUrl(url, {
      width: 400,
      height: 300,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto',
      customCrop: cropData,
    }),

  hero: (url: string, cropData?: CropData) =>
    getCloudinaryUrl(url, {
      width: 1920,
      height: 1080,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto',
      customCrop: cropData,
    }),

  responsive: (url: string, width: number, cropData?: CropData) =>
    getCloudinaryUrl(url, {
      width,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
      dpr: 'auto',
      customCrop: cropData,
    }),

  avatar: (url: string, cropData?: CropData) =>
    getCloudinaryUrl(url, {
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto',
      customCrop: cropData,
    }),
}

/**
 * Type for media documents from PayloadCMS
 */
export interface MediaDocument {
  id: string
  alt: string
  url: string
  cropData?: CropData
  cloudinaryPublicId?: string
  cloudinaryVersion?: string
}

/**
 * Helper to get a transformed URL from a media document
 * 
 * @example
 * const imageUrl = getMediaUrl(media, { width: 800, height: 600, crop: 'fill' })
 */
export function getMediaUrl(
  media: MediaDocument | null | undefined,
  options: Omit<CloudinaryTransformOptions, 'customCrop'> = {}
): string {
  if (!media?.url) return ''
  console.log('Media document cloudinary.ts:', media)

  return getCloudinaryUrl(media.url, {
    ...options,
    customCrop: media.cropData,
  })
}
