const fs = require('fs')
const path = require('path')

try {
  const rootDir = path.resolve(__dirname, '..')
  const staticSrc = path.join(rootDir, '.next', 'static')
  const staticDest = path.join(rootDir, '.next', 'standalone', '.next', 'static')
  const publicSrc = path.join(rootDir, 'public')
  const publicDest = path.join(rootDir, '.next', 'standalone', 'public')

  if (fs.existsSync(path.join(rootDir, '.next', 'standalone'))) {
    if (fs.existsSync(staticSrc)) {
      fs.mkdirSync(path.dirname(staticDest), { recursive: true })
      fs.cpSync(staticSrc, staticDest, { recursive: true, force: true })
    }
    if (fs.existsSync(publicSrc)) {
      fs.cpSync(publicSrc, publicDest, { recursive: true, force: true })
    }
  }
} catch (err) {
  console.warn('Notice: standalone copy skipped or failed:', err.message)
}
