import { Payload } from 'payload';

/**
 * Media Mapper Utility
 *
 * Maps image paths from JSON seed data to Media collection IDs
 */

// Mapping of image paths to filenames in media collection
const pathToFilenameMap: Record<string, string> = {
    // Home page
    '/slides/zibot.png': 'zibot-slide.png',
    '/slides/glide.png': 'glide-slide.png',
    '/slides/consultancy.png': 'consultancy-slide.png',
    '/purpose.jpg': 'purpose.jpg',
    '/vision.jpg': 'vision.jpg',
    '/mission.png': 'mission.png',
    '/last-delivery.png': 'last-delivery.png',
    '/glide.png': 'glide.png',

    // About page
    '/about/about-banner.jpg': 'about-banner.jpg',
    '/about/founded.jpg': 'founded.jpg',
    '/about/people-banner.jpg': 'people-banner.jpg',
    '/about/vision.jpg': 'about-vision.jpg',
    '/about/jude.jpg': 'jude.jpg',
    '/about/emmanuel.jpg': 'emmanuel.jpg',
    '/about/patrick.jpg': 'patrick.jpg',
    '/about/mike.jpg': 'mike.jpg',
    '/about/afe.jpg': 'afe.jpg',
    '/about/tatsuya.jpg': 'tatsuya.jpg',
    '/about/hiroyuki.jpg': 'hiroyuki.jpg',
    '/about/join.jpg': 'join.jpg',

    // Products page
    '/careers/careers-banner.jpg': 'careers-banner.jpg',
    '/products/consultancy.jpg': 'consultancy.jpg',
    '/products/custom-solutions.png': 'custom-solutions.png',
    '/products/mirax.png': 'mirax.png',
    '/products/efficient.jpg': 'efficient.jpg',
    '/products/hotel.png': 'hotel.png',

    // Careers page
    '/careers/engineering.jpg': 'engineering.jpg',
    '/careers/product.jpg': 'product.jpg',
    '/careers/people.jpg': 'people.jpg',
    '/careers/world-class-banner.jpg': 'world-class-banner.jpg',
    '/careers/innovation.jpg': 'innovation.jpg',
    '/careers/continous.jpg': 'continous.jpg',

    // Blog posts
    '/blog/feature-post.jpg': 'feature-post.jpg',
    '/blog/post1.jpg': 'post1.jpg',
    '/blog/post2.jpg': 'post2.jpg',
    '/blog/post3.jpg': 'post3.jpg',
    '/blog/post4.jpg': 'post4.jpg',
    '/blog/post5.jpg': 'post5.jpg',
    '/blog/post6.jpg': 'post6.jpg',

    // Dashboard images
    '/dashboard/dashboard.png': 'dashboard.png',
    '/dashboard/last-delivery.png': 'dashboard-last-delivery.png',
    '/dashboard/glide.png': 'dashboard-glide.png',
    '/dashboard/consultancy.jpg': 'dashboard-consultancy.jpg',
    '/dashboard/mirax.png': 'dashboard-mirax.png',
    '/dashboard/efficient.jpg': 'dashboard-efficient.jpg',
    '/dashboard/hotel.png': 'dashboard-hotel.png',
};

/**
 * Get media ID by image path
 * Updated for Cloudinary plugin - queries by filename field
 */
export async function getMediaIdByPath(payload: Payload, imagePath: string): Promise<string | number | null> {
    const filename = pathToFilenameMap[imagePath];

    if (!filename) {
        console.warn(`⚠️  No filename mapping found for path: ${imagePath}`);
        return null;
    }

    try {
        const result = await payload.find({
            collection: 'media',
            where: {
                filename: {
                    equals: filename,
                },
            },
            limit: 1,
        });

        if (result.docs.length > 0) {
            // console.log(`✅ Found media: ${filename} → ID: ${result.docs[0].id}`);
            return result.docs[0].id;
        }

        console.warn(`⚠️  No media found for filename: ${filename} (path: ${imagePath})`);
        return null;
    } catch (error) {
        console.error(`❌ Error fetching media for ${imagePath}:`, error);
        return null;
    }
}

/**
 * Recursively replace image paths with media IDs in an object
 */
export async function mapImagesToMediaIds(payload: Payload, data: any): Promise<any> {
    if (typeof data !== 'object' || data === null) {
        return data;
    }

    if (Array.isArray(data)) {
        return Promise.all(data.map(item => mapImagesToMediaIds(payload, item)));
    }

    const result: any = {};

    for (const [key, value] of Object.entries(data)) {
        // Check if this is an image/video field (common field names)
        if ((key === 'image' || key === 'bannerImage' || key === 'imageUrl' || key === 'posterImage' || key === 'src' || key === 'backgroundImage' || key === 'featuredImage' || key === 'video' || key === 'backgroundVideo' || key === 'robotImage' || key === 'poster')
            && typeof value === 'string') {
            // Only try to map local paths (starting with /)
            if (value.startsWith('/')) {
                const mediaId = await getMediaIdByPath(payload, value);
                result[key] = mediaId; // Will be null if not found, which is fine (optional fields)
            } else {
                // External URL or other string - skip mapping, set to null for upload fields
                result[key] = null;
            }
        } else if (key === 'images' && Array.isArray(value)) {
            // Handle images array specially
            const mappedImages = [];
            for (const imageItem of value) {
                if (typeof imageItem === 'object' && imageItem.src) {
                    const mediaId = await getMediaIdByPath(payload, imageItem.src);
                    if (mediaId) {
                        mappedImages.push({ image: mediaId });
                    }
                } else {
                    mappedImages.push(await mapImagesToMediaIds(payload, imageItem));
                }
            }
            result[key] = mappedImages;
        } else if (typeof value === 'object') {
            // Recursively process nested objects
            result[key] = await mapImagesToMediaIds(payload, value);
        } else {
            // Keep other values as-is
            result[key] = value;
        }
    }

    return result;
}
