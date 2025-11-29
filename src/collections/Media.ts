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
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
