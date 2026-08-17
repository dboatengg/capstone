import express from 'express';
import prisma from '../db/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// admin dashboard stats — total counts across the platform
router.get('/dashboard', requireAuth, requireAdmin, async (req, res) => {
  const [properties, agents, clients, inquiries] = await Promise.all([
    prisma.property.count(),
    prisma.agent.count(),
    prisma.client.count(),
    prisma.inquiry.count(),
  ]);

  res.json({ properties, agents, clients, inquiries });
});

export default router;