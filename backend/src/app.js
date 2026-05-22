const express = require('express')
const cookieparser = require('cookie-parser')
const authrouter = require('./routes/auth.router')
const chatrouter = require('./routes/chat.router')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use('/api/auth',authrouter)
app.use('/api/chat',chatrouter)
app.use(express.static(path.join(__dirname,'..','public')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..','public', 'index.html'))
})

module.exports = app