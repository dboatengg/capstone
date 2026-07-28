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

/***********************Clients**************************/
const clientSchema = z.object({
    name: z.string().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

const updateClientSchema = agentSchema.partial();

export const validateClient = (data) => {return clientSchema.safeParse(data)}
export const validateUpdateClient = (data) => {return updateClientSchema.safeParse(data)}

export const validateClientMiddleware = (req, res, next) => {
    const result = validateClient(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}

export const validateUpdateClientMiddleware = (req, res, next) => {
    const result = validateUpdateClient(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}