import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user, // Only authenticated users can upload
    update: ({ req: { user } }) => !!user, // Only authenticated users can update
    delete: ({ req: { user } }) => !!user, // Only authenticated users can delete
  },
  upload: {
    disableLocalStorage: true, // Required - Cloudinary handles all storage
    mimeTypes: ['image/*', 'video/*'],
    crop: true, // Enable PayloadCMS's built-in crop UI
    focalPoint: true, // Enable focal point selection
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // On CREATE: Save the original Cloudinary URL
        if (operation === 'create' && data.url && typeof data.url === 'string' && data.url.includes('cloudinary.com')) {
          // Store the original URL (before any crops)
          if (!data.originalUrl) {
            data.originalUrl = data.url
          }
        }

        // Capture crop coordinates from Payload's crop tool
        const uploadEdits = req.query?.uploadEdits as { crop?: { x?: number; y?: number; width?: number; height?: number } } | undefined

        if (uploadEdits?.crop) {
          // PayloadCMS provides crop coordinates as percentages (0-100)
          // Save them as-is for reference
          const cropPercentages = {
            x: Math.round(uploadEdits.crop.x || 0),
            y: Math.round(uploadEdits.crop.y || 0),
            width: Math.round(uploadEdits.crop.width || 100),
            height: Math.round(uploadEdits.crop.height || 100),
          }

          // Save percentage coordinates
          data.cropData = cropPercentages
          console.log('Crop percentages:', cropPercentages)

          // Use ORIGINAL URL for generating cropped URL (not the potentially already-cropped data.url)
          const baseUrl = data.originalUrl || data.url
          
          // Generate cropped URL using Cloudinary's relative/decimal syntax
          // Convert percentages to decimals: 24% = 0.24, 52% = 0.52
          if (baseUrl && typeof baseUrl === 'string' && baseUrl.includes('cloudinary.com')) {
            const { x, y, width, height } = cropPercentages
            // Convert to decimals (24 -> 0.24)
            const xDecimal = (x / 100).toFixed(2)
            const yDecimal = (y / 100).toFixed(2)
            const wDecimal = (width / 100).toFixed(2)
            const hDecimal = (height / 100).toFixed(2)

            const transformations = [`c_crop,fl_relative,x_${xDecimal},y_${yDecimal},w_${wDecimal},h_${hDecimal}`]
            console.log('Transformations:', transformations)
            
            const parts = baseUrl.split('/upload/')
            if (parts.length === 2) {
              data.croppedUrl = `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
              console.log('[Media Hook] Generated cropped URL:', {
                originalUrl: data.originalUrl,
                currentUrl: data.url,
                croppedUrl: data.croppedUrl
              })
            }
          }
        }

        console.log('data:', data)
        return data
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Log deletion attempt
        req.payload.logger.info(`[Media] Attempting to delete media ID: ${id}`)

        // The Cloudinary plugin will handle deletion
        // If it fails, this hook ensures the transaction isn't aborted
        try {
          // Cloudinary deletion is handled by the plugin automatically
          // This hook just ensures proper logging
          return true
        } catch (error) {
          req.payload.logger.error(`[Media] Error during media deletion: ${error instanceof Error ? error.message : String(error)}`)
          // Allow deletion to continue even if Cloudinary fails
          return true
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'originalUrl',
      type: 'text',
      label: 'Original Cloudinary URL',
      admin: {
        description: 'Original uncropped URL from Cloudinary',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'cropData',
      type: 'group',
      label: 'Crop Coordinates',
      admin: {
        description: 'Automatically filled when you use the crop tool above the image preview',
        readOnly: true,
      },
      fields: [
        {
          name: 'x',
          type: 'number',
          admin: {
            description: 'X coordinate (left position)',
          },
        },
        {
          name: 'y',
          type: 'number',
          admin: {
            description: 'Y coordinate (top position)',
          },
        },
        {
          name: 'width',
          type: 'number',
          admin: {
            description: 'Crop width',
          },
        },
        {
          name: 'height',
          type: 'number',
          admin: {
            description: 'Crop height',
          },
        },
      ],
    },
    {
      name: 'croppedUrl',
      type: 'text',
      label: 'Cropped URL',
      admin: {
        description: 'Auto-generated Cloudinary URL with crop transformations applied',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
