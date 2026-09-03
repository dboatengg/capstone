import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import {
  api,
  authHeader,
  getAgentToken,
  getClientToken,
} from '../helpers/request.js'
import { resetDatabase, seedTestData, disconnectDatabase } from '../helpers/db.js'

describe('route permissions', () => {
  let fixtures
  let adminToken
  let agent1Token
  let agent2Token
  let clientToken

  beforeAll(async () => {
    await resetDatabase()
  })

  beforeEach(async () => {
    await resetDatabase()
    fixtures = await seedTestData()

    adminToken = await getAgentToken(fixtures.admin.email, fixtures.password)
    agent1Token = await getAgentToken(fixtures.agent1.email, fixtures.password)
    agent2Token = await getAgentToken(fixtures.agent2.email, fixtures.password)
    clientToken = await getClientToken(fixtures.client.email, fixtures.password)
  })

  afterAll(async () => {
    await resetDatabase()
    await disconnectDatabase()
  })

  describe('GET /api/admin/dashboard', () => {
    it('allows admin access', async () => {
      const res = await api()
        .get('/api/admin/dashboard')
        .set(authHeader(adminToken))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        properties: 2,
        agents: 3,
        clients: 1,
        inquiries: 0,
      })
    })

    it('denies regular agent', async () => {
      const res = await api()
        .get('/api/admin/dashboard')
        .set(authHeader(agent1Token))

      expect(res.status).toBe(403)
      expect(res.body.error).toBe('Admin access required')
    })

    it('denies unauthenticated requests', async () => {
      const res = await api().get('/api/admin/dashboard')

      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/agents', () => {
    it('allows admin to list all agents', async () => {
      const res = await api()
        .get('/api/agents')
        .set(authHeader(adminToken))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(3)
    })

    it('denies regular agent', async () => {
      const res = await api()
        .get('/api/agents')
        .set(authHeader(agent1Token))

      expect(res.status).toBe(403)
    })
  })

  describe('GET /api/clients', () => {
    it('allows admin to list all clients', async () => {
      const res = await api()
        .get('/api/clients')
        .set(authHeader(adminToken))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
    })

    it('denies client access', async () => {
      const res = await api()
        .get('/api/clients')
        .set(authHeader(clientToken))

      expect(res.status).toBe(403)
    })
  })

  describe('GET /api/clients/:id', () => {
    it('allows client to view own profile', async () => {
      const res = await api()
        .get(`/api/clients/${fixtures.client.id}`)
        .set(authHeader(clientToken))

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(fixtures.client.id)
    })

    it('denies other clients from viewing profile', async () => {
      const res = await api()
        .get(`/api/clients/${fixtures.client.id}`)
        .set(authHeader(agent1Token))

      expect(res.status).toBe(403)
      expect(res.body.error).toBe('You are not authorized to view this client')
    })
  })

  describe('GET /api/properties', () => {
    it('is public — no auth required', async () => {
      const res = await api().get('/api/properties')

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
    })
  })

  describe('POST /api/properties', () => {
    const newProperty = {
      title: 'New Listing',
      shortDescription: 'Short',
      longDescription: 'Long',
      price: 150000,
      type: 'sale',
      bedrooms: 2,
      bathrooms: 1,
      location: 'Tema',
    }

    it('allows agent to create a property', async () => {
      const res = await api()
        .post('/api/properties')
        .set(authHeader(agent1Token))
        .send(newProperty)

      expect(res.status).toBe(201)
      expect(res.body.title).toBe(newProperty.title)
      expect(res.body.agentId).toBe(fixtures.agent1.id)
    })

    it('denies client from creating a property', async () => {
      const res = await api()
        .post('/api/properties')
        .set(authHeader(clientToken))
        .send(newProperty)

      expect(res.status).toBe(403)
      expect(res.body.error).toBe('Agent access required')
    })
  })

  describe('PUT /api/properties/:id', () => {
    it('allows owner agent to update their property', async () => {
      const res = await api()
        .put(`/api/properties/${fixtures.agent1Property.id}`)
        .set(authHeader(agent1Token))
        .send({ title: 'Updated Title' })

      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Updated Title')
    })

    it('denies non-owner agent from updating property', async () => {
      const res = await api()
        .put(`/api/properties/${fixtures.agent1Property.id}`)
        .set(authHeader(agent2Token))
        .send({ title: 'Hijacked Title' })

      expect(res.status).toBe(403)
      expect(res.body.error).toBe('You are not authorized to update this property')
    })

    it('allows admin to update any property', async () => {
      const res = await api()
        .put(`/api/properties/${fixtures.agent2Property.id}`)
        .set(authHeader(adminToken))
        .send({ title: 'Admin Updated' })

      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Admin Updated')
    })
  })

  describe('DELETE /api/properties/:id', () => {
    it('allows owner agent to delete their property', async () => {
      const res = await api()
        .delete(`/api/properties/${fixtures.agent1Property.id}`)
        .set(authHeader(agent1Token))

      expect(res.status).toBe(204)
    })

    it('denies non-owner agent from deleting property', async () => {
      const res = await api()
        .delete(`/api/properties/${fixtures.agent1Property.id}`)
        .set(authHeader(agent2Token))

      expect(res.status).toBe(403)
      expect(res.body.error).toBe('You are not authorized to delete this property')
    })
  })

  describe('POST /api/inquiries', () => {
    it('allows client to create an inquiry', async () => {
      const res = await api()
        .post('/api/inquiries')
        .set(authHeader(clientToken))
        .send({
          propertyId: fixtures.agent1Property.id,
          message: 'Is this still available?',
        })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe('Is this still available?')
    })

    it('denies agent from creating an inquiry', async () => {
      const res = await api()
        .post('/api/inquiries')
        .set(authHeader(agent1Token))
        .send({
          propertyId: fixtures.agent2Property.id,
          message: 'Agent inquiry',
        })

      expect(res.status).toBe(403)
      expect(res.body.error).toBe('Client access required')
    })
  })

  describe('GET /api/inquiries', () => {
    beforeEach(async () => {
      await api()
        .post('/api/inquiries')
        .set(authHeader(clientToken))
        .send({
          propertyId: fixtures.agent1Property.id,
          message: 'Interested!',
        })
    })

    it('returns only inquiries for agent-owned properties', async () => {
      const res = await api()
        .get('/api/inquiries')
        .set(authHeader(agent1Token))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].property.id).toBe(fixtures.agent1Property.id)
    })

    it('returns empty list for agent with no matching inquiries', async () => {
      const res = await api()
        .get('/api/inquiries')
        .set(authHeader(agent2Token))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(0)
    })

    it('returns all inquiries for admin', async () => {
      const res = await api()
        .get('/api/inquiries')
        .set(authHeader(adminToken))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
    })
  })

  describe('PUT /api/agents/:id', () => {
    it('prevents agent from self-promoting to admin', async () => {
      const res = await api()
        .put(`/api/agents/${fixtures.agent1.id}`)
        .set(authHeader(agent1Token))
        .send({ role: 'admin' })

      expect(res.status).toBe(200)
      expect(res.body.role).toBe('agent')
    })

    it('allows admin to change agent role', async () => {
      const res = await api()
        .put(`/api/agents/${fixtures.agent2.id}`)
        .set(authHeader(adminToken))
        .send({ role: 'admin' })

      expect(res.status).toBe(200)
      expect(res.body.role).toBe('admin')
    })
  })
})
