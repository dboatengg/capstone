import express from 'express'
import prisma from '../db/prisma.js'
import { upload } from '../config/cloudinary.js'
import { validateAgentMiddleware, validateUpdateAgentMiddleware } from '../utils/validate.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Prisma select config for agent responses
const agentSelect = {id:true, name:true, email:true, phone:true, whatsapp:true, role:true, profileImage:true, properties: true}

// GET all agents (admin only)
router.get("/", requireAuth, requireAdmin, async(req, res) => {
  const agents = await prisma.agent.findMany({
    select: agentSelect,
    orderBy: { createdAt: 'asc' }
  })
  res.json(agents);
})

// GET single agent by ID (contact info is visible on property listings)
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const agent = await prisma.agent.findUnique({ where: { id }, select: agentSelect })
  if (!agent) throw new AppError('Agent not found', 404)
  res.json(agent)
})

// POST create new agent (admin only)
router.post('/', requireAuth, requireAdmin, validateAgentMiddleware, async (req, res) => {
  const newAgent = await prisma.agent.create({ data: req.body, select: agentSelect });
  res.status(201).json(newAgent);
})

// PUT update agent (owner or admin only)
router.put('/:id', requireAuth, validateUpdateAgentMiddleware, async (req, res) => {
  const { id } = req.params

  const isOwner = req.user.userId === id
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this agent', 403)
  }

  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) throw new AppError('Agent not found', 404)

  // Prevent role self-promotion (admin-only field)
  const data = { ...req.body }
  if (!isAdmin) {
    delete data.role
  }

  const updatedAgent = await prisma.agent.update({
    where: { id },
    data,
    select: agentSelect
  })
  res.json(updatedAgent)
})

// DELETE agent (admin only, check for associated properties first)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) throw new AppError('Agent not found', 404)

  // Check for associated properties
  const propertyCount = await prisma.property.count({ where: { agentId: id } })
  if (propertyCount > 0) {
    throw new AppError(
      `Cannot delete this agent - they still have ${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} listed. Reassign or delete those first.`,
      400
    )
  }

  await prisma.agent.delete({ where: { id } })
  res.status(204).send()
})

// POST upload profile image (owner or admin only)
router.post('/:id/profile-image', requireAuth, upload.single('profileImage'), async (req, res) => {
  const { id } = req.params
  const isOwner = req.user.userId === id
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this profile', 403)
  }

  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) throw new AppError('Agent not found', 404)

  if (!req.file) {
    throw new AppError('No image provided', 400)
  }

  const updated = await prisma.agent.update({
    where: { id },
    data: { profileImage: req.file.path },
    select: agentSelect,
  })

  res.json(updated)
})

export default router