const { execSync } = require('child_process')

const dbUrl = process.env.DATABASE_URL || ''
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')

if (isPostgres) {
  console.log('[push-and-seed] Remote PostgreSQL database detected. Synchronizing schema...')
  try {
    execSync('npx prisma db push --accept-data-loss --skip-generate', {
      stdio: 'inherit',
      env: process.env,
    })
    console.log('[push-and-seed] ✅ Prisma schema synchronized with PostgreSQL.')

    // Automatically seed if this is a fresh setup or build
    console.log('[push-and-seed] Running seed check...')
    try {
      execSync('npx tsx prisma/seed.ts', {
        stdio: 'inherit',
        env: process.env,
      })
      console.log('[push-and-seed] ✅ Database seeded successfully.')
    } catch (seedError) {
      console.warn('[push-and-seed] Notice during seed (data may already exist):', seedError.message)
    }
  } catch (error) {
    console.warn('[push-and-seed] Warning during database push:', error.message)
  }
} else {
  console.log('[push-and-seed] SQLite database detected, skipping remote schema sync.')
}
