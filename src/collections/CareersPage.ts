import type { CollectionConfig } from 'payload';

export const CareersPage: CollectionConfig = {
  slug: 'careers-page',
  admin: {
    useAsTitle: 'title',
    description: 'Manage the Careers page content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Careers Page',
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
          name: 'subtitle',
          type: 'textarea',
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // Intro Section
    {
      name: 'introSection',
      type: 'group',
      label: 'Intro Section',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },

    // Departments Section
    {
      name: 'departmentsSection',
      type: 'group',
      label: 'Departments Section',
      fields: [
        {
          name: 'departments',
          type: 'array',
          label: 'Departments',
          minRows: 1,
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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
          ],
        },
        {
          name: 'ctaButtonText',
          type: 'text',
          required: false,
        },
      ],
    },

    // Our Mission Section
    {
      name: 'missionSection',
      type: 'group',
      label: 'Our Mission Section',
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // World-Class Facilities Section
    {
      name: 'facilitiesSection',
      type: 'group',
      label: 'World-Class Facilities Section',
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
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // Benefits & Perks Section
    {
      name: 'benefitsSection',
      type: 'group',
      label: 'Benefits & Perks Section',
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
        {
          name: 'benefits',
          type: 'array',
          label: 'Benefits List',
          minRows: 1,
          fields: [
            {
              name: 'benefit',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // Innovation at Scale Section
    {
      name: 'innovationSection',
      type: 'group',
      label: 'Innovation at Scale Section',
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // Continuous Growth Section
    {
      name: 'growthSection',
      type: 'group',
      label: 'Continuous Growth Section',
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // People Image Section
    {
      name: 'peopleImageSection',
      type: 'group',
      label: 'People Image Section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // Ready to Join CTA Section
    {
      name: 'ctaSection',
      type: 'group',
      label: 'Ready to Join CTA Section',
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
        {
          name: 'buttonText',
          type: 'text',
          required: false,
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
