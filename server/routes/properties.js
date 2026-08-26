import { upload } from '../config/cloudinary.js'
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
    images: true,
    createdAt: true,
    updatedAt: true,
    agent: {
      select: { id: true, name: true, email: true, phone: true, whatsapp: true }
    }
  }

// get all properties
router.get('/', async (req, res) => {
  const {
    search,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
  } = req.query;

  const where = {};

  // Text search: title and location
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        location: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  // Price range
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  // Bedrooms
  if (bedrooms) {
    where.bedrooms = Number(bedrooms);
  }

  // Bathrooms
  if (bathrooms) {
    where.bathrooms = Number(bathrooms);
  }

  const properties = await prisma.property.findMany({
    where,
    select: propertySelect,
    orderBy: { createdAt: 'asc' },
  });

  res.json(properties);
});



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
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property) throw new AppError('Property not found', 404)

  const isOwner = property.agentId === agentId

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403)
  }

  // only an admin may reassign a property to a different agent
  const data = { ...req.body }
  if (!isAdmin) {
    delete data.agentId
  }

  const updated = await prisma.property.update({ where: { id }, data, select: propertySelect })
  res.json(updated)
})

// delete property — admin can delete any property, agent can only delete their own
router.delete('/:id', requireAuth, requireAgent, async (req, res) => {
  const { id } = req.params
  const property = await prisma.property.findUnique({ where: { id }, select: propertySelect })
  if (!property) throw new AppError('Property not found', 404)

  const isOwner = property.agent.id === req.user.userId
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to delete this property', 403)
  }

  await prisma.property.delete({ where: { id } })
  res.status(204).send();
})



// upload images to a property — owner agent or admin only
router.post('/:id/images', requireAuth, requireAgent, upload.array('images', 10), async (req, res) => {
  const { id } = req.params
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property) throw new AppError('Property not found', 404)

  const isOwner = property.agentId === agentId
  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403)
  }

  if (!req.files || req.files.length === 0) {
    throw new AppError('No images provided', 400)
  }

  const newImageUrls = req.files.map(file => file.path)

  const updated = await prisma.property.update({
    where: { id },
    data: { images: [...property.images, ...newImageUrls] },
    select: propertySelect,
  })

  res.json(updated)
})

// remove a single image from a property — owner agent or admin only
router.delete('/:id/images', requireAuth, requireAgent, async (req, res) => {
  const { id } = req.params
  const { imageUrl } = req.body
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property) throw new AppError('Property not found', 404)

  const isOwner = property.agentId === agentId
  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403)
  }

  const updated = await prisma.property.update({
    where: { id },
    data: { images: property.images.filter(img => img !== imageUrl) },
    select: propertySelect,
  })

  res.json(updated)
})


// reorder a property's images - owner agent or admin only
router.put('/:id/images/reorder', requireAuth, requireAgent, async (req, res) => {
  const { id } = req.params
  const { images } = req.body
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property) throw new AppError('Property not found', 404)

  const isOwner = property.agentId === agentId
  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403)
  }

  if (!Array.isArray(images)) {
    throw new AppError('images must be an array', 400)
  }

  const currentSet = new Set(property.images)
  const newSet = new Set(images)
  const sameContents =
    currentSet.size === newSet.size &&
    [...currentSet].every(url => newSet.has(url))

  if (!sameContents) {
    throw new AppError('New image order must contain the same images', 400)
  }

  const updated = await prisma.property.update({
    where: { id },
    data: { images },
    select: propertySelect,
  })

  res.json(updated)
})

export default router;