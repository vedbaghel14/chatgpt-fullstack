const mongoose = require('mongoose')

const message_schema = new mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chat',
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    content:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','model'],
        default:'user'
    }

},{timestamps:true})

const message_model = mongoose.model('messages',message_schema)

module.exports = message_model