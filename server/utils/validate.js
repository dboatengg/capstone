import {z} from 'zod'

/***********************Agents**************************/
const agentSchema = z.object({
    name: z.string().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().nullable().optional(),
    whatsapp: z.string().nullable().optional(),
    role: z.enum(['agent', 'admin']).optional(),
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
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().nullable().optional(),
})

const updateClientSchema = clientSchema.partial();

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

/***********************Inquiries***********************/
const inquirySchema = z.object({
    propertyId: z.string().uuid('Invalid property ID'),
    message: z.string().min(1, 'Message is required'),
})

const updateInquirySchema = z.object({
    status: z.enum(['pending', 'contacted', 'converted', 'lost']),
    message: z.string().min(1).optional()
  })

export const validateInquiry = (data) => {return inquirySchema.safeParse(data)}
export const validateUpdateInquiry = (data) => {return updateInquirySchema.safeParse(data)}

export const validateInquiryMiddleware = (req, res, next) => {
    const result = validateInquiry(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}

export const validateUpdateInquiryMiddleware = (req, res, next) => {
    const result = validateUpdateInquiry(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}


/***********************Properties***********************/
const propertySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    shortDescription: z.string().min(1, 'Short description is required'),
    longDescription: z.string().min(1, 'Long description is required'),
    price: z.number().positive('Price must be a positive number'),
    type: z.enum(['sale', 'rent'], { message: 'Type must be sale or rent' }),
    bedrooms: z.number().int().min(1, 'At least 1 bedroom required'),
    bathrooms: z.number().int().min(1, 'At least 1 bathroom required'),
    location: z.string().min(1, 'Location is required'),
  })
  
  const updatePropertySchema = propertySchema.partial().extend({
    available: z.boolean().optional(),
    agentId: z.string().uuid('Invalid agent ID').optional()
  })

export const validateProperty = (data) => {return propertySchema.safeParse(data)}
export const validateUpdateProperty = (data) => {return updatePropertySchema.safeParse(data)}

export const validatePropertyMiddleware = (req, res, next) => {
    const result = validateProperty(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}

export const validateUpdatePropertyMiddleware = (req, res, next) => {
    const result = validateUpdateProperty(req.body);
    if(!result.success) return res.status(400).json({errors: result.error.issues})
    req.body = result.data;
    next();
}