import "dotenv/config"
import express from 'express'
import morgan from "morgan"
import agentRoutes from './routes/agents.js'
import clientRoutes from './routes/clients.js'

const app = express();

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/agents', agentRoutes)
app.use('/api/clients', clientRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to the Capstone API!")
})

export default app;