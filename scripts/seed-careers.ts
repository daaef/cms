import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

/**
 * Seed script for Careers Page content (Payload 3.x)
 *
 * This script reads the careers-page.json file and creates/updates
 * the careers page content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedCareersPage = async () => {
    try {
        console.log('🌱 Starting careers page seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/careers-page.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const careersPageData = JSON.parse(rawData);

        console.log('📄 Loaded careers page data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Map image paths to media IDs
        console.log('🔗 Mapping images to media IDs...');
        const mappedData = await mapImagesToMediaIds(payload, careersPageData);
        console.log('✅ Image mapping completed');

        // Check if careers page already exists
        const existingPages = await payload.find({
            collection: 'careers-page' as any,
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Careers page already exists, updating...');

            // Update existing careers page
            const updated = await payload.update({
                collection: 'careers-page' as any,
                where: {
                    id: {
                        equals: existingPages.docs[0].id,
                    },
                },
                data: mappedData,
            });

            console.log(`✅ Careers page updated successfully! ID: ${updated.docs[0]?.id}`);
        } else {
            console.log('📝 Creating new careers page...');

            // Create new careers page
            const created = await payload.create({
                collection: 'careers-page' as any,
                data: mappedData,
            });

            console.log(`✅ Careers page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Careers page seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding careers page:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedCareersPage };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedCareersPage()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
