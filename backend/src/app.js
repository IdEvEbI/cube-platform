import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
