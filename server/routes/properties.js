import express from 'express';      
import prisma from '../db/prisma.js';
import { validatePropertyMiddleware, validateUpdatePropertyMiddleware } from '../utils/validate.js';
import { requireAuth, requireAdmin, requireAgent, requireClient } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();   

const propertySelect = {
    id: true,
    title: true,
    shortDescription: true,
    longDescription: true,
    price: true,
    type: true,
    available: true,
    bedrooms: true,
    bathrooms: true,
    location: true,
    createdAt: true,
    updatedAt: true,
    agent: {
      select: { id: true, name: true, email: true, phone: true, whatsapp: true }
    }
  }

// get all properties
router.get('/', async (req, res) => {
    const properties = await prisma.property.findMany({select: propertySelect})
    res.json(properties);
})

// get single property
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const property = await prisma.property.findUnique({ where: { id }, select: propertySelect })
    if (!property) throw new AppError('Property not found', 404) 
    res.json(property)
})

// create property
router.post('/', requireAuth, requireAgent, validatePropertyMiddleware, async (req, res) => {
    const agentId = req.user.userId
    const property = await prisma.property.create({ data: { ...req.body, agentId } })
    res.status(201).json(property);
})

// update property
router.put('/:id', requireAuth, requireAgent, validateUpdatePropertyMiddleware, async (req, res) => {
    const { id } = req.params
    const property = await prisma.property.findUnique({ where: { id } })
    if (!property) throw new AppError('Property not found', 404)
    
    // only the agent who owns this property can update it
    if (property.agentId !== req.user.userId) {
      throw new AppError('You are not authorized to update this property', 403)
    }
    
    const updated = await prisma.property.update({ where: { id }, data: req.body, select: propertySelect })
    res.json(updated)
  })

// delete property
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const property = await prisma.property.findUnique({ where: { id }, select: propertySelect })
    if (!property) throw new AppError('Property not found', 404)
    await prisma.property.delete({ where: { id } })
    res.status(204).send();
})

export default router;