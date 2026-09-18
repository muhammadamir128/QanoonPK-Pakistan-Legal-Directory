import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function setupDatabaseUrl(): void {
  const currentUrl = process.env.DATABASE_URL
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NOW_REGION
  )

  // If using a remote PostgreSQL or MySQL database on Vercel, leave it as is
  if (currentUrl && (currentUrl.startsWith('postgres://') || currentUrl.startsWith('postgresql://') || currentUrl.startsWith('mysql://'))) {
    return
  }

  if (isServerless) {
    // In Vercel / AWS Lambda, the root filesystem is read-only.
    // Copy the database file to /tmp which is writable.
    const tmpDbPath = '/tmp/custom.db'
    const sourceDbPath = path.join(process.cwd(), 'db', 'custom.db')

    try {
      const tmpExists = fs.existsSync(tmpDbPath)
      const tmpSize = tmpExists ? fs.statSync(tmpDbPath).size : 0

      if ((!tmpExists || tmpSize === 0) && fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath)
        console.log(`[Database] Initialized writable database at ${tmpDbPath} from ${sourceDbPath}`)
      }
    } catch (err) {
      console.warn('[Database] Could not copy database to /tmp:', err)
    }

    process.env.DATABASE_URL = `file:${tmpDbPath}`
  } else {
    // Local environment: resolve absolute path to db/custom.db
    if (!currentUrl || currentUrl.startsWith('file:.')) {
      const localPath = path.resolve(process.cwd(), 'db', 'custom.db').replace(/\\/g, '/')
      if (fs.existsSync(localPath)) {
        process.env.DATABASE_URL = `file:${localPath}`
      } else {
        process.env.DATABASE_URL = `file:${path.resolve('db/custom.db').replace(/\\/g, '/')}`
      }
    }
  }
}

// Run immediately upon module import
setupDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export function ensureDatabaseReady(): void {
  setupDatabaseUrl()
}