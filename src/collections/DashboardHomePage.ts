import { CollectionConfig } from 'payload';

export const DashboardHomePage: CollectionConfig = {
  slug: 'dashboard-home-page',
  labels: {
    singular: 'Dashboard Home Page',
    plural: 'Dashboard Home Pages',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Manage the Dashboard home page content',
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
      defaultValue: 'Dashboard Home Page',
    },

    // Hero Section
    {
      name: 'heroSection',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'badgeText',
          type: 'text',
          required: true,
          admin: {
            description: 'Text for the badge above the title',
          },
        },
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
          name: 'primaryButtonText',
          type: 'text',
          required: true,
          defaultValue: 'Get Started',
        },
        {
          name: 'primaryButtonLink',
          type: 'text',
          required: false,
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          required: true,
          defaultValue: 'Our Products & Services',
        },
        {
          name: 'secondaryButtonLink',
          type: 'text',
          required: false,
        },
        {
          name: 'footerText',
          type: 'text',
          required: false,
          admin: {
            description: 'Text below the buttons (e.g., "Already have a Fainzy Business account?")',
          },
        },
      ],
    },

    // Dashboard Preview Section
    {
      name: 'dashboardSection',
      type: 'group',
      label: 'Dashboard Preview Section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Dashboard preview image',
          },
        },
      ],
    },

    // Products & Services Section
    {
      name: 'productsSection',
      type: 'group',
      label: 'Products & Services Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Our Products & Services',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          required: false,
          admin: {
            description: 'Select products to display on the homepage',
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
