const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const connectToDB = require('./database/connectToDB')
const userRouter = require('./routes/userRouter')
const commentRouter = require('./routes/commentRouter')
const feedbackRouter = require('./routes/feedbackRouter')
require('dotenv').config()
const {PORT} = process.env
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: 'http://localhost:5173',
}))
connectToDB()
app.use("/user",userRouter);
app.use("/comment",commentRouter);
app.use("/feedback",feedbackRouter);
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})