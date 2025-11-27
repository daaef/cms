import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

/**
 * Seed script for Products collection (Payload 3.x)
 *
 * This script reads the products.json file and creates/updates
 * individual product items in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedProductItems = async () => {
    try {
        console.log('🌱 Starting product items seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/products.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const productsData = JSON.parse(rawData);

        console.log(`📄 Loaded ${productsData.length} products from JSON`);

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const productData of productsData) {
            try {
                // Map image paths to media IDs
                const mappedData = await mapImagesToMediaIds(payload, productData);

                // Check if product already exists by slug
                const existingProducts = await payload.find({
                    collection: 'products' as any,
                    where: {
                        slug: {
                            equals: productData.slug,
                        },
                    },
                });

                if (existingProducts.docs.length > 0) {
                    console.log(`📝 Product "${productData.name}" already exists, updating...`);

                    // Update existing product
                    await payload.update({
                        collection: 'products' as any,
                        where: {
                            slug: {
                                equals: productData.slug,
                            },
                        },
                        data: mappedData,
                    });

                    updatedCount++;
                    console.log(`✅ Product "${productData.name}" updated successfully!`);
                } else {
                    console.log(`📝 Creating new product "${productData.name}"...`);

                    // Create new product
                    const created = await payload.create({
                        collection: 'products' as any,
                        data: mappedData,
                    });

                    createdCount++;
                    console.log(`✅ Product "${productData.name}" created successfully! ID: ${created.id}`);
                }
            } catch (error) {
                console.error(`❌ Error processing product "${productData.name}":`, error);
                skippedCount++;
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 Product items seeding completed!');
        console.log(`   Created: ${createdCount}`);
        console.log(`   Updated: ${updatedCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
        console.error('❌ Error seeding product items:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedProductItems };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedProductItems()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
