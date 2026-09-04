import { resetDatabase, seedTestData, disconnectDatabase } from '../helpers/db.js'

await resetDatabase()
await seedTestData()
await disconnectDatabase()

console.log('E2E database seeded.')
