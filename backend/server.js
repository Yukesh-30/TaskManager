// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Core imports
import express, { json } from 'express'
import cors from 'cors'
import path from 'path'

// Custom imports
import connectDB from './config/db.js'
import authRoute from './routes/authRoute.js' 

import userRoute from './routes/userRoute.js'
import taskRoute from './routes/taskRoute.js'
import reportroute from './routes/reportRoute.js'

// Create express app
const app = express()

app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB()

// Middleware for CORS
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// Middleware for parsing JSON
app.use(json())

// API Routes
app.use('/api/auth', authRoute)
// User Route
app.use('/api/user',userRoute)
//Task Route
app.use('/api/task',taskRoute)
//report route
app.use('/api/report',reportroute)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
