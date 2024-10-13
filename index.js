const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const connectToDB = require('./database/connectToDB')
require('dotenv').config()
const {PORT} = process.env
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: '*',
}))
connectToDB()
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})