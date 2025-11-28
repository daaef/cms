import type { CollectionConfig } from 'payload'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'cloudinaryId',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Only upload to Cloudinary when credentials are configured
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
          return doc
        }

        try {
          // Check if file exists locally and hasn't been uploaded to Cloudinary yet
          if (doc.filename && !doc.cloudinaryId) {
            const filePath = path.join(process.cwd(), 'media', doc.filename)

            if (fs.existsSync(filePath)) {
              // Upload to Cloudinary
              const result = await cloudinary.uploader.upload(filePath, {
                folder: 'fainzy-cms',
                public_id: doc.filename.split('.')[0],
                resource_type: 'auto',
              })

              // Update document with Cloudinary URL
              await req.payload.update({
                collection: 'media',
                id: doc.id,
                data: {
                  cloudinaryId: result.public_id,
                  url: result.secure_url,
                },
              })

              console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`)
            }
          }
        } catch (error) {
          console.error('❌ Error uploading to Cloudinary:', error)
        }

        return doc
      },
    ],
  },
}
