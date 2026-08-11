import express from 'express';      
import prisma from '../db/prisma.js';
import { validateInquiryMiddleware, validateUpdateInquiryMiddleware } from '../utils/validate.js';
import { requireAdmin, requireAuth, requireAgent, requireClient } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();   

const inquirySelect = {
  id: true,
  message: true,
  status: true,
  createdAt: true,
  property: { select: { id: true, title: true, location: true } },
  client: { select: { id: true, name: true, email: true } }
}

// get all inquiries
router.get('/', requireAuth, requireAgent, async (req, res) => {
  const inquiries = await prisma.inquiry.findMany({select: inquirySelect})
  res.json(inquiries);
})

// check if the current client has already inquired about a property
// MUST come before /:id, or Express matches "check" as if it were an :id
router.get('/check/:propertyId', requireAuth, requireClient, async (req, res) => {
  const { propertyId } = req.params
  const clientId = req.user.userId

  const existing = await prisma.inquiry.findUnique({
    where: { clientId_propertyId: { clientId, propertyId } }
  })

  res.json({ alreadyInquired: !!existing })
})

// get single inquiry
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const inquiry = await prisma.inquiry.findUnique({ where: { id }, select: inquirySelect })
  if(!inquiry) return res.status(404).json({error: 'Inquiry not found'})
  res.json(inquiry);
})

// create inquiry
router.post('/', requireAuth, requireClient, validateInquiryMiddleware, async (req, res) => {
  const clientId = req.user.userId
  const { propertyId, message } = req.body

  const property = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!property) throw new AppError('Property not found', 404)
  if (!property.available) throw new AppError('This property is no longer available', 400)

  try {
    const inquiry = await prisma.inquiry.create({
      data: { clientId, propertyId, message }
    })
    res.status(201).json(inquiry)
  } catch (err) {
    if (err.code === 'P2002') {
      throw new AppError('You have already sent an inquiry for this property', 400)
    }
    throw err
  }
})

// update inquiry
router.put('/:id', requireAuth, requireAgent, validateUpdateInquiryMiddleware, async (req, res) => {
  const { id } = req.params
  const inquiry = await prisma.inquiry.findUnique({ where: { id } })
  if (!inquiry) throw new AppError('Inquiry not found', 404)
  const updated = await prisma.inquiry.update({
    where: { id },
    data: req.body
  })
  res.json(updated)
})

// delete inquiry
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const inquiry = await prisma.inquiry.findUnique({ where: { id } })
  if (!inquiry) throw new AppError('Inquiry not found', 404)
  await prisma.inquiry.delete({ where: { id } })
  res.status(204).send()
})

export default router;