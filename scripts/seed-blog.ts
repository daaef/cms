import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

/**
 * Seed script for Blog Posts (Payload 3.x)
 *
 * This script reads the blog-posts.json file and creates/updates
 * blog posts in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedBlogPosts = async () => {
    try {
        console.log('🌱 Starting blog posts seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/blog-posts.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const blogPostsData = JSON.parse(rawData);

        console.log(`📄 Loaded ${blogPostsData.length} blog posts from JSON`);

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Get the first admin user to set as author
        const adminUsers = await payload.find({
            collection: 'users',
            limit: 1,
        });

        const authorId = adminUsers.docs.length > 0 ? adminUsers.docs[0].id : null;

        if (!authorId) {
            console.warn('⚠️  No admin user found. Blog posts will be created without an author.');
        }

        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const postData of blogPostsData) {
            try {
                // Map image paths to media IDs
                const mappedData = await mapImagesToMediaIds(payload, postData);

                // Add author ID if available
                if (authorId) {
                    mappedData.author = authorId;
                }

                // Check if blog post already exists by slug
                const existingPosts = await payload.find({
                    collection: 'blog-posts' as any,
                    where: {
                        slug: {
                            equals: postData.slug,
                        },
                    },
                    limit: 1,
                });

                if (existingPosts.docs.length > 0) {
                    // Update existing blog post
                    await payload.update({
                        collection: 'blog-posts' as any,
                        where: {
                            slug: {
                                equals: postData.slug,
                            },
                        },
                        data: mappedData,
                    });

                    console.log(`✅ Updated: ${postData.title}`);
                    updatedCount++;
                } else {
                    // Create new blog post
                    await payload.create({
                        collection: 'blog-posts' as any,
                        data: mappedData,
                    });

                    console.log(`✅ Created: ${postData.title}`);
                    createdCount++;
                }
            } catch (error) {
                console.error(`❌ Error processing "${postData.title}":`, error);
                skippedCount++;
            }
        }

        console.log('\n📊 Blog Posts Seeding Summary:');
        console.log(`   ✅ Created: ${createdCount}`);
        console.log(`   📝 Updated: ${updatedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        console.log(`   📁 Total: ${blogPostsData.length}`);
        console.log('\n🎉 Blog posts seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding blog posts:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedBlogPosts };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedBlogPosts()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
