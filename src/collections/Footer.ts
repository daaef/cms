import { CollectionConfig } from 'payload';

export const Footer: CollectionConfig = {
  slug: 'footer',
  labels: {
    singular: 'Footer',
    plural: 'Footer',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Manage footer content',
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
      defaultValue: 'Main Footer',
      admin: {
        description: 'Internal identifier for this footer configuration',
      },
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Japanese', value: 'ja' },
      ],
    },
    {
      name: 'branding',
      type: 'group',
      label: 'Logo & Tagline',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'logoPath',
          type: 'text',
          defaultValue: '/logo.png',
          admin: {
            description: 'Fallback logo path',
          },
        },
        {
          name: 'logoAlt',
          type: 'text',
          defaultValue: 'Fainzy',
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Pioneering the New Normal',
        },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Footer Sections',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            description: 'Section heading (e.g., "Main Pages", "Business", "Social")',
          },
        },
        {
          name: 'columns',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Number of columns for this section (1 or 2)',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
            {
              name: 'isExternal',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open in new tab',
              },
            },
            {
              name: 'icon',
              type: 'select',
              required: false,
              options: [
                { label: 'None', value: '' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
              admin: {
                description: 'Optional icon for social links',
              },
            },
            {
              name: 'column',
              type: 'number',
              defaultValue: 1,
              admin: {
                description: 'Column number (1 or 2) for multi-column sections',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Section display order',
          },
        },
      ],
    },
    {
      name: 'bottomSection',
      type: 'group',
      label: 'Bottom Section',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: 'Copyright © 2025 Fainzy Technologies LTD. All rights reserved',
        },
        {
          name: 'showCookieBanner',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Set as active footer configuration',
      },
    },
  ],
};
