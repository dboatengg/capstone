import"dotenv/config"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Create PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// Use Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool)
// Initialize Prisma client
const prisma = new PrismaClient({ adapter })

export default prisma;