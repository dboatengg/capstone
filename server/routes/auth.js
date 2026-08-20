import express from 'express'
import prisma from '../db/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from 'zod'

const router = express.Router()

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (!result.success) return res.status(400).json({ errors: result.error.issues })
        req.body = result.data
        next()
    }
}

const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required')
})

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

async function issueRefreshToken(userId, userType) {
  const token = crypto.randomBytes(40).toString('hex')
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)

  await prisma.refreshToken.create({
    data: { token, userId, userType, expiresAt }
  })

  return token
}

function setRefreshCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  })
}

// AGENT REGISTER
router.post('/agent/register', validate(registerSchema), async (req, res) => {
    const { name, email, password } = req.body

    const existingAgent = await prisma.agent.findUnique({ where: { email } })
    if (existingAgent) return res.status(400).json({ error: 'Email already in use' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await prisma.$transaction(async (tx) => {
      const agent = await tx.agent.create({
        data: { name, email, password: hashedPassword }
      })

      const token = signAccessToken(
        { userId: agent.id, email: agent.email, role: agent.role, userType: "agent" }
      )

      return { agent, token }
    })

    const refreshToken = await issueRefreshToken(result.agent.id, 'agent')
    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      agent: {
        id: result.agent.id,
        name: result.agent.name,
        email: result.agent.email,
        role: result.agent.role
      },
      token: result.token
    })
  })


// AGENT LOGIN
router.post('/agent/login', validate(loginSchema), async (req, res) => {
    const { email, password } = req.body

    const agent = await prisma.agent.findUnique({ where: { email } })
    if (!agent) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValid = await bcrypt.compare(password, agent.password)
    if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signAccessToken(
      { userId: agent.id, email: agent.email, role: agent.role, userType: "agent" }
    )

    const refreshToken = await issueRefreshToken(agent.id, 'agent')
    setRefreshCookie(res, refreshToken)

    res.json({
    agent: { id: agent.id, name: agent.name, email: agent.email, role: agent.role },
    token
    })
})


// CLIENT REGISTER
router.post('/client/register', validate(registerSchema), async (req, res) => {
    const { name, email, password } = req.body

    const existingClient = await prisma.client.findUnique({ where: { email } })
    if (existingClient) return res.status(400).json({ error: 'Email already in use' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: { name, email, password: hashedPassword }
      })

      const token = signAccessToken(
        { userId: client.id, email: client.email, userType: 'client' }
      )

      return { client, token }
    })

    const refreshToken = await issueRefreshToken(result.client.id, 'client')
    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      client: {
        id: result.client.id,
        name: result.client.name,
        email: result.client.email,
      },
      token: result.token
    })
  })


// CLIENT LOGIN
router.post('/client/login', validate(loginSchema), async (req, res) => {
    const { email, password } = req.body

    const client = await prisma.client.findUnique({ where: { email } })
    if (!client) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValid = await bcrypt.compare(password, client.password)
    if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signAccessToken(
      { userId: client.id, email: client.email, userType: 'client' }
    )

    const refreshToken = await issueRefreshToken(client.id, 'client')
    setRefreshCookie(res, refreshToken)

    res.json({
    client: { id: client.id, name: client.name, email: client.email },
    token
    })
})


// REFRESH — exchange a valid refresh token cookie for a new access token
router.post('/refresh', async (req, res) => {
  const oldToken = req.cookies.refreshToken
  if (!oldToken) return res.status(401).json({ error: 'No refresh token provided' })

  const stored = await prisma.refreshToken.findUnique({ where: { token: oldToken } })

  if (!stored || stored.expiresAt < new Date()) {
    res.clearCookie('refreshToken')
    return res.status(401).json({ error: 'Refresh token invalid or expired' })
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } })
  const newRefreshToken = await issueRefreshToken(stored.userId, stored.userType)
  setRefreshCookie(res, newRefreshToken)

  let payload
  if (stored.userType === 'agent') {
    const agent = await prisma.agent.findUnique({ where: { id: stored.userId } })
    if (!agent) return res.status(401).json({ error: 'User no longer exists' })
    payload = { userId: agent.id, email: agent.email, role: agent.role, userType: 'agent' }
  } else {
    const client = await prisma.client.findUnique({ where: { id: stored.userId } })
    if (!client) return res.status(401).json({ error: 'User no longer exists' })
    payload = { userId: client.id, email: client.email, userType: 'client' }
  }

  const newAccessToken = signAccessToken(payload)
  res.json({ token: newAccessToken })
})


// LOGOUT — revoke the refresh token server-side
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } })
  }
  res.clearCookie('refreshToken')
  res.status(204).send()
})

export default router;