import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

/**
 * Seed script for Media uploads (Payload 3.x)
 *
 * This script uploads all images from website-v2 to the Media collection
 * Images are identified by their paths and uploaded with proper metadata
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define all images to upload with their paths and metadata
const imagesToUpload = [
    // Home page images
    { path: '../../website-v2/public/slides/zibot.png', alt: 'ZiBot Delivery Robot', filename: 'zibot-slide.png' },
    { path: '../../website-v2/public/slides/glide.png', alt: 'Glide Autonomous Scooter', filename: 'glide-slide.png' },
    { path: '../../website-v2/public/slides/consultancy.png', alt: 'Fainzy Consultancy Services', filename: 'consultancy-slide.png' },
    { path: '../../website-v2/public/purpose.jpg', alt: 'Our Purpose', filename: 'purpose.jpg' },
    { path: '../../website-v2/public/vision.jpg', alt: 'Our Vision', filename: 'vision.jpg' },
    { path: '../../website-v2/public/mission.png', alt: 'Our Mission', filename: 'mission.png' },
    { path: '../../website-v2/public/last-delivery.png', alt: 'ZiBot Last Mile Delivery', filename: 'last-delivery.png' },
    { path: '../../website-v2/public/glide.png', alt: 'Glide Scooter', filename: 'glide.png' },

    // About page images
    { path: '../../website-v2/public/about/about-banner.jpg', alt: 'About Us Banner', filename: 'about-banner.jpg' },
    { path: '../../website-v2/public/about/founded.jpg', alt: 'Founded in 2018', filename: 'founded.jpg' },
    { path: '../../website-v2/public/about/people-banner.jpg', alt: 'People Behind Innovation', filename: 'people-banner.jpg' },
    { path: '../../website-v2/public/about/vision.jpg', alt: 'Our Vision', filename: 'about-vision.jpg' },
    { path: '../../website-v2/public/about/jude.jpg', alt: 'Dr. Jude Nwadiuto', filename: 'jude.jpg' },
    { path: '../../website-v2/public/about/emmanuel.jpg', alt: 'Emmanuel Omeogah', filename: 'emmanuel.jpg' },
    { path: '../../website-v2/public/about/patrick.jpg', alt: 'Patrick John', filename: 'patrick.jpg' },
    { path: '../../website-v2/public/about/mike.jpg', alt: 'Michael Nwadiuto', filename: 'mike.jpg' },
    { path: '../../website-v2/public/about/afe.jpg', alt: 'Afekhide Bot Gbadamosi', filename: 'afe.jpg' },
    { path: '../../website-v2/public/about/tatsuya.jpg', alt: 'Prof. Tatsuya Suzuki', filename: 'tatsuya.jpg' },
    { path: '../../website-v2/public/about/hiroyuki.jpg', alt: 'Assoc. Prof Hiroyuki Okuda', filename: 'hiroyuki.jpg' },
    { path: '../../website-v2/public/about/join.jpg', alt: 'Join Our Team', filename: 'join.jpg' },

    // Products page images
    { path: '../../website-v2/public/careers/careers-banner.jpg', alt: 'Products and Services Banner', filename: 'careers-banner.jpg' },
    { path: '../../website-v2/public/products/consultancy.jpg', alt: 'Consultancy Services', filename: 'consultancy.jpg' },
    { path: '../../website-v2/public/products/custom-solutions.png', alt: 'Customized Robots', filename: 'custom-solutions.png' },
    { path: '../../website-v2/public/products/mirax.png', alt: 'MiraX Restaurant Robot', filename: 'mirax.png' },
    { path: '../../website-v2/public/products/efficient.jpg', alt: 'Efficient Food Ordering System', filename: 'efficient.jpg' },
    { path: '../../website-v2/public/products/hotel.png', alt: 'Hotel Robot Delivery System', filename: 'hotel.png' },

    // Careers page images
    { path: '../../website-v2/public/careers/engineering.jpg', alt: 'Engineering & Technology', filename: 'engineering.jpg' },
    { path: '../../website-v2/public/careers/product.jpg', alt: 'Product & Design', filename: 'product.jpg' },
    { path: '../../website-v2/public/careers/people.jpg', alt: 'Operations & Manufacturing', filename: 'people.jpg' },
    { path: '../../website-v2/public/careers/world-class-banner.jpg', alt: 'World-Class Facilities', filename: 'world-class-banner.jpg' },
    { path: '../../website-v2/public/careers/innovation.jpg', alt: 'Innovation at Scale', filename: 'innovation.jpg' },
    { path: '../../website-v2/public/careers/continous.jpg', alt: 'Continuous Growth', filename: 'continous.jpg' },

    // Blog post images
    { path: '../../website-v2/public/blog/feature-post.jpg', alt: 'Featured Blog Post', filename: 'feature-post.jpg' },
    { path: '../../website-v2/public/blog/post1.jpg', alt: 'Blog Post 1', filename: 'post1.jpg' },
    { path: '../../website-v2/public/blog/post2.jpg', alt: 'Blog Post 2', filename: 'post2.jpg' },
    { path: '../../website-v2/public/blog/post3.jpg', alt: 'Blog Post 3', filename: 'post3.jpg' },
    { path: '../../website-v2/public/blog/post4.jpg', alt: 'Blog Post 4', filename: 'post4.jpg' },
    { path: '../../website-v2/public/blog/post5.jpg', alt: 'Blog Post 5', filename: 'post5.jpg' },
    { path: '../../website-v2/public/blog/post6.jpg', alt: 'Blog Post 6', filename: 'post6.jpg' },

    // Dashboard images
    { path: '../../dashboard-v2/public/dashboard.png', alt: 'Dashboard Preview', filename: 'dashboard.png' },
    { path: '../../dashboard-v2/public/last-delivery.png', alt: 'Last Mile Delivery - ZiBot', filename: 'dashboard-last-delivery.png' },
    { path: '../../dashboard-v2/public/glide.png', alt: 'Glide Scooter Service', filename: 'dashboard-glide.png' },
    { path: '../../dashboard-v2/public/consultancy.jpg', alt: 'Consultancy Services', filename: 'dashboard-consultancy.jpg' },
    { path: '../../dashboard-v2/public/mirax.png', alt: 'MiraX Restaurant Robot', filename: 'dashboard-mirax.png' },
    { path: '../../dashboard-v2/public/efficient.jpg', alt: 'Efficient Food Ordering', filename: 'dashboard-efficient.jpg' },
    { path: '../../dashboard-v2/public/hotel.png', alt: 'Hotel Robot Delivery', filename: 'dashboard-hotel.png' },
];

const seedMedia = async () => {
    try {
        console.log('🌱 Starting media upload...');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        let uploadedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const imageInfo of imagesToUpload) {
            const imagePath = join(__dirname, imageInfo.path);

            // Check if file exists
            if (!existsSync(imagePath)) {
                console.log(`⚠️  Skipping ${imageInfo.filename}: File not found at ${imagePath}`);
                skippedCount++;
                continue;
            }

            try {
                // Check if media already exists by filename
                const existing = await payload.find({
                    collection: 'media',
                    where: {
                        filename: {
                            equals: imageInfo.filename,
                        },
                    },
                    limit: 1,
                });

                if (existing.docs.length > 0) {
                    console.log(`⏭️  Skipping ${imageInfo.filename}: Already exists (ID: ${existing.docs[0].id})`);
                    skippedCount++;
                    continue;
                }

                // Read the file
                const fileBuffer = readFileSync(imagePath);

                // Upload to media collection
                const uploaded = await payload.create({
                    collection: 'media',
                    data: {
                        alt: imageInfo.alt,
                    },
                    file: {
                        data: fileBuffer,
                        mimetype: imageInfo.filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
                        name: imageInfo.filename,
                        size: fileBuffer.length,
                    },
                });

                console.log(`✅ Uploaded: ${imageInfo.filename} (ID: ${uploaded.id})`);
                uploadedCount++;
            } catch (error) {
                console.error(`❌ Error uploading ${imageInfo.filename}:`, error instanceof Error ? error.message : error);
                errorCount++;
            }
        }

        console.log('\n📊 Media Upload Summary:');
        console.log(`   ✅ Uploaded: ${uploadedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📁 Total: ${imagesToUpload.length}`);
        console.log('\n🎉 Media seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding media:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedMedia };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedMedia()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
