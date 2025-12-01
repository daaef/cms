import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: false,
      admin: {
        description: 'Author first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
      admin: {
        description: 'Author last name',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Job title or role (e.g., "Senior Robotics Engineer")',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short biography about the user',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Profile picture',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          required: false,
        },
        {
          name: 'linkedin',
          type: 'text',
          required: false,
        },
        {
          name: 'github',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}
