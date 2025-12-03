// collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'video/*'],
    crop: true,
    focalPoint: true,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const uploadEditsRaw = req.query?.uploadEdits

        // In Payload v3 this may come as a JSON string depending on how the admin sends it
        let uploadEdits: any
        if (typeof uploadEditsRaw === 'string') {
          try {
            uploadEdits = JSON.parse(uploadEditsRaw)
          } catch {
            uploadEdits = undefined
          }
        } else {
          uploadEdits = uploadEditsRaw
        }

        const crop = uploadEdits?.crop
        if (!crop) return data

        const cropPercentages = {
          x: Math.round(crop.x ?? 0),
          y: Math.round(crop.y ?? 0),
          width: Math.round(crop.width ?? 100),
          height: Math.round(crop.height ?? 100),
        }

        data.cropData = cropPercentages

        if (typeof data.url === 'string' && data.url.includes('cloudinary.com')) {
          const { x, y, width, height } = cropPercentages

          const xDecimal = (x / 100).toFixed(2)
          const yDecimal = (y / 100).toFixed(2)
          const wDecimal = (width / 100).toFixed(2)
          const hDecimal = (height / 100).toFixed(2)

          const transformations =
            `c_crop,fl_relative,x_${xDecimal},y_${yDecimal},w_${wDecimal},h_${hDecimal}`

          const parts = data.url.split('/upload/')
          if (parts.length === 2) {
            data.croppedUrl = `${parts[0]}/upload/${transformations}/${parts[1]}`
          }
        }

        // NOTE: do NOT touch data.filename / data.public_id / data.url
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
        { name: 'x', type: 'number' },
        { name: 'y', type: 'number' },
        { name: 'width', type: 'number' },
        { name: 'height', type: 'number' },
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