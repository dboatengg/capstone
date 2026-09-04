import { execSync } from 'child_process'
import path from 'path'
import { config } from 'dotenv'

const clientDir = process.cwd()
const serverDir = path.resolve(clientDir, '../server')

config({ path: path.join(serverDir, '.env.test'), override: true })

export default async function globalSetup() {
  execSync('node tests/scripts/seed-e2e.js', {
    cwd: serverDir,
    stdio: 'inherit',
    env: process.env,
  })
}
