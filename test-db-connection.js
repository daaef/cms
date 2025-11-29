import pg from 'pg'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const { Pool } = pg

async function testConnection() {
  console.log('🔍 Testing Neon DB connection...\n')

  const connectionString = process.env.DATABASE_URI

  if (!connectionString) {
    console.error('❌ DATABASE_URI not found in environment variables')
    process.exit(1)
  }

  console.log('📋 Connection details:')
  console.log('   Host:', connectionString.match(/@([^/]+)/)?.[1] || 'unknown')
  console.log('   Database:', connectionString.match(/\/([^?]+)/)?.[1] || 'unknown')
  console.log('   SSL Mode:', connectionString.includes('sslmode=require') ? 'Required ✅' : 'Not required')
  console.log('   Channel Binding:', connectionString.includes('channel_binding') ? '⚠️  PRESENT (may cause issues)' : '✅ Not present')
  console.log('')

  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10000,
  })

  try {
    console.log('🔌 Attempting to connect...')
    const client = await pool.connect()
    console.log('✅ Connection successful!\n')

    // Test a simple query
    console.log('🧪 Running test query...')
    const result = await client.query('SELECT version(), current_database(), current_user')

    console.log('📊 Database Info:')
    console.log('   PostgreSQL Version:', result.rows[0].version.split(',')[0])
    console.log('   Current Database:', result.rows[0].current_database)
    console.log('   Current User:', result.rows[0].current_user)
    console.log('')

    // Test table access
    console.log('📋 Checking for Payload tables...')
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    if (tablesResult.rows.length > 0) {
      console.log(`✅ Found ${tablesResult.rows.length} tables:`)
      tablesResult.rows.forEach((row, index) => {
        if (index < 10) { // Show first 10 tables
          console.log(`   - ${row.table_name}`)
        }
      })
      if (tablesResult.rows.length > 10) {
        console.log(`   ... and ${tablesResult.rows.length - 10} more`)
      }
    } else {
      console.log('ℹ️  No tables found (database is empty)')
    }

    client.release()
    console.log('\n✅ All tests passed! Database connection is working.')

  } catch (error) {
    console.error('\n❌ Connection failed!')
    console.error('Error:', error.message)

    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Suggestions:')
      console.error('   1. Check if the database hostname is correct')
      console.error('   2. Verify the database is not paused in Neon dashboard')
      console.error('   3. Check your internet connection')
    } else if (error.message.includes('channel_binding')) {
      console.error('\n💡 Suggestion: Remove &channel_binding=require from DATABASE_URI')
    } else if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Suggestion: Check your database credentials')
    }

    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()

