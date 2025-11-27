import { CollectionConfig } from 'payload';

export const ProductsPage: CollectionConfig = {
    slug: 'products-page',
    labels: {
        singular: 'Products Page',
        plural: 'Products Pages',
    },
    admin: {
        useAsTitle: 'title',
        description: 'Manage the products page content',
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
            defaultValue: 'Products Page',
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
                    name: 'bannerImage',
                    type: 'upload',
                    relationTo: 'media',
                    required: false,
                },
            ],
        },
        // Main Products
        {
            name: 'products',
            type: 'array',
            label: 'Main Products',
            minRows: 1,
            fields: [
                {
                    name: 'id',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Unique identifier for anchor links (e.g., "zibot", "glide")',
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
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: false,
                },
                {
                    name: 'link',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'reverse',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Reverse layout (image on right)',
                    },
                },
                {
                    name: 'features',
                    type: 'array',
                    label: 'Product Features',
                    minRows: 2,
                    maxRows: 6,
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'subtitle',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'icon',
                            type: 'select',
                            required: true,
                            options: [
                                { label: 'Clock', value: 'Clock' },
                                { label: 'Dollar Sign', value: 'DollarSign' },
                                { label: 'Leaf', value: 'Leaf' },
                                { label: 'Shield', value: 'Shield' },
                                { label: 'Package', value: 'Package' },
                                { label: 'Check Circle', value: 'CheckCircle' },
                                { label: 'Utensils', value: 'UtensilsCrossed' },
                                { label: 'Hotel', value: 'Hotel' },
                            ],
                        },
                    ],
                },
            ],
        },
        // Custom Solutions
        {
            name: 'customSolutions',
            type: 'array',
            label: 'Custom Solutions',
            fields: [
                {
                    name: 'id',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Unique identifier (e.g., "customized-robots", "iot-solutions")',
                    },
                },
                {
                    name: 'category',
                    type: 'text',
                    required: true,
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
                    name: 'images',
                    type: 'array',
                    label: 'Images',
                    minRows: 1,
                    fields: [
                        {
                            name: 'image',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'features',
                    type: 'array',
                    label: 'Features',
                    minRows: 2,
                    maxRows: 6,
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'subtitle',
                            type: 'text',
                            required: true,
                        },
                    ],
                },
            ],
        },
        // CTA Section
        {
            name: 'ctaSection',
            type: 'group',
            label: 'Call-to-Action Section',
            fields: [
                {
                    name: 'text',
                    type: 'text',
                    required: true,
                    defaultValue: 'Explore Custom Solutions',
                },
                {
                    name: 'link',
                    type: 'text',
                    required: true,
                    defaultValue: '/custom-solutions',
                },
            ],
        },
        // FAQ Section
        {
            name: 'faqs',
            type: 'array',
            label: 'Frequently Asked Questions',
            fields: [
                {
                    name: 'question',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'answer',
                    type: 'textarea',
                    required: true,
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
                    name: 'order',
                    type: 'number',
                    defaultValue: 0,
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
