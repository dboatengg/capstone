import express from 'express'
import { upload } from '../config/cloudinary.js'
import prisma from '../db/prisma.js'
import { validateClientMiddleware, validateUpdateClientMiddleware } from '../utils/validate.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Prisma select config for client responses
const clientSelect = {id:true, name:true, email:true, phone:true, profileImage:true,}

// GET all clients (admin only)
router.get("/", requireAuth, requireAdmin, async(req, res) => {
  const clients = await prisma.client.findMany({
    select: clientSelect,
    orderBy: { createdAt: 'asc' }
  })
  res.json(clients);
})

// GET single client (owner or admin only)
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params

  const isOwner = req.user.userId === id
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to view this client', 403)
  }

  const client = await prisma.client.findUnique({ where: { id }, select: clientSelect })
  if (!client) throw new AppError('Client not found', 404)
  res.json(client)
})

// POST create new client (admin only)
router.post('/', requireAuth, requireAdmin, validateClientMiddleware, async (req, res) => {
  const newClient = await prisma.client.create({ data: req.body, select: clientSelect });
  res.status(201).json(newClient);
})

// PUT update client (owner or admin only)
router.put('/:id', requireAuth, validateUpdateClientMiddleware, async (req, res) => {
  const { id } = req.params

  const isOwner = req.user.userId === id
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this client', 403)
  }

  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) throw new AppError('Client not found', 404)

  const updatedClient = await prisma.client.update({
    where: { id },
    data: req.body,
    select: clientSelect
  })
  res.json(updatedClient)
})

// DELETE client (admin only, check for associated inquiries first)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) throw new AppError('Client not found', 404)

  // Check for associated inquiries
  const inquiryCount = await prisma.inquiry.count({ where: { clientId: id } })
  if (inquiryCount > 0) {
    throw new AppError(
      `Cannot delete this client - they have ${inquiryCount} inquir${inquiryCount === 1 ? 'y' : 'ies'} on record. Delete those first.`,
      400
    )
  }

  await prisma.client.delete({ where: { id } })
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

  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) throw new AppError('Client not found', 404)

  if (!req.file) {
    throw new AppError('No image provided', 400)
  }

  const updated = await prisma.client.update({
    where: { id },
    data: { profileImage: req.file.path },
    select: clientSelect,
  })

  res.json(updated)
})

export default router