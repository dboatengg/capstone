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

// reorder images on a property — owner agent or admin only
router.put('/:id/images/reorder', requireAuth, requireAgent, async (req, res) => {
  const { id } = req.params
  const { images } = req.body
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  if (!Array.isArray(images) || !images.every(image => typeof image === 'string')) {
    throw new AppError('Images must be an array of URLs', 400)
  }

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property) throw new AppError('Property not found', 404)

  const isOwner = property.agentId === agentId
  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403)
  }

  const existingImages = new Set(property.images)
  if (
    images.length !== property.images.length ||
    new Set(images).size !== existingImages.size ||
    images.some(image => !existingImages.has(image))
  ) {
    throw new AppError('Images must contain the property\'s existing images', 400)
  }

  const updated = await prisma.property.update({
    where: { id },
    data: { images },
    select: propertySelect,
  })

  res.json(updated)
})


const MAX_PROPERTY_IMAGES = 12

// upload images to a property - owner agent or admin only
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

  const totalAfterUpload = property.images.length + req.files.length
  if (totalAfterUpload > MAX_PROPERTY_IMAGES) {
    const remaining = MAX_PROPERTY_IMAGES - property.images.length
    throw new AppError(
      remaining <= 0
        ? `This property already has the maximum of ${MAX_PROPERTY_IMAGES} images`
        : `You can only add ${remaining} more image${remaining === 1 ? '' : 's'} (${MAX_PROPERTY_IMAGES} max per property)`,
      400
    )
  }

  const newImageUrls = req.files.map(file => file.path)

  const updated = await prisma.property.update({
    where: { id },
    data: { images: [...property.images, ...newImageUrls] },
    select: propertySelect,
  })

  res.json(updated)
})

export default router;