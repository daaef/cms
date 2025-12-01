import 'dotenv/config';
import { seedUsers } from './seed-users.js';
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
 * 1. Users (restore user accounts first)
 * 2. Media (upload all images)
 * 3. Home Page
 * 4. About Page
 * 5. Products Page
 * 6. Careers Page
 * 7. Blog Posts
 * 8. Contact Page
 * 9. Product Items (for dashboard)
 * 10. Dashboard Home Page
 * 11. Product Details (ZiBot page)
 */

const seedAll = async () => {
    try {
        console.log('🚀 Starting complete database seeding...\n');

        // Step 1: Seed Users
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👥 STEP 1: Restoring Users');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedUsers();

        // Step 2: Seed Media
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📸 STEP 2: Uploading Media');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedMedia();

        // Step 3: Seed Home Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🏠 STEP 3: Seeding Home Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedHomePage();

        // Step 4: Seed About Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👥 STEP 4: Seeding About Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedAboutPage();

        // Step 5: Seed Products Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 5: Seeding Products Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductsPage();

        // Step 6: Seed Careers Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💼 STEP 6: Seeding Careers Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedCareersPage();

        // Step 7: Seed Blog Posts
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 STEP 7: Seeding Blog Posts');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedBlogPosts();

        // Step 8: Seed Contact Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📞 STEP 8: Seeding Contact Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedContactPage();

        // Step 9: Seed Product Items
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 9: Seeding Product Items');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductItems();

        // Step 10: Seed Dashboard Home Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 STEP 10: Seeding Dashboard Home Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedDashboardHomePage();

        // Step 11: Seed Product Details
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🤖 STEP 11: Seeding Product Details (ZiBot)');
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
