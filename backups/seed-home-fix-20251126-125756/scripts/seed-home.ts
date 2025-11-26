import payload from 'payload';
import { getPayload } from 'payload';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Seed script for Home Page content
 *
 * This script reads the home-page.json file and creates/updates
 * the home page content in Payload CMS
 */

const seedHomePage = async () => {
    try {
        console.log('🌱 Starting home page seed...');

        // Read the JSON data
        const dataPath = path.join(__dirname, '../seed-data/home-page.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const homePageData = JSON.parse(rawData);

        console.log('📄 Loaded home page data from JSON');

        // Initialize Payload (make sure Payload is already running or initialized)
        // If using Payload 3.x with async initialization
        const payloadInstance = await getPayload({ config: './payload.config.ts' });

        // Check if home page already exists
        const existingPages = await payloadInstance.find({
            collection: 'home-page',
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Home page already exists, updating...');

            // Update existing home page
            const updated = await payloadInstance.update({
                collection: 'home-page',
                id: existingPages.docs[0].id,
                data: homePageData,
            });

            console.log(`✅ Home page updated successfully! ID: ${updated.id}`);
        } else {
            console.log('📝 Creating new home page...');

            // Create new home page
            const created = await payloadInstance.create({
                collection: 'home-page',
                data: homePageData,
            });

            console.log(`✅ Home page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Home page seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding home page:', error);
        process.exit(1);
    }
};

// Alternative version for standalone execution (Payload 2.x style)
const seedHomePageStandalone = async () => {
    try {
        console.log('🌱 Starting home page seed (standalone)...');

        // Initialize Payload with local config
        await payload.init({
            secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
            mongoURL: process.env.MONGODB_URI || 'mongodb://localhost/fainzy-cms',
            local: true,
        });

        console.log('✅ Payload initialized');

        // Read the JSON data
        const dataPath = path.join(__dirname, '../seed-data/home-page.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const homePageData = JSON.parse(rawData);

        console.log('📄 Loaded home page data from JSON');

        // Check if home page already exists
        const existingPages = await payload.find({
            collection: 'home-page',
            limit: 1,
        });

        if (existingPages.docs.length > 0) {
            console.log('📝 Home page already exists, updating...');

            // Update existing home page
            const updated = await payload.update({
                collection: 'home-page',
                id: existingPages.docs[0].id,
                data: homePageData,
            });

            console.log(`✅ Home page updated successfully! ID: ${updated.id}`);
        } else {
            console.log('📝 Creating new home page...');

            // Create new home page
            const created = await payload.create({
                collection: 'home-page',
                data: homePageData,
            });

            console.log(`✅ Home page created successfully! ID: ${created.id}`);
        }

        console.log('🎉 Home page seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding home page:', error);
        process.exit(1);
    }
};

// Export both versions
export { seedHomePage, seedHomePageStandalone };

// Run standalone if executed directly
if (require.main === module) {
    seedHomePageStandalone();
}