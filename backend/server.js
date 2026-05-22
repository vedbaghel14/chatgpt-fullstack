require('dotenv').config()
const app = require('./src/app')
const connectDb = require('./src/db/db')
const socketserver = require('./src/sockets/socket.server')
const httpserver = require('http').createServer(app)


connectDb()
socketserver(httpserver)




httpserver.listen(3000,()=>{
    console.log("server is running on port 3000")
})