import express from 'express'
import prisma from '../db/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const router = express.Router()

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


// AGENT REGISTER
router.post('/agent/register', validate(registerSchema), async (req, res) => {
    const { name, email, password } = req.body
  
    const existingAgent = await prisma.agent.findUnique({ where: { email } })
    if (existingAgent) return res.status(400).json({ error: 'Email already in use' })
  
    const hashedPassword = await bcrypt.hash(password, 10)
  
    // wrap in transaction — if token signing fails, agent creation rolls back
    const result = await prisma.$transaction(async (tx) => {
      const agent = await tx.agent.create({
        data: { name, email, password: hashedPassword }
      })
  
      const token = jwt.sign(
        { userId: agent.id, email: agent.email, role: agent.role, userType:"agent" },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
  
      return { agent, token }
    })
  
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

    // find the agent
    const agent = await prisma.agent.findUnique({ where: { email } })
    if (!agent) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    // compare password with stored hash
    const isValid = await bcrypt.compare(password, agent.password)
    if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    // create and sign a JWT
    const token = jwt.sign(
    { userId: agent.id, email: agent.email, role: agent.role, userType: "agent" },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
    )

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
  
    // wrap in transaction — if token signing fails, client creation rolls back
    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: { name, email, password: hashedPassword }
      })
  
      const token = jwt.sign(
        { userId: client.id, email: client.email, userType: 'client' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
  
      return { client, token }
    })
  
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

    // find the client
    const client = await prisma.client.findUnique({ where: { email } })
    if (!client) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    // compare password with stored hash
    const isValid = await bcrypt.compare(password, client.password)
    if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' })
    }

    // create and sign a JWT
    const token = jwt.sign(
    { userId: client.id, email: client.email, userType: 'client' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
    )

    res.json({
    client: { id: client.id, name: client.name, email: client.email },
    token
    })
})

export default router;