import { upload } from '../config/cloudinary.js'
import express from 'express';      
import prisma from '../db/prisma.js';
import { validatePropertyMiddleware, validateUpdatePropertyMiddleware } from '../utils/validate.js';
import { requireAuth, requireAdmin, requireAgent, requireClient } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Prisma select config to include agent details in responses
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

// GET all properties with optional filters (search, price range, bedrooms, bathrooms)
router.get('/', async (req, res) => {
  const {
    search,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
  } = req.query;

  const where = {};

  // Search by title or location (case-insensitive)
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

  // Filter by price range
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  // Filter by bedroom count
  if (bedrooms) {
    where.bedrooms = Number(bedrooms);
  }

  // Filter by bathroom count
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



// GET single property by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const property = await prisma.property.findUnique({ where: { id }, select: propertySelect })
    if (!property) throw new AppError('Property not found', 404) 
    res.json(property)
})

// POST create property (agents only)
router.post('/', requireAuth, requireAgent, validatePropertyMiddleware, async (req, res) => {
    // Auto-assign property to authenticated agent
    const agentId = req.user.userId
    const property = await prisma.property.create({ data: { ...req.body, agentId } })
    res.status(201).json(property);
})

// PUT update property (owner agent or admin)
router.put('/:id', requireAuth, requireAgent, validateUpdatePropertyMiddleware, async (req, res) => {
  const { id } = req.params;
  const agentId = req.user.userId;
  const isAdmin = req.user.role === 'admin';

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new AppError('Property not found', 404);

  const isOwner = property.agentId === agentId;
  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403);
  }

  // Prevent agents from reassigning to different agents (admin only)
  const data = { ...req.body };
  if (!isAdmin) delete data.agentId;

  const updated = await prisma.property.update({ where: { id }, data, select: propertySelect });
  res.json(updated);
});

// DELETE property (admin can delete any, agent can only delete their own)
router.delete('/:id', requireAuth, requireAgent, async (req, res) => {
  const { id } = req.params;
  const property = await prisma.property.findUnique({ where: { id }, select: propertySelect });
  if (!property) throw new AppError('Property not found', 404);

  const isOwner = property.agent.id === req.user.userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to delete this property', 403);
  }

  await prisma.property.delete({ where: { id } });
  res.status(204).send();
});



// DELETE remove single image from property (owner agent or admin)
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
  });

  res.json(updated);
});

// PUT reorder images on property (owner agent or admin)
router.put('/:id/images/reorder', requireAuth, requireAgent, async (req, res) => {
  const { id } = req.params
  const { images } = req.body
  const agentId = req.user.userId
  const isAdmin = req.user.role === 'admin'

  // Validate images array format
  if (!Array.isArray(images) || !images.every(image => typeof image === 'string')) {
    throw new AppError('Images must be an array of URLs', 400);
  }

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new AppError('Property not found', 404);

  const isOwner = property.agentId === agentId;
  if (!isOwner && !isAdmin) {
    throw new AppError('You are not authorized to update this property', 403);
  }

  // Verify new order contains all existing images (no adds/removes, only reordering)
  const existingImages = new Set(property.images);
  if (
    images.length !== property.images.length ||
    new Set(images).size !== existingImages.size ||
    images.some(image => !existingImages.has(image))
  ) {
    throw new AppError('Images must contain the property\'s existing images', 400);
  }

  const updated = await prisma.property.update({
    where: { id },
    data: { images },
    select: propertySelect,
  });

  res.json(updated);
});

// Max images per property for storage/performance
const MAX_PROPERTY_IMAGES = 12;

// POST upload images to property with max limit validation (owner agent or admin)
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
    throw new AppError('No images provided', 400);
  }

  // Enforce image limit
  const totalAfterUpload = property.images.length + req.files.length;
  if (totalAfterUpload > MAX_PROPERTY_IMAGES) {
    const remaining = MAX_PROPERTY_IMAGES - property.images.length;
    throw new AppError(
      remaining <= 0
        ? `This property already has the maximum of ${MAX_PROPERTY_IMAGES} images`
        : `You can only add ${remaining} more image${remaining === 1 ? '' : 's'} (${MAX_PROPERTY_IMAGES} max per property)`,
      400
    );
  }

  const newImageUrls = req.files.map(file => file.path);

  const updated = await prisma.property.update({
    where: { id },
    data: { images: [...property.images, ...newImageUrls] },
    select: propertySelect,
  });

  res.json(updated);
});

export default router;