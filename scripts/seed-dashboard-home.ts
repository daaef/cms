import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

/**
 * Seed script for Dashboard Home Page content (Payload 3.x)
 *
 * This script reads the dashboard-home-page.json file and creates/updates
 * the dashboard home page content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedDashboardHomePage = async () => {
    try {
        console.log('🌱 Starting dashboard home page seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/dashboard-home-page.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const dashboardHomePageData = JSON.parse(rawData);

        console.log('📄 Loaded dashboard home page data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Map image paths to media IDs
        console.log('🔗 Mapping images to media IDs...');
        const mappedData = await mapImagesToMediaIds(payload, dashboardHomePageData);
        console.log('✅ Image mapping completed');

        // Get all products to link to the homepage
        console.log('🔗 Fetching products...');
        const products = await payload.find({
            collection: 'products' as any,
            limit: 100,
            where: {
                isActive: {
                    equals: true,
                },
                locale: {
                    equals: 'en',
                },
            },
            sort: 'order',
        });

        // Add product IDs to the products section
        if (products.docs.length > 0) {
            mappedData.productsSection.products = products.docs.map(p => p.id);
            console.log(`✅ Linked ${products.docs.length} products to homepage`);
        }

        // Check if dashboard home page already exists
        const existingPages = await payload.find({
            collection: 'dashboard-home-page' as any,
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Dashboard home page already exists, updating...');

            // Update existing dashboard home page
            const updated = await payload.update({
                collection: 'dashboard-home-page' as any,
                where: {
                    id: {
                        equals: existingPages.docs[0].id,
                    },
                },
                data: mappedData,
            });

            console.log(`✅ Dashboard home page updated successfully! ID: ${updated.docs[0]?.id}`);
        } else {
            console.log('📝 Creating new dashboard home page...');

            // Create new dashboard home page
            const created = await payload.create({
                collection: 'dashboard-home-page' as any,
                data: mappedData,
            });

            console.log(`✅ Dashboard home page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Dashboard home page seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding dashboard home page:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedDashboardHomePage };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDashboardHomePage()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
