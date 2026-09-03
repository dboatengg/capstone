import request from 'supertest'
import app from '../../app.js'

export { app }

export function api() {
  return request(app)
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` }
}

export async function loginAgent(email, password) {
  const res = await api()
    .post('/auth/agent/login')
    .send({ email, password })

  return res
}

export async function loginClient(email, password) {
  const res = await api()
    .post('/auth/client/login')
    .send({ email, password })

  return res
}

export async function getAgentToken(email, password) {
  const res = await loginAgent(email, password)
  return res.body.token
}

export async function getClientToken(email, password) {
  const res = await loginClient(email, password)
  return res.body.token
}
