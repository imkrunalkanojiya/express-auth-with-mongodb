const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')

// Importing Routes
const userRoutes = require('./routes/userRoutes')

// Configutation
const mongoConnect = require('./config/mongodb')

// Configure express
const app = express()

// configure env
dotenv.config()

// constant variables
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Database Connection
mongoConnect(DATABASE_URL) 

// configure cors,json (middleware)
app.use(cors())
app.use(express.json())

// User Routes =====================

app.use("/api/user/",userRoutes);

// =================================


// listen server
app.listen(port,()=> console.log(`Server is running on ${port}`))