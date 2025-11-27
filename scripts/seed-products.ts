import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

/**
 * Seed script for Products Page content (Payload 3.x)
 *
 * This script reads the products-page.json file and creates/updates
 * the products page content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedProductsPage = async () => {
    try {
        console.log('🌱 Starting products page seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/products-page.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const productsPageData = JSON.parse(rawData);

        console.log('📄 Loaded products page data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Map image paths to media IDs
        console.log('🔗 Mapping images to media IDs...');
        const mappedData = await mapImagesToMediaIds(payload, productsPageData);
        console.log('✅ Image mapping completed');

        // Check if products page already exists
        const existingPages = await payload.find({
            collection: 'products-page' as any,
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Products page already exists, updating...');

            // Update existing products page
            const updated = await payload.update({
                collection: 'products-page' as any,
                where: {
                    id: {
                        equals: existingPages.docs[0].id,
                    },
                },
                data: mappedData,
            });

            console.log(`✅ Products page updated successfully! ID: ${updated.docs[0]?.id}`);
        } else {
            console.log('📝 Creating new products page...');

            // Create new products page
            const created = await payload.create({
                collection: 'products-page' as any,
                data: mappedData,
            });

            console.log(`✅ Products page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Products page seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding products page:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedProductsPage };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedProductsPage()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
