import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import prisma from '../../db/prisma.js'
import { api, authHeader, getAgentToken } from '../helpers/request.js'
import { resetDatabase, seedTestData, disconnectDatabase } from '../helpers/db.js'

describe('delete safeguards', () => {
  let fixtures
  let adminToken

  beforeAll(async () => {
    await resetDatabase()
  })

  beforeEach(async () => {
    await resetDatabase()
    fixtures = await seedTestData()
    adminToken = await getAgentToken(fixtures.admin.email, fixtures.password)
  })

  afterAll(async () => {
    await resetDatabase()
    await disconnectDatabase()
  })

  describe('DELETE /api/agents/:id', () => {
    it('blocks deleting an agent who still has properties', async () => {
      const res = await api()
        .delete(`/api/agents/${fixtures.agent1.id}`)
        .set(authHeader(adminToken))

      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/still have 1 propert/)
    })

    it('allows deleting an agent with no properties', async () => {
      const emptyAgent = await prisma.agent.create({
        data: {
          name: 'Empty Agent',
          email: 'empty-agent@test.com',
          password: fixtures.agent1.password,
        },
      })

      const res = await api()
        .delete(`/api/agents/${emptyAgent.id}`)
        .set(authHeader(adminToken))

      expect(res.status).toBe(204)

      const agent = await prisma.agent.findUnique({ where: { id: emptyAgent.id } })
      expect(agent).toBeNull()
    })

    it('denies non-admin from deleting agents', async () => {
      const agentToken = await getAgentToken(fixtures.agent1.email, fixtures.password)

      const res = await api()
        .delete(`/api/agents/${fixtures.agent2.id}`)
        .set(authHeader(agentToken))

      expect(res.status).toBe(403)
    })
  })

  describe('DELETE /api/clients/:id', () => {
    beforeEach(async () => {
      await prisma.inquiry.create({
        data: {
          clientId: fixtures.client.id,
          propertyId: fixtures.agent1Property.id,
          message: 'Interested in this property',
        },
      })
    })

    it('blocks deleting a client who has inquiries', async () => {
      const res = await api()
        .delete(`/api/clients/${fixtures.client.id}`)
        .set(authHeader(adminToken))

      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/inquir/)
    })

    it('allows deleting a client with no inquiries', async () => {
      const extraClient = await prisma.client.create({
        data: {
          name: 'Deletable Client',
          email: 'deletable@test.com',
          password: fixtures.client.password,
        },
      })

      const res = await api()
        .delete(`/api/clients/${extraClient.id}`)
        .set(authHeader(adminToken))

      expect(res.status).toBe(204)

      const client = await prisma.client.findUnique({ where: { id: extraClient.id } })
      expect(client).toBeNull()
    })
  })
})
