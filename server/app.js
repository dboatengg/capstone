import "dotenv/config"
import express from 'express'
import morgan from "morgan"
import agentRoutes from './routes/agents.js'
import clientRoutes from './routes/clients.js'
import inquiryRoutes from './routes/inquiries.js'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import errorHandler from './middleware/errorHandler.js'
import adminRoutes from './routes/admin.js'
import cors from 'cors'

// Initialize Express app
const app = express();

// MIDDLEWARE
// Parse JSON request bodies
app.use(express.json())
// Log HTTP requests
app.use(morgan('dev'))
// Enable CORS for frontend origins
app.use(cors ({
    origin: [
      'http://localhost:4000',
      'https://capstonne.vercel.app' 
    ], 
    credentials: true
}))

// ROUTES
// Authentication endpoints
app.use('/auth', authRoutes);
// Resource APIs
app.use('/api/agents', agentRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/admin', adminRoutes)

// Health check endpoint
app.get('/', (req, res) => {
    res.send("Welcome to the Capstone API!")
})

// Centralized error handling
app.use(errorHandler)

export default app;