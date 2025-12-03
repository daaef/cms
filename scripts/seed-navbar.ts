import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Seed script for Navbar content (Payload 3.x)
 *
 * This script reads the navbar.json file and creates/updates
 * the navbar content in Payload CMS
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedNavbar = async () => {
    try {
        console.log('🌱 Starting navbar seed...');

        // Read the JSON data
        const dataPath = join(__dirname, '../seed-data/navbar.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const navbarData = JSON.parse(rawData);

        console.log('📄 Loaded navbar data from JSON');

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        // Process each navbar configuration
        for (const navItem of navbarData) {
            console.log(`\n📝 Processing navbar: ${navItem.title}`);

            // Check if navbar already exists for this locale
            const existing = await payload.find({
                collection: 'navbar' as any,
                where: {
                    locale: {
                        equals: navItem.locale,
                    },
                    isActive: {
                        equals: true,
                    },
                },
                limit: 1,
            });

            if (existing.docs.length > 0) {
                console.log(`📝 Active navbar for locale "${navItem.locale}" already exists, updating...`);

                // Update existing navbar
                const updated = await payload.update({
                    collection: 'navbar' as any,
                    where: {
                        id: {
                            equals: existing.docs[0].id,
                        },
                    },
                    data: navItem,
                });

                console.log(`✅ Navbar updated successfully! ID: ${updated.docs[0]?.id}`);
            } else {
                console.log(`📝 Creating new navbar for locale "${navItem.locale}"...`);

                // Create new navbar
                const created = await payload.create({
                    collection: 'navbar' as any,
                    data: navItem,
                });

                console.log(`✅ Navbar created successfully! ID: ${created.id}`);
            }
        }

        console.log('\n🎉 Navbar seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding navbar:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedNavbar };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedNavbar()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
