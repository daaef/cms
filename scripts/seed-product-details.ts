import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

/**
 * Seed script for Product Details collection (Payload 3.x)
 *
 * This script reads the zibot-product-detail.json file and creates/updates
 * the product detail page content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedProductDetails = async () => {
    try {
        console.log('🌱 Starting product details seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/zibot-product-detail.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const productDetailData = JSON.parse(rawData);

        console.log(`📄 Loaded product detail data for "${productDetailData.productName}"`);

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Map image paths to media IDs
        console.log('🔗 Mapping images to media IDs...');
        const mappedData = await mapImagesToMediaIds(payload, productDetailData);
        console.log('✅ Image mapping completed');

        // Check if product detail already exists by slug
        const existingProductDetails = await payload.find({
            collection: 'product-details' as any,
            where: {
                slug: {
                    equals: productDetailData.slug,
                },
            },
        });

        if (existingProductDetails.docs.length > 0) {
            console.log(`📝 Product detail page for "${productDetailData.productName}" already exists, updating...`);

            // Update existing product detail page
            const updated = await payload.update({
                collection: 'product-details' as any,
                where: {
                    slug: {
                        equals: productDetailData.slug,
                    },
                },
                data: mappedData,
            });

            console.log(`✅ Product detail page updated successfully! ID: ${updated.docs[0]?.id}`);
        } else {
            console.log(`📝 Creating new product detail page for "${productDetailData.productName}"...`);

            // Create new product detail page
            const created = await payload.create({
                collection: 'product-details' as any,
                data: mappedData,
            });

            console.log(`✅ Product detail page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Product details seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding product details:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedProductDetails };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedProductDetails()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
