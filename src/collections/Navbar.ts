import { CollectionConfig } from 'payload';

export const Navbar: CollectionConfig = {
  slug: 'navbar',
  labels: {
    singular: 'Navbar',
    plural: 'Navbar',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Manage navigation bar content',
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
      defaultValue: 'Main Navigation',
      admin: {
        description: 'Internal identifier for this navbar configuration',
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
      name: 'logo',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'alt',
          type: 'text',
          defaultValue: 'Fainzy',
        },
        {
          name: 'href',
          type: 'text',
          defaultValue: '/',
        },
      ],
    },
    {
      name: 'mainLinks',
      type: 'array',
      label: 'Main Navigation Links',
      fields: [
        {
          name: 'name',
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
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'productsDropdown',
      type: 'group',
      label: 'Products Dropdown',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'PRODUCTS',
        },
        {
          name: 'productsPageRef',
          type: 'relationship',
          relationTo: 'products-page',
          required: false,
          label: 'Products Page Reference',
          admin: {
            description: 'Link to Products Page - products will be pulled from here',
          },
        },
        {
          name: 'mainProducts',
          type: 'array',
          label: 'Main Products (Top Section) - Override',
          admin: {
            description: 'Optional: Override products from Products Page. Leave empty to use Products Page data.',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'imagePath',
              type: 'text',
              required: false,
              admin: {
                description: 'Fallback image path if no media upload',
              },
            },
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'customSolutionsPageRef',
          type: 'relationship',
          relationTo: 'products-page',
          required: false,
          label: 'Custom Solutions Page Reference',
          admin: {
            description: 'Link to Products Page - custom solutions will be pulled from here',
          },
        },
        {
          name: 'customSolutions',
          type: 'array',
          label: 'Custom Solutions (Bottom Section) - Override',
          admin: {
            description: 'Optional: Override custom solutions from Products Page. Leave empty to use Products Page data.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'imagePath',
              type: 'text',
              required: false,
              admin: {
                description: 'Fallback image path',
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
          name: 'sidebarLinks',
          type: 'array',
          label: 'Sidebar Links (More Section)',
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
              name: 'order',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'contactButton',
          type: 'group',
          label: 'Contact Us Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Contact Us',
            },
            {
              name: 'href',
              type: 'text',
              defaultValue: '/custom-solutions#contact',
            },
          ],
        },
      ],
    },
    {
      name: 'rightSection',
      type: 'group',
      label: 'Right Section Icons',
      fields: [
        {
          name: 'supportLink',
          type: 'text',
          defaultValue: 'https://dashboard-v2-inky.vercel.app/support',
        },
        {
          name: 'loginLink',
          type: 'text',
          defaultValue: 'https://dashboard-v2-inky.vercel.app/login',
        },
        {
          name: 'languages',
          type: 'array',
          label: 'Available Languages',
          fields: [
            {
              name: 'code',
              type: 'text',
              required: true,
              admin: {
                description: 'Language code (e.g., "en", "ja")',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Display name (e.g., "English", "日本語")',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Set as active navbar configuration',
      },
    },
  ],
};
