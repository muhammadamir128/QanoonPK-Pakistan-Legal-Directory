import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { DB_GZIP_BASE64 } from '@/lib/db-seed-binary'

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
    // Ensure the database exists in writable /tmp.
    const tmpDbPath = '/tmp/custom.db'
    const sourceDbPath = path.join(process.cwd(), 'db', 'custom.db')

    try {
      const tmpExists = fs.existsSync(tmpDbPath)
      const tmpSize = tmpExists ? fs.statSync(tmpDbPath).size : 0

      // Only extract or copy if /tmp/custom.db doesn't exist or is empty
      if (!tmpExists || tmpSize < 10000) {
        if (fs.existsSync(sourceDbPath) && fs.statSync(sourceDbPath).size > 10000) {
          fs.copyFileSync(sourceDbPath, tmpDbPath)
          console.log(`[Database] Copied disk database to writable ${tmpDbPath}`)
        } else {
          // Decompress embedded seed binary into /tmp/custom.db
          const decompressed = zlib.gunzipSync(Buffer.from(DB_GZIP_BASE64, 'base64'))
          fs.writeFileSync(tmpDbPath, decompressed)
          console.log(`[Database] Extracted embedded database to writable ${tmpDbPath} (${decompressed.length} bytes)`)
        }
      }
    } catch (err) {
      console.warn('[Database] Error initializing /tmp/custom.db:', err)
    }

    process.env.DATABASE_URL = `file:${tmpDbPath}`
  } else {
    // Local development environment: resolve absolute path to db/custom.db
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

globalForPrisma.prisma = db

export function ensureDatabaseReady(): void {
  setupDatabaseUrl()
}