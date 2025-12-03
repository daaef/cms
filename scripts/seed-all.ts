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
import { seedNavbar } from './seed-navbar.js';
import { seedFooter } from './seed-footer.js';

/**
 * Master seed script - runs all seeds in the correct order
 *
 * Order:
 * 1. Users (restore user accounts first)
 * 2. Media (upload all images)
 * 3. Navbar
 * 4. Footer
 * 5. Home Page
 * 6. About Page
 * 7. Products Page
 * 8. Careers Page
 * 9. Blog Posts
 * 10. Contact Page
 * 11. Product Items (for dashboard)
 * 12. Dashboard Home Page
 * 13. Product Details (ZiBot page)
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

        // Step 3: Seed Navbar
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🧭 STEP 3: Seeding Navbar');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedNavbar();

        // Step 4: Seed Footer
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📄 STEP 4: Seeding Footer');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedFooter();

        // Step 5: Seed Home Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🏠 STEP 5: Seeding Home Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedHomePage();

        // Step 6: Seed About Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👥 STEP 6: Seeding About Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedAboutPage();

        // Step 7: Seed Products Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 7: Seeding Products Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductsPage();

        // Step 8: Seed Careers Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💼 STEP 8: Seeding Careers Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedCareersPage();

        // Step 9: Seed Blog Posts
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 STEP 9: Seeding Blog Posts');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedBlogPosts();

        // Step 10: Seed Contact Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📞 STEP 10: Seeding Contact Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedContactPage();

        // Step 11: Seed Product Items
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 STEP 11: Seeding Product Items');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedProductItems();

        // Step 12: Seed Dashboard Home Page
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 STEP 12: Seeding Dashboard Home Page');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await seedDashboardHomePage();

        // Step 13: Seed Product Details
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🤖 STEP 13: Seeding Product Details (ZiBot)');
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
