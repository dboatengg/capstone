import express from 'express'
import prisma from '../db/prisma.js'
import { validateAgentMiddleware, validateUpdateAgentMiddleware } from '../utils/validate.js'

const router = express.Router();

const agentSelect = {id:true, name:true, email:true, phone:true, whatsapp:true, role:true, properties: true}

// get all agents
router.get("/", async(req, res) => {
    const agents = await prisma.agent.findMany({select: agentSelect})
    res.json(agents);
})

// get single agent
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const agent = await prisma.agent.findUnique({ where: { id }, select: agentSelect })
    if (!agent) throw new AppError('Agent not found', 404)
    res.json(agent)
})
  
// create agent
router.post('/', validateAgentMiddleware, async (req, res) => {
    const { name, email, password, phone, whatsapp, role, properties } = req.body
   
    const newAgent = await prisma.agent.create({ data: { name, email, password, phone, whatsapp, role, properties }, select: agentSelect });
    res.status(201).json(newAgent);
  })
  
// update agent
router.put('/:id', validateUpdateAgentMiddleware, async (req, res) => {
    const { id } = req.params
    const agent = await prisma.agent.findUnique({ where: { id } })
    if (!agent) throw new AppError('Agent not found', 404)
    const updatedAgent = await prisma.agent.update({
        where: { id },
        data: req.body,
        select: agentSelect
    })
    res.json(updatedAgent)
})
  
// delete agent
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const agent = await prisma.agent.findUnique({ where: { id } })
    if (!agent) throw new AppError('Agent not found', 404)
    await prisma.agent.delete({ where: { id } })
    res.status(204).send()
})
  
export default router