import type { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    description: 'Manage blog posts',
    defaultColumns: ['title', 'category', 'publishedDate', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Business', value: 'business' },
        { label: 'Technology', value: 'technology' },
        { label: 'Case Study', value: 'case-study' },
        { label: 'Careers', value: 'careers' },
        { label: 'Sustainability', value: 'sustainability' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description or excerpt for the blog post',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'readTime',
      type: 'text',
      required: false,
      admin: {
        description: 'e.g., "5 min read"',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark this post as featured (shown prominently on blog page)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: false,
      admin: {
        description: 'Full blog post content',
      },
    },
    {
      name: 'views',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Number of views (auto-incremented)',
      },
    },
    {
      name: 'likes',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Number of likes',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        description: 'Select the author from registered users',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: false,
        },
        {
          name: 'keywords',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
};
