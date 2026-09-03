import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import {
  requireAuth,
  requireAdmin,
  requireAgent,
  requireClient,
} from '../../middleware/auth.js'

function mockRes() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('auth middleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long'
  })

  describe('requireAuth', () => {
    it('returns 401 when no Authorization header is provided', () => {
      const req = { headers: {} }
      const res = mockRes()
      const next = vi.fn()

      requireAuth(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' })
      expect(next).not.toHaveBeenCalled()
    })

    it('returns 401 when Authorization header has no token', () => {
      const req = { headers: { authorization: 'Bearer' } }
      const res = mockRes()
      const next = vi.fn()

      requireAuth(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' })
      expect(next).not.toHaveBeenCalled()
    })

    it('returns 401 for invalid token', () => {
      const req = { headers: { authorization: 'Bearer invalid-token' } }
      const res = mockRes()
      const next = vi.fn()

      requireAuth(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' })
      expect(next).not.toHaveBeenCalled()
    })

    it('returns 401 for expired token', () => {
      const expired = jwt.sign(
        { userId: '1', userType: 'agent' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      )
      const req = { headers: { authorization: `Bearer ${expired}` } }
      const res = mockRes()
      const next = vi.fn()

      requireAuth(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Session expired, please log in again',
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('attaches decoded user and calls next for valid token', () => {
      const payload = {
        userId: 'user-1',
        email: 'agent@test.com',
        role: 'agent',
        userType: 'agent',
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
      const req = { headers: { authorization: `Bearer ${token}` } }
      const res = mockRes()
      const next = vi.fn()

      requireAuth(req, res, next)

      expect(req.user).toMatchObject(payload)
      expect(next).toHaveBeenCalledOnce()
    })
  })

  describe('requireAdmin', () => {
    it('returns 403 when user is not admin', () => {
      const req = { user: { role: 'agent' } }
      const res = mockRes()
      const next = vi.fn()

      requireAdmin(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' })
      expect(next).not.toHaveBeenCalled()
    })

    it('calls next when user is admin', () => {
      const req = { user: { role: 'admin' } }
      const res = mockRes()
      const next = vi.fn()

      requireAdmin(req, res, next)

      expect(next).toHaveBeenCalledOnce()
    })
  })

  describe('requireAgent', () => {
    it('returns 403 when user is not an agent', () => {
      const req = { user: { userType: 'client' } }
      const res = mockRes()
      const next = vi.fn()

      requireAgent(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Agent access required' })
      expect(next).not.toHaveBeenCalled()
    })

    it('calls next when user is an agent', () => {
      const req = { user: { userType: 'agent' } }
      const res = mockRes()
      const next = vi.fn()

      requireAgent(req, res, next)

      expect(next).toHaveBeenCalledOnce()
    })
  })

  describe('requireClient', () => {
    it('returns 403 when user is not a client', () => {
      const req = { user: { userType: 'agent' } }
      const res = mockRes()
      const next = vi.fn()

      requireClient(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Client access required' })
      expect(next).not.toHaveBeenCalled()
    })

    it('calls next when user is a client', () => {
      const req = { user: { userType: 'client' } }
      const res = mockRes()
      const next = vi.fn()

      requireClient(req, res, next)

      expect(next).toHaveBeenCalledOnce()
    })
  })
})
