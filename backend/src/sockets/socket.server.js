const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const usermodel = require('../models/user.model')
const { generateResponse } = require('../service/ai.service')
const messagemodel = require('../models/message.model')
const { generateVector } = require('../service/ai.service')
const { creatememory, querymemory } = require('../service/vector.service')

function socketserver(httpserver) {
    const io = new Server(httpserver, {
        
    });

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "")
        if (!cookies.token) {
            next(new Error("Authentication err: Token not found"))
        }
        try {
            const decoded = jwt.verify(cookies.token, process.env.jwt_private_key)
            const user = await usermodel.findOne({
                _id: decoded.id
            })
            socket.user = user
            next()
        }
        catch (err) {
            next(new Error("Token is Invalid"))
        }
    })

    io.engine.on('connection_error', (err) => {
      console.error('Socket.IO engine connection error:', err.message || err);
    });

    io.on("connection", async (socket) => {
        console.log("user connected", socket.user)
        console.log("server id is :", socket.id)


        socket.on('chatgpt-ai', async (data) => {
            try {
                const message = await messagemodel.create({
                    user: socket.user._id,
                    chat: data.chat,
                    content: data.content,
                    role: "user"
                })

                const vectors = await generateVector(data.content)

                await creatememory({
                    vector: vectors,
                    messageId: String(message._id),
                    metadata: {
                        user: socket.user._id,
                        chat: data.chat,
                        text: data.content
                    }
                })

                const memory = await querymemory({
                    vector: vectors,
                    limit: 5,
                    metadata: {}
                })

                const chathistory = (await messagemodel.find({ chat: data.chat }).sort({ createdAt: -1 }).limit(20).lean()).reverse()

                const shortTermMemory = chathistory.map((message) => { return { role: message.role, parts: [{ text: message.content }] } })
                const longTermMemory = [
                    {
                        role: "user",
                        parts: [{
                            text: `
                        these are some previous messages from the chat , use them to generate a response
                        ${memory.map(item => item.metadata.text).join("\n")}
                        `
                        }]
                    }
                ]

                const response = await generateResponse([...longTermMemory, ...shortTermMemory])

                const responseMessage = await messagemodel.create({
                    user: socket.user._id,
                    chat: data.chat,
                    content: response,
                    role: "model"
                })

                const responseVectors = await generateVector(response)

                await creatememory({
                    vector: responseVectors,
                    messageId: responseMessage._id,
                    metadata: {
                        user: socket.user._id,
                        chat: data.chat,
                        text: response
                    }
                })

                socket.emit('chatgpt-response', response)
            } catch (err) {
                console.error('chatgpt-ai handler error:', err.message)
                socket.emit('chatgpt-response', `Error: ${err.message}. Please check your API key configuration.`)
            }
        })
    });
}

module.exports = socketserver