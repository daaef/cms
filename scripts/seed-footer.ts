import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Seed script for Footer content (Payload 3.x)
 *
 * This script reads the footer.json file and creates/updates
 * the footer content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedFooter = async () => {
    try {
        console.log('🌱 Starting footer seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/footer.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const footerData = JSON.parse(rawData);

        console.log('📄 Loaded footer data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Process each footer configuration
        for (const footerItem of footerData) {
            console.log(`\n📝 Processing footer: ${footerItem.title}`);

            // Check if footer already exists for this locale
            const existing = await payload.find({
                collection: 'footer' as any,
                where: {
                    locale: {
                        equals: footerItem.locale,
                    },
                    isActive: {
                        equals: true,
                    },
                },
                limit: 1,
            });

            if (existing.docs.length > 0) {
                console.log(`📝 Active footer for locale "${footerItem.locale}" already exists, updating...`);

                // Update existing footer
                const updated = await payload.update({
                    collection: 'footer' as any,
                    where: {
                        id: {
                            equals: existing.docs[0].id,
                        },
                    },
                    data: footerItem,
                });

                console.log(`✅ Footer updated successfully! ID: ${updated.docs[0]?.id}`);
            } else {
                console.log(`📝 Creating new footer for locale "${footerItem.locale}"...`);

                // Create new footer
                const created = await payload.create({
                    collection: 'footer' as any,
                    data: footerItem,
                });

                console.log(`✅ Footer created successfully! ID: ${created.id}`);
            }
        }

        console.log('\n🎉 Footer seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding footer:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedFooter };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedFooter()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
