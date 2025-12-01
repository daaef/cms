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
      ({ data, req }) => {
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

          // Generate cropped URL using Cloudinary's relative/decimal syntax
          // Convert percentages to decimals: 24% = 0.24, 52% = 0.52
          if (data.url && typeof data.url === 'string' && data.url.includes('cloudinary.com')) {
            const { x, y, width, height } = cropPercentages
            // Convert to decimals (24 -> 0.24)
            const xDecimal = (x / 100).toFixed(2)
            const yDecimal = (y / 100).toFixed(2)
            const wDecimal = (width / 100).toFixed(2)
            const hDecimal = (height / 100).toFixed(2)
            
            const transformations = [`x_${xDecimal},y_${yDecimal},w_${wDecimal},h_${hDecimal},c_crop,fl_relative`]
            
            const parts = data.url.split('/upload/')
            if (parts.length === 2) {
              data.croppedUrl = `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
            }
          }
        }
        
        return data
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
