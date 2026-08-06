import express from 'express'
import prisma from '../db/prisma.js'
import { validateClientMiddleware, validateUpdateClientMiddleware } from '../utils/validate.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

const clientSelect = {id:true, name:true, email:true, phone:true,}

// get all clients
router.get("/", requireAuth, requireAdmin, async(req, res) => {
    const clients = await prisma.client.findMany({select: clientSelect})
    res.json(clients);
})

// get single client
router.get('/:id',requireAuth, async (req, res) => {
    const { id } = req.params
    const client = await prisma.client.findUnique({ where: { id }, select: clientSelect })
    if (!client) throw new AppError('Client not found', 404)
    res.json(client)
})
  
// create client
router.post('/',requireAuth, requireAdmin, validateClientMiddleware, async (req, res) => {
   
    const newClient = await prisma.client.create({ data: req.body, select: clientSelect });
    res.status(201).json(newClient);
  })
  
// update client
router.put('/:id', requireAuth, validateUpdateClientMiddleware, async (req, res) => {
    const { id } = req.params
    const client = await prisma.client.findUnique({ where: { id } })
    if (!client) throw new AppError('Client not found', 404)
    const updatedClient = await prisma.client.update({
        where: { id },
        data: req.body,
        select: clientSelect
    })
    res.json(updatedClient)
})
  
// delete client
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const client = await prisma.client.findUnique({ where: { id } })
    if (!client) throw new AppError('Client not found', 404)
    await prisma.client.delete({ where: { id } })
    res.status(204).send();
})
  
export default router