import express from 'express';      
import prisma from '../db/prisma.js';
import { validateInquiryMiddleware, validateUpdateInquiryMiddleware } from '../utils/validate.js';

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
router.get('/', async (req, res) => {
    const inquiries = await prisma.inquiry.findMany({select: inquirySelect})
    res.json(inquiries);
})

// get single inquiry
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const inquiry = await prisma.inquiry.findUnique({ where: { id }, select: inquirySelect })
    if(!inquiry) return res.status(404).json({error: 'Inquiry not found'})
    res.json(inquiry);
})

// create inquiry
router.post('/', requireAuth, validateInquiryMiddleware, async (req, res) => {
    const clientId = req.user.userId  
    const { propertyId, message } = req.body
    const inquiry = await prisma.inquiry.create({
      data: { clientId, propertyId, message }
    })
    res.status(201).json(inquiry)
  })

// update inquiry
router.put('/:id', requireAuth, validateUpdateInquiryMiddleware, async (req, res) => {
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