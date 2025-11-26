import payload from 'payload';
import * as fs from 'fs';
import * as path from 'path';

const seedHomePage = async () => {
    try {
        console.log('🌱 Starting home page seed...');

        // Initialize Payload with PostgreSQL
        await payload.init({
            secret: process.env.PAYLOAD_SECRET || '',
            databaseURI: process.env.DATABASE_URI || '', // PostgreSQL connection string
            local: true,
            onInit: async () => {
                console.log('✅ Payload initialized');
            },
        });

        // Read the JSON data
        const dataPath = path.join(__dirname, '../seed-data/home-page.json');

        if (!fs.existsSync(dataPath)) {
            throw new Error(`Seed data not found at: ${dataPath}`);
        }

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

            const updated = await payload.update({
                collection: 'home-page',
                id: existingPages.docs[0].id,
                data: homePageData,
            });

            console.log(`✅ Home page updated successfully! ID: ${updated.id}`);
        } else {
            console.log('📝 Creating new home page...');

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
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

seedHomePage();