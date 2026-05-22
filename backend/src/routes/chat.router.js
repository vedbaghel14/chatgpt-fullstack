const express = require('express')
const { chatcreate, getUserChats, getChatMessages } = require('../controllers/chat.controller')
const authmiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/',authmiddleware,chatcreate)
router.get('/',authmiddleware,getUserChats)
router.get('/:id/messages',authmiddleware,getChatMessages)

module.exports = router