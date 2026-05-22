const chatmodel = require('../models/chat.model');
const messagemodel = require('../models/message.model');


async function chatcreate(req,res){
    const {title} = req.body;
    const user = req.user;
    const chat = await chatmodel.create({
        user:user._id,
        title
    });

    res.status(200).json({
        message:"chat created successfully",
        chat
    });
}

async function getUserChats(req,res){
    const user = req.user;
    const chats = await chatmodel.find({ user: user._id }).sort({ updatedAt: -1 });

    res.status(200).json({
        message:"chats fetched successfully",
        chats
    });
}

async function getChatMessages(req,res){
    const user = req.user;
    const { id } = req.params;

    const chat = await chatmodel.findOne({ _id: id, user: user._id });
    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await messagemodel.find({ chat: id }).sort({ createdAt: 1 }).lean();

    res.status(200).json({
        message:"messages fetched successfully",
        messages
    });
}

module.exports = { chatcreate, getUserChats, getChatMessages }