import 'dotenv/config';
import { seedMedia } from './seed-media.js';
import { seedHomePage } from './seed-home.js';
import { seedAboutPage } from './seed-about.js';
import { seedProductsPage } from './seed-products.js';
import { seedCareersPage } from './seed-careers.js';
import { seedBlogPosts } from './seed-blog.js';
import { seedContactPage } from './seed-contact.js';
import { seedProductItems } from './seed-product-items.js';
import { seedDashboardHomePage } from './seed-dashboard-home.js';
import { seedProductDetails } from './seed-product-details.js';

/**
 * Master seed script - runs all seeds in the correct order
 *
 * Order:
 * 1. Media (upload all images first)
 * 2. Home Page
 * 3. About Page
 * 4. Products Page
 * 5. Careers Page
 * 6. Blog Posts
 * 7. Contact Page
 * 8. Product Items (for dashboard)
 * 9. Dashboard Home Page
 * 10. Product Details (ZiBot page)
 */

const seedAll = async () => {
    try {
        console.log('🚀 Starting complete database seeding...\n');

        // Step 1: Seed Media
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📸 STEP 1: Uploading Media');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedMedia();

        // Step 2: Seed Home Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🏠 STEP 2: Seeding Home Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedHomePage();

        // Step 3: Seed About Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👥 STEP 3: Seeding About Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedAboutPage();

        // Step 4: Seed Products Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 4: Seeding Products Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductsPage();

        // Step 5: Seed Careers Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💼 STEP 5: Seeding Careers Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedCareersPage();

        // Step 6: Seed Blog Posts
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 STEP 6: Seeding Blog Posts');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedBlogPosts();

        // Step 7: Seed Contact Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📞 STEP 7: Seeding Contact Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedContactPage();

        // Step 8: Seed Product Items
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 8: Seeding Product Items');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductItems();

        // Step 9: Seed Dashboard Home Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 STEP 9: Seeding Dashboard Home Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedDashboardHomePage();

        // Step 10: Seed Product Details
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🤖 STEP 10: Seeding Product Details (ZiBot)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductDetails();

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ ALL SEEDING COMPLETED SUCCESSFULLY!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error during seeding:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        process.exit(1);
    }
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedAll();
}

export { seedAll };
