import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Seed script for Home Page content (Payload 3.x)
 *
 * This script reads the home-page.json file and creates/updates
 * the home page content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedHomePage = async () => {
    try {
        console.log('🌱 Starting home page seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/home-page.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const homePageData = JSON.parse(rawData);

        console.log('📄 Loaded home page data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Check if home page already exists
        const existingPages = await payload.find({
            collection: 'home-page' as any,
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Home page already exists, updating...');

            // Update existing home page
            const updated = await payload.update({
                collection: 'home-page' as any,
                where: {
                    id: {
                        equals: existingPages.docs[0].id,
                    },
                },
                data: homePageData,
            });

            console.log(`✅ Home page updated successfully! ID: ${updated.docs[0]?.id}`);
        } else {
            console.log('📝 Creating new home page...');

            // Create new home page
            const created = await payload.create({
                collection: 'home-page' as any,
                data: homePageData,
            });

            console.log(`✅ Home page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Home page seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding home page:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        process.exit(1);
    }
};

// Export for use in other scripts
export { seedHomePage };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedHomePage();
}
