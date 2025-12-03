import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { mapImagesToMediaIds } from './utils/media-mapper.js';

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

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Process both English and Japanese versions
        const languages = [
            { file: 'home-page.json', locale: 'en', label: 'English' },
            { file: 'home-page-ja.json', locale: 'ja', label: 'Japanese' }
        ];

        for (const lang of languages) {
            console.log(`\n📝 Processing ${lang.label} home page...`);

            // Read the JSON data
            const dataPath = join(__dirname, `../seed-data/${lang.file}`);

            if (!existsSync(dataPath)) {
                console.log(`⚠️  Seed data not found at: ${dataPath}, skipping...`);
                continue;
            }

            const rawData = readFileSync(dataPath, 'utf-8');
            const homePageData = JSON.parse(rawData);

            console.log(`📄 Loaded ${lang.label} home page data from JSON`);

            // Map image paths to media IDs
            console.log('🔗 Mapping images to media IDs...');
            const mappedData = await mapImagesToMediaIds(payload, homePageData);
            console.log('✅ Image mapping completed');

            // Check if home page already exists for this locale
            const existingPages = await payload.find({
                collection: 'home-page' as any,
                where: {
                    locale: {
                        equals: lang.locale,
                    },
                },
                limit: 1,
            });

            if (existingPages.docs.length > 0) {
                console.log(`📝 ${lang.label} home page already exists, updating...`);

                // Update existing home page
                const updated = await payload.update({
                    collection: 'home-page' as any,
                    where: {
                        id: {
                            equals: existingPages.docs[0].id,
                        },
                    },
                    data: mappedData,
                });

                console.log(`✅ ${lang.label} home page updated successfully! ID: ${updated.docs[0]?.id}`);
            } else {
                console.log(`📝 Creating new ${lang.label} home page...`);

                // Create new home page
                try {
                    const created = await payload.create({
                        collection: 'home-page' as any,
                        data: mappedData,
                    });

                    console.log(`✅ ${lang.label} home page created successfully! ID: ${created.id}`);
                } catch (createError: any) {
                    console.error(`❌ Error creating ${lang.label} home page:`, createError);
                    if (createError.data?.errors) {
                        console.error('Validation errors:', JSON.stringify(createError.data.errors, null, 2));
                    }
                    throw createError;
                }
            }
        }

        console.log('\n🎉 Home page seeding completed for all languages!');
    } catch (error) {
        console.error('❌ Error seeding home page:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedHomePage };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedHomePage()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
