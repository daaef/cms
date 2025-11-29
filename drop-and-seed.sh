#!/bin/bash

echo "🗑️  Dropping all tables from database..."

# Extract connection details
DB_URL="${DATABASE_URI}"

# Drop all tables using Payload CLI
pnpm payload migrate:reset --force

echo "✅ Database dropped!"
echo ""
echo "🌱 Starting seed process..."
echo ""

# Run seed:all script which handles everything
pnpm seed:all

echo ""
echo "✅ Database seeded successfully!"
