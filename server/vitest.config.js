import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    // Integration tests share one DB — run files sequentially
    fileParallelism: false,
    hookTimeout: 30000,
    testTimeout: 15000,
  },
})
