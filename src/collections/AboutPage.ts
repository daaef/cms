import { CollectionConfig } from 'payload';

export const AboutPage: CollectionConfig = {
    slug: 'about-page',
    labels: {
        singular: 'About Page',
        plural: 'About Pages',
    },
    admin: {
        useAsTitle: 'title',
        description: 'Manage the about page content',
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
            defaultValue: 'About Page',
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
                    defaultValue: 'About Us',
                },
                {
                    name: 'subtitle',
                    type: 'text',
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
        // Founded Section
        {
            name: 'foundedSection',
            type: 'group',
            label: 'Founded Section',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'paragraphs',
                    type: 'array',
                    label: 'Content Paragraphs',
                    minRows: 1,
                    maxRows: 10,
                    fields: [
                        {
                            name: 'text',
                            type: 'textarea',
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
        // People Banner Section
        {
            name: 'peopleBannerSection',
            type: 'group',
            label: 'People Banner Section',
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
                    name: 'bannerImage',
                    type: 'upload',
                    relationTo: 'media',
                    required: false,
                },
            ],
        },
        // Vision Section
        {
            name: 'visionSection',
            type: 'group',
            label: 'Vision Section',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'paragraphs',
                    type: 'array',
                    label: 'Content Paragraphs',
                    minRows: 1,
                    maxRows: 10,
                    fields: [
                        {
                            name: 'text',
                            type: 'textarea',
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
        // Leadership Section
        {
            name: 'leadershipSection',
            type: 'group',
            label: 'Leadership Section',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    defaultValue: 'Our leadership',
                },
                {
                    name: 'subtitle',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'teamMembers',
                    type: 'array',
                    label: 'Team Members',
                    minRows: 1,
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'role',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'imageUrl',
                            type: 'upload',
                            relationTo: 'media',
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
                    name: 'bannerImage',
                    type: 'upload',
                    relationTo: 'media',
                    required: false,
                },
                {
                    name: 'buttons',
                    type: 'array',
                    label: 'CTA Buttons',
                    minRows: 1,
                    maxRows: 3,
                    fields: [
                        {
                            name: 'text',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'link',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'variant',
                            type: 'select',
                            required: true,
                            defaultValue: 'primary',
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Outline', value: 'outline' },
                            ],
                        },
                    ],
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
