const express = require('express')
const cookieparser = require('cookie-parser')
const authrouter = require('./routes/auth.router')
const chatrouter = require('./routes/chat.router')

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use('/api/auth',authrouter)
app.use('/api/chat',chatrouter)


module.exports = app