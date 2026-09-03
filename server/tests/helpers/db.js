import bcrypt from 'bcrypt'
import prisma from '../../db/prisma.js'

const TEST_PASSWORD = 'password123'

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Inquiry", "Property", "RefreshToken", "Client", "Agent" RESTART IDENTITY CASCADE;
  `)
}

export async function seedTestData() {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)

  const admin = await prisma.agent.create({
    data: {
      name: 'Test Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const agent1 = await prisma.agent.create({
    data: {
      name: 'Agent One',
      email: 'agent1@test.com',
      password: hashedPassword,
    },
  })

  const agent2 = await prisma.agent.create({
    data: {
      name: 'Agent Two',
      email: 'agent2@test.com',
      password: hashedPassword,
    },
  })

  const client = await prisma.client.create({
    data: {
      name: 'Test Client',
      email: 'client1@test.com',
      password: hashedPassword,
    },
  })

  const agent1Property = await prisma.property.create({
    data: {
      title: 'Agent One Listing',
      shortDescription: 'Short desc',
      longDescription: 'Long desc',
      price: 100000,
      type: 'sale',
      bedrooms: 2,
      bathrooms: 1,
      location: 'Accra',
      agentId: agent1.id,
    },
  })

  const agent2Property = await prisma.property.create({
    data: {
      title: 'Agent Two Listing',
      shortDescription: 'Short desc',
      longDescription: 'Long desc',
      price: 200000,
      type: 'rent',
      bedrooms: 3,
      bathrooms: 2,
      location: 'Kumasi',
      agentId: agent2.id,
    },
  })

  return {
    password: TEST_PASSWORD,
    admin,
    agent1,
    agent2,
    client,
    agent1Property,
    agent2Property,
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}
