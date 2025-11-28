import type { CollectionConfig } from 'payload'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
  timeout: 60000, // 60 second timeout
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
    {
      name: 'cloudinaryUrl',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc }) => {
        if (doc && doc.cloudinaryUrl) {
          doc.url = doc.cloudinaryUrl
        }
        return doc
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        console.log('🔔 afterChange hook triggered:', {
          operation,
          filename: doc.filename,
          cloudinaryId: doc.cloudinaryId,
          hasCloudinaryConfig: !!process.env.CLOUDINARY_CLOUD_NAME
        })

        // Only upload to Cloudinary when credentials are configured
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
          console.log('⚠️ Cloudinary not configured, skipping upload')
          return doc
        }

        // Only process on create operations if file hasn't been uploaded to Cloudinary yet
        if (operation === 'create' && doc.filename && !doc.cloudinaryId) {
          // Capture necessary data before async operation
          const docId = doc.id
          const filename = doc.filename
          
          // Run Cloudinary upload in background to avoid blocking the response
          // This prevents transaction conflicts with the just-created document
          setImmediate(async () => {
            try {
              const filePath = path.join(process.cwd(), 'media', filename)

              console.log(`📤 Attempting to upload to Cloudinary: ${filePath}`)

              // Wait for file to be written to disk
              await new Promise(resolve => setTimeout(resolve, 1000))

              if (fs.existsSync(filePath)) {
                // Sanitize filename for Cloudinary public_id
                // Only remove special characters that Cloudinary doesn't allow
                const sanitizedName = filename
                  .split('.')[0]
                  .replace(/[^a-zA-Z0-9-_.]/g, '_')
                  .substring(0, 255) // Cloudinary public_id max length

                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(filePath, {
                  folder: 'fainzy-cms',
                  public_id: sanitizedName,
                  resource_type: 'auto',
                  use_filename: true,
                  unique_filename: true, // Prevent overwrites
                  overwrite: false, // Don't overwrite existing files
                })

                console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`)

                // Update document with Cloudinary URL and ID
                // Get a fresh Payload instance to avoid using stale req object
                const { getPayload } = await import('payload')
                const { default: configPromise } = await import('@payload-config')
                const payload = await getPayload({ config: configPromise })

                const updateData = {
                  cloudinaryId: result.public_id,
                  cloudinaryUrl: result.secure_url,
                }

                console.log(`🔄 Updating document ${docId} with:`, updateData)

                const updated = await payload.update({
                  collection: 'media',
                  id: docId,
                  data: updateData,
                  depth: 0,
                })

                console.log(`✅ Updated document with Cloudinary URL:`, {
                  id: updated.id,
                  cloudinaryId: updated.cloudinaryId,
                })
              } else {
                console.error(`❌ File not found at: ${filePath}`)
              }
            } catch (error) {
              console.error('❌ Error uploading to Cloudinary:', error)
              if (error instanceof Error) {
                console.error('Error details:', error.message)
                console.error('Stack:', error.stack)
              }
            }
          })
        }

        return doc
      },
    ],
  },
}
