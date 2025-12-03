const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URI
});

async function verifyCollections() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check navbar collection
    const navbarResult = await client.query(`
      SELECT id, title, locale, "isActive", "updatedAt" 
      FROM navbar 
      ORDER BY id;
    `);
    
    console.log('📋 Navbar Collection:');
    console.log('─────────────────────────────────────');
    console.table(navbarResult.rows);

    // Check footer collection
    const footerResult = await client.query(`
      SELECT id, title, locale, "isActive", "updatedAt" 
      FROM footer 
      ORDER BY id;
    `);
    
    console.log('\n📋 Footer Collection:');
    console.log('─────────────────────────────────────');
    console.table(footerResult.rows);

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('navbar', 'footer')
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tables in Database:');
    console.log('─────────────────────────────────────');
    console.table(tablesResult.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyCollections();
