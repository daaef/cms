import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Seed script for Contact Page content (Payload 3.x)
 *
 * This script reads the contact-page.json file and creates/updates
 * the contact page content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedContactPage = async () => {
    try {
        console.log('🌱 Starting contact page seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/contact-page.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const contactPageData = JSON.parse(rawData);

        console.log('📄 Loaded contact page data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Check if contact page already exists
        const existingPages = await payload.find({
            collection: 'contact-page' as any,
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Contact page already exists, updating...');

            // Update existing contact page
            const updated = await payload.update({
                collection: 'contact-page' as any,
                where: {
                    id: {
                        equals: existingPages.docs[0].id,
                    },
                },
                data: contactPageData,
            });

            console.log(`✅ Contact page updated successfully! ID: ${updated.docs[0]?.id}`);
        } else {
            console.log('📝 Creating new contact page...');

            // Create new contact page
            const created = await payload.create({
                collection: 'contact-page' as any,
                data: contactPageData,
            });

            console.log(`✅ Contact page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Contact page seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding contact page:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedContactPage };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedContactPage()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
