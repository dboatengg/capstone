import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { api } from '../helpers/request.js'
import { resetDatabase, seedTestData, disconnectDatabase } from '../helpers/db.js'

describe('auth routes', () => {
  let fixtures

  beforeAll(async () => {
    await resetDatabase()
  })

  beforeEach(async () => {
    await resetDatabase()
    fixtures = await seedTestData()
  })

  afterAll(async () => {
    await resetDatabase()
    await disconnectDatabase()
  })

  describe('POST /auth/agent/register', () => {
    it('registers a new agent and returns a token', async () => {
      const res = await api()
        .post('/auth/agent/register')
        .send({
          name: 'New Agent',
          email: 'newagent@test.com',
          password: 'password123',
        })

      expect(res.status).toBe(201)
      expect(res.body.token).toBeTypeOf('string')
      expect(res.body.agent).toMatchObject({
        name: 'New Agent',
        email: 'newagent@test.com',
        role: 'agent',
      })
      expect(res.body.agent).not.toHaveProperty('password')
    })

    it('rejects duplicate email', async () => {
      const res = await api()
        .post('/auth/agent/register')
        .send({
          name: 'Duplicate',
          email: fixtures.agent1.email,
          password: 'password123',
        })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Email already in use')
    })

    it('validates request body', async () => {
      const res = await api()
        .post('/auth/agent/register')
        .send({ name: '', email: 'not-an-email', password: 'short' })

      expect(res.status).toBe(400)
      expect(res.body.errors).toBeDefined()
    })
  })

  describe('POST /auth/agent/login', () => {
    it('logs in with valid credentials', async () => {
      const res = await api()
        .post('/auth/agent/login')
        .send({
          email: fixtures.agent1.email,
          password: fixtures.password,
        })

      expect(res.status).toBe(200)
      expect(res.body.token).toBeTypeOf('string')
      expect(res.body.agent.email).toBe(fixtures.agent1.email)
    })

    it('rejects invalid credentials', async () => {
      const res = await api()
        .post('/auth/agent/login')
        .send({
          email: fixtures.agent1.email,
          password: 'wrong-password',
        })

      expect(res.status).toBe(401)
      expect(res.body.error).toBe('Invalid email or password')
    })
  })

  describe('POST /auth/client/register', () => {
    it('registers a new client and returns a token', async () => {
      const res = await api()
        .post('/auth/client/register')
        .send({
          name: 'New Client',
          email: 'newclient@test.com',
          password: 'password123',
        })

      expect(res.status).toBe(201)
      expect(res.body.token).toBeTypeOf('string')
      expect(res.body.client).toMatchObject({
        name: 'New Client',
        email: 'newclient@test.com',
      })
    })
  })

  describe('POST /auth/client/login', () => {
    it('logs in with valid credentials', async () => {
      const res = await api()
        .post('/auth/client/login')
        .send({
          email: fixtures.client.email,
          password: fixtures.password,
        })

      expect(res.status).toBe(200)
      expect(res.body.token).toBeTypeOf('string')
      expect(res.body.client.email).toBe(fixtures.client.email)
    })
  })
})
