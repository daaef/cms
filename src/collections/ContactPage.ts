import { CollectionConfig } from 'payload';

export const ContactPage: CollectionConfig = {
  slug: 'contact-page',
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Pages',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Manage the Contact Us page content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Contact Page',
    },

    // Hero Section
    {
      name: 'heroSection',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },

    // Social Media Links
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
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
          name: 'instagram',
          type: 'text',
          required: false,
        },
      ],
    },

    // Contact Information
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'officeAddress',
          type: 'group',
          label: 'Office Address',
          fields: [
            {
              name: 'en',
              type: 'textarea',
              label: 'English',
              required: true,
            },
            {
              name: 'ja',
              type: 'textarea',
              label: 'Japanese',
              required: true,
            },
          ],
        },
      ],
    },

    // Map Location
    {
      name: 'mapLocation',
      type: 'group',
      label: 'Map Location',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          required: true,
          admin: {
            description: 'e.g., 35.157308228381325',
          },
        },
        {
          name: 'longitude',
          type: 'number',
          required: true,
          admin: {
            description: 'e.g., 136.96488391534322',
          },
        },
      ],
    },

    // SEO
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
          admin: {
            description: 'SEO title (recommended: 50-60 characters)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: false,
          admin: {
            description: 'SEO description (recommended: 150-160 characters)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          required: false,
          admin: {
            description: 'SEO keywords (comma-separated)',
          },
        },
      ],
    },
  ],
};
