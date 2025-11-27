import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    description: 'Manage products and services',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name (e.g., "ZiBot & Glide")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Category badge (e.g., "Robotics", "Consultancy")',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display title for the product',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: false,
          admin: {
            description: 'Optional label overlay (e.g., "ZiBot", "Glide")',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Product Features',
      fields: [
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: {
            description: 'Emoji icon (e.g., "🤖", "🛴")',
          },
        },
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
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      required: false,
      defaultValue: 'Get Started',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Button Link',
      required: false,
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'image-right',
      options: [
        { label: 'Image Right', value: 'image-right' },
        { label: 'Image Left', value: 'image-left' },
        { label: 'Image Grid', value: 'image-grid' },
      ],
      admin: {
        description: 'Layout configuration for the product display',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
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
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show/hide this product',
      },
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
