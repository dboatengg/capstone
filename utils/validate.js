import {z} from 'zod'

/***********************Agents**************************/
const agentSchema = z.object({
    name: z.string().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

const updateAgentSchema = agentSchema.partial();

export const validateAgent = (data) => {return agentSchema.safeParse(data)}
export const validateUpdateAgent = (data) => {return updateAgentSchema.safeParse(data)}

export const validateAgentMiddleware = (req, res, next) => {
    const result = validateAgent(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}

export const validateUpdateAgentMiddleware = (req, res, next) => {
    const result = validateUpdateAgent(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}