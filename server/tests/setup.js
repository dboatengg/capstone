import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Override any values loaded from server/.env via db/prisma.js
config({ path: resolve(__dirname, '../.env.test'), override: true })

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Run: npm run test:env:init'
  )
}

if (url.includes('YOUR_PASSWORD') || url.includes('user:password')) {
  throw new Error(
    'DATABASE_URL in .env.test still has placeholder credentials. Run: npm run test:env:init'
  )
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long'
}
