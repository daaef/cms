import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Fix script to update URLs for media entries that have cloudinaryId but local URLs
 *
 * This script finds media entries with cloudinaryId but URLs pointing to localhost
 * and updates them to point to Cloudinary
 */

const fixCloudinaryUrls = async () => {
  try {
    console.log('🚀 Starting Cloudinary URL fix...');

    // Initialize Payload
    const payload = await getPayload({
      config: configPromise,
    });

    console.log('✅ Payload initialized');

    // Find all media entries with cloudinaryId
    const mediaEntries = await payload.find({
      collection: 'media',
      where: {
        cloudinaryId: {
          not_equals: null,
        },
      },
      limit: 1000,
    });

    console.log(`📊 Found ${mediaEntries.docs.length} media entries with cloudinaryId`);

    let fixedCount = 0;
    let skippedCount = 0;

    // Process each media entry
    for (const media of mediaEntries.docs) {
      if (media.cloudinaryId) {
        try {
          // Get file extension from filename
          const extension = media.filename?.split('.').pop() || 'png';

          // Use environment variable for cloud name, not hardcoded
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dwneq7h9j';
          
          // Construct Cloudinary URL from cloudinaryId with proper extension
          const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${media.cloudinaryId}.${extension}`;

          console.log(`🔧 Setting cloudinaryUrl for ${media.filename}`);
          console.log(`   cloudinaryId: ${media.cloudinaryId}`);
          console.log(`   cloudinaryUrl: ${cloudinaryUrl}`);

          // Update media entry with Cloudinary URL
          await payload.update({
            collection: 'media',
            id: media.id,
            data: {
              cloudinaryUrl: cloudinaryUrl,
            },
          });

          console.log(`✅ Updated cloudinaryUrl for ${media.filename}`);
          fixedCount++;
        } catch (error) {
          console.error(`❌ Error fixing ${media.filename}:`, error);
        }
      } else {
        console.log(`⏭️  Skipping ${media.filename} - no cloudinaryId`);
        skippedCount++;
      }
    }

    console.log('\n📊 Fix Summary:');
    console.log(`   ✅ Fixed: ${fixedCount}`);
    console.log(`   ⏭️  Skipped (already correct): ${skippedCount}`);
    console.log(`   📝 Total processed: ${mediaEntries.docs.length}`);
    console.log('\n🎉 URL fix completed!');
  } catch (error) {
    console.error('❌ Error during URL fix:', error);
    console.error('Stack:', error instanceof Error ? error.stack : error);
    throw error;
  }
};

// Export for use in other scripts
export { fixCloudinaryUrls };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixCloudinaryUrls()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
