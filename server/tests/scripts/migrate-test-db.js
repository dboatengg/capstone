import { config } from 'dotenv'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../.env.test'), override: true })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run: npm run test:env:init')
  process.exit(1)
}

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: process.env,
})

console.log('Test database migrations applied.')
