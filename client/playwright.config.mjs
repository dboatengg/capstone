import { defineConfig } from '@playwright/test'
import path from 'path'
import { config as loadEnv } from 'dotenv'

const clientDir = process.cwd()
const serverDir = path.resolve(clientDir, '../server')
const testEnv = loadEnv({ path: path.join(serverDir, '.env.test') }).parsed ?? {}

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.mjs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: serverDir,
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        PORT: '3000',
        DATABASE_URL: testEnv.DATABASE_URL ?? process.env.DATABASE_URL ?? '',
        JWT_SECRET: testEnv.JWT_SECRET ?? 'test-jwt-secret-at-least-32-characters-long',
      },
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:4000',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
      },
    },
  ],
})
