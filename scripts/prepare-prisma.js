const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
if (!fs.existsSync(schemaPath)) {
  console.error('[prepare-prisma] schema.prisma not found at', schemaPath)
  process.exit(0)
}

let schema = fs.readFileSync(schemaPath, 'utf8')

// Check DATABASE_URL from environment
const dbUrl = process.env.DATABASE_URL || ''
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')

const targetProvider = isPostgres ? 'postgresql' : 'sqlite'
const currentProvider = schema.match(/provider\s*=\s*"(sqlite|postgresql)"/)?.[1]

if (currentProvider !== targetProvider) {
  schema = schema.replace(
    /provider\s*=\s*"(sqlite|postgresql)"/,
    `provider = "${targetProvider}"`
  )
  fs.writeFileSync(schemaPath, schema, 'utf8')
  console.log(`[prepare-prisma] Updated schema.prisma provider to: ${targetProvider}`)
} else {
  console.log(`[prepare-prisma] schema.prisma provider is already: ${targetProvider}`)
}
