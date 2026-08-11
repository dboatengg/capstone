import "dotenv/config"
import express from 'express'
import morgan from "morgan"
import agentRoutes from './routes/agents.js'
import clientRoutes from './routes/clients.js'
import inquiryRoutes from './routes/inquiries.js'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import errorHandler from './middleware/errorHandler.js'
import cors from 'cors'

// express app setup
const app = express();

// middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors ({
    origin: [
      'http://localhost:4000',
      'capstone-production-0a81.up.railway.app' 
    ], 
    credentials: true
}))

// Auth routes
app.use('/auth', authRoutes);

// routes
app.use('/api/agents', agentRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/properties', propertyRoutes)

// root route
app.get('/', (req, res) => {
    res.send("Welcome to the Capstone API!")
})

app.use(errorHandler)

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  process.exit(1)
})

export default app;