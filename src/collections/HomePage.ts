import { CollectionConfig } from 'payload';

export const HomePage: CollectionConfig = {
    slug: 'home-page',
    labels: {
        singular: 'Home Page',
        plural: 'Home Pages',
    },
    admin: {
        useAsTitle: 'title',
        description: 'Manage the home page content',
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
            defaultValue: 'Home Page',
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
        // Hero Carousel Slides
        {
            name: 'heroSlides',
            type: 'array',
            label: 'Hero Carousel Slides',
            minRows: 1,
            maxRows: 10,
            fields: [
                {
                    name: 'type',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'ZiBot', value: 'zibot' },
                        { label: 'Glide', value: 'glide' },
                        { label: 'Consultancy', value: 'consultancy' },
                        { label: 'Custom', value: 'custom' },
                    ],
                },
                {
                    name: 'title',
                    type: 'text',
                    admin: {
                        condition: (data, siblingData) => siblingData.type === 'custom',
                    },
                },
                {
                    name: 'subtitle',
                    type: 'text',
                },
                {
                    name: 'cursiveText',
                    type: 'text',
                    label: 'Cursive Text',
                },
                {
                    name: 'image',
                    type: 'text',
                    label: 'Image Path',
                    required: true,
                },
                {
                    name: 'ctaText',
                    type: 'text',
                    label: 'CTA Button Text',
                    defaultValue: 'Learn More',
                },
                {
                    name: 'ctaLink',
                    type: 'text',
                    label: 'CTA Link',
                },
            ],
        },
        // Video Section
        {
            name: 'videoSection',
            type: 'group',
            label: 'Video Section',
            fields: [
                {
                    name: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                },
                {
                    name: 'videoUrl',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'posterImage',
                    type: 'text',
                    admin: {
                        description: 'Optional poster image for video',
                    },
                },
            ],
        },
        // About Section
        {
            name: 'aboutSection',
            type: 'group',
            label: 'About Section',
            fields: [
                {
                    name: 'foundation',
                    type: 'group',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            defaultValue: 'Our Foundation',
                        },
                        {
                            name: 'title',
                            type: 'textarea',
                            required: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            required: true,
                        },
                        {
                            name: 'ctaText',
                            type: 'text',
                            defaultValue: 'Get Started',
                        },
                        {
                            name: 'ctaLink',
                            type: 'text',
                            defaultValue: '#',
                        },
                    ],
                },
                {
                    name: 'purpose',
                    type: 'group',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            defaultValue: 'Purpose',
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
                            type: 'text',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'vision',
                    type: 'group',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            defaultValue: 'Vision',
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
                            type: 'text',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'mission',
                    type: 'group',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            defaultValue: 'Mission',
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
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'highlights',
                            type: 'array',
                            maxRows: 4,
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
            ],
        },
        // Products Section
        {
            name: 'products',
            type: 'array',
            label: 'Products',
            minRows: 1,
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
                    type: 'text',
                    required: true,
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
                        description: 'Reverse layout (image on left)',
                    },
                },
                {
                    name: 'features',
                    type: 'array',
                    minRows: 2,
                    maxRows: 4,
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
                    fields: [
                        {
                            name: 'src',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'alt',
                            type: 'text',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'features',
                    type: 'array',
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
        // Metrics Section
        {
            name: 'metricsSection',
            type: 'group',
            label: 'Metrics Section',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: "We'll keep making impact",
                },
                {
                    name: 'subtitle',
                    type: 'text',
                    defaultValue: 'Transforming industries with autonomous robotics technology',
                },
                {
                    name: 'animatedStats',
                    type: 'array',
                    label: 'Animated Statistics',
                    fields: [
                        {
                            name: 'value',
                            type: 'number',
                            required: true,
                        },
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'icon',
                            type: 'select',
                            required: true,
                            options: [
                                { label: 'Package', value: 'Package' },
                                { label: 'Utensils', value: 'UtensilsCrossed' },
                                { label: 'Hotel', value: 'Hotel' },
                                { label: 'Map Pin', value: 'MapPin' },
                                { label: 'Globe', value: 'Globe2' },
                                { label: 'Check Circle', value: 'CheckCircle' },
                            ],
                        },
                    ],
                },
                {
                    name: 'staticStats',
                    type: 'array',
                    label: 'Static Statistics',
                    fields: [
                        {
                            name: 'value',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'icon',
                            type: 'select',
                            required: true,
                            options: [
                                { label: 'Map Pin', value: 'MapPin' },
                                { label: 'Globe', value: 'Globe2' },
                                { label: 'Check Circle', value: 'CheckCircle' },
                            ],
                        },
                    ],
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
    ],
};