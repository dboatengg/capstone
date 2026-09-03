import { config } from 'dotenv'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serverRoot = resolve(__dirname, '../..')
const envPath = resolve(serverRoot, '.env')
const envTestPath = resolve(serverRoot, '.env.test')

config({ path: envPath })

const devUrl = process.env.DATABASE_URL
if (!devUrl) {
  console.error('No DATABASE_URL found in server/.env')
  process.exit(1)
}

// Swap the database name to capstone_test, keep user/password/host the same
const testUrl = devUrl.replace(/\/([^/?]+)(\?.*)?$/, '/capstone_test$2')

const contents = `# Auto-generated from server/.env — only the database name differs
DATABASE_URL=${testUrl}
JWT_SECRET=test-jwt-secret-at-least-32-characters-long
`

writeFileSync(envTestPath, contents)
console.log(`Wrote ${envTestPath}`)
console.log(`DATABASE_URL=${testUrl}`)
