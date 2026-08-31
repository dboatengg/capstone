import express from 'express';
import prisma from '../db/prisma.js';
import { validateInquiryMiddleware, validateUpdateInquiryMiddleware } from '../utils/validate.js';
import { requireAdmin, requireAuth, requireAgent, requireClient } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Prisma select config for inquiry responses (include property and client details)
const inquirySelect = {
  id: true,
  message: true,
  status: true,
  createdAt: true,
  property: {
    select: {
      id: true,
      title: true,
      location: true,
      agent: { select: { id: true, name: true } }
    }
  },
  client: { select: { id: true, name: true, email: true } }
}

// GET all inquiries (admins see all, agents see only their property inquiries)
router.get('/', requireAuth, requireAgent, async (req, res) => {
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  const inquiries = await prisma.inquiry.findMany({
    where: isAdmin ? {} : { property: { agentId } },
    select: inquirySelect,
    orderBy: { createdAt: 'asc' }
  })

  res.json(inquiries);
})

// GET single inquiry
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const inquiry = await prisma.inquiry.findUnique({ where: { id }, select: inquirySelect })
  if(!inquiry) return res.status(404).json({error: 'Inquiry not found'})
  res.json(inquiry);
})

// POST create inquiry (clients only)
router.post('/', requireAuth, requireClient, validateInquiryMiddleware, async (req, res) => {
  const clientId = req.user.userId
  const { propertyId, message } = req.body

  const property = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!property) throw new AppError('Property not found', 404)
  // Prevent inquiries on unavailable properties
  if (!property.available) throw new AppError('This property is no longer available', 400)

  try {
    const inquiry = await prisma.inquiry.create({
      data: { clientId, propertyId, message }
    })
    res.status(201).json(inquiry)
  } catch (err) {
    // Prevent duplicate inquiries from same client for same property
    if (err.code === 'P2002') {
      throw new AppError('You have already sent an inquiry for this property', 400)
    }
    throw err
  }
})

// PUT update inquiry (owner agent or admin only)
router.put('/:id', requireAuth, requireAgent, validateUpdateInquiryMiddleware, async (req, res) => {
  const { id } = req.params
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { property: true }
  })
  if (!inquiry) throw new AppError('Inquiry not found', 404)

  const isOwner = inquiry.property.agentId === agentId

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this inquiry', 403)
  }

  const updated = await prisma.inquiry.update({
    where: { id },
    data: req.body,
    select: inquirySelect
  })
  res.json(updated)
})

// DELETE inquiry (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const inquiry = await prisma.inquiry.findUnique({ where: { id } })
  if (!inquiry) throw new AppError('Inquiry not found', 404)
  await prisma.inquiry.delete({ where: { id } })
  res.status(204).send()
})

export default router;