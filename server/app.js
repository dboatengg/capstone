import "dotenv/config"
import express from 'express'
import morgan from "morgan"

const app = express();

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send("Welcome to the Capstone API!")
})

export default app;