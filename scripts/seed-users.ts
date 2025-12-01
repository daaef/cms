import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Seed script for Users (Payload 3.x)
 *
 * This script restores users from the backup JSON file
 * IMPORTANT: This script directly inserts user data including password hashes and salts
 * Use this only for restoring existing users after a database reset
 */

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface UserBackup {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    title: string | null;
    bio: string | null;
    salt: string;
    hash: string;
}

const seedUsers = async () => {
    try {
        console.log('🌱 Starting users seed from backup...');

        // Read the backup JSON data
        const dataPath = join(__dirname, '../seed-data/backups/users-backup-20251201.json');

        if (!existsSync(dataPath)) {
            throw new Error(`Users backup not found at: ${dataPath}`);
        }

        const rawData = readFileSync(dataPath, 'utf-8');
        const usersData: UserBackup[] = JSON.parse(rawData);

        console.log(`📄 Loaded ${usersData.length} users from backup`);

        // Initialize Payload 3.x with config promise
        const payload = await getPayload({
            config: configPromise
        });

        console.log('✅ Payload initialized');

        let createdCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const user of usersData) {
            try {
                // Check if user already exists by email
                const existing = await payload.find({
                    collection: 'users',
                    where: {
                        email: {
                            equals: user.email,
                        },
                    },
                    limit: 1,
                });

                if (existing.docs.length > 0) {
                    console.log(`⏭️  Skipping ${user.email}: Already exists (ID: ${existing.docs[0].id})`);
                    skippedCount++;
                    continue;
                }

                // Use Payload's database adapter to directly insert with hash and salt
                // This bypasses Payload's password hashing since we're restoring existing hashes
                const db = payload.db;

                // Direct database insertion using Drizzle (Payload 3.x uses Drizzle ORM)
                await db.drizzle.insert(db.tables.users).values({
                    email: user.email,
                    firstName: user.first_name || undefined,
                    lastName: user.last_name || undefined,
                    title: user.title || undefined,
                    bio: user.bio || undefined,
                    salt: user.salt,
                    hash: user.hash,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                console.log(`✅ Restored user: ${user.email} (${user.first_name} ${user.last_name})`);
                createdCount++;
            } catch (error) {
                console.error(`❌ Error restoring ${user.email}:`, error instanceof Error ? error.message : error);
                errorCount++;
            }
        }

        console.log('\n📊 Users Restore Summary:');
        console.log(`   ✅ Restored: ${createdCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   👥 Total: ${usersData.length}`);
        console.log('\n🎉 Users seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        console.error('Stack:', error instanceof Error ? error.stack : error);
        throw error;
    }
};

// Export for use in other scripts
export { seedUsers };

// Run if executed directly (ESM way)
if (import.meta.url === `file://${process.argv[1]}`) {
    seedUsers()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
