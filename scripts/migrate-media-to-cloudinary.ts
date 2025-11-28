import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

/**
 * Migration script to upload existing media files to Cloudinary
 *
 * This script finds all media entries without a cloudinaryId and uploads them to Cloudinary
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
  timeout: 60000, // 60 second timeout
});

const migrateMediaToCloudinary = async () => {
  try {
    console.log('🚀 Starting media migration to Cloudinary...');

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('❌ Cloudinary credentials not configured in .env file');
    }

    // Initialize Payload
    const payload = await getPayload({
      config: configPromise,
    });

    console.log('✅ Payload initialized');

    // Find all media entries without cloudinaryId
    const mediaEntries = await payload.find({
      collection: 'media',
      where: {
        cloudinaryId: {
          equals: null,
        },
      },
      limit: 1000,
    });

    console.log(`📊 Found ${mediaEntries.docs.length} media entries to migrate`);

    if (mediaEntries.docs.length === 0) {
      console.log('✅ No media entries need migration. All done!');
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process each media entry
    for (const media of mediaEntries.docs) {
      if (!media.filename) {
        console.log(`⚠️  Skipping media ID ${media.id} - no filename`);
        skippedCount++;
        continue;
      }

      try {
        const filePath = path.join(process.cwd(), 'media', media.filename);

        if (!fs.existsSync(filePath)) {
          console.log(`❌ File not found: ${filePath}`);
          errorCount++;
          continue;
        }

        console.log(`📤 Uploading ${media.filename} to Cloudinary...`);

        // Sanitize filename for Cloudinary public_id
        const sanitizedName = media.filename
          .split('.')[0]
          .replace(/[^a-zA-Z0-9-_.]/g, '_')
          .substring(0, 255); // Cloudinary public_id max length

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'fainzy-cms',
          public_id: sanitizedName,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true, // Prevent overwrites
          overwrite: false, // Don't overwrite existing files
        });

        // Update media entry with Cloudinary data
        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            cloudinaryId: result.public_id,
            cloudinaryUrl: result.secure_url,
          },
        });

        console.log(`✅ Successfully uploaded: ${result.secure_url}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error uploading ${media.filename}:`, error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total processed: ${mediaEntries.docs.length}`);
    console.log('\n🎉 Media migration completed!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    console.error('Stack:', error instanceof Error ? error.stack : error);
    throw error;
  }
};

// Export for use in other scripts
export { migrateMediaToCloudinary };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateMediaToCloudinary()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
