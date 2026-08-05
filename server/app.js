import "dotenv/config"
import express from 'express'
import morgan from "morgan"
import agentRoutes from './routes/agents.js'
import clientRoutes from './routes/clients.js'
import inquiryRoutes from './routes/inquiries.js'

// express app setup
const app = express();

// middleware
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use('/api/agents', agentRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/inquiries', inquiryRoutes)

// root route
app.get('/', (req, res) => {
    res.send("Welcome to the Capstone API!")
})

export default app;