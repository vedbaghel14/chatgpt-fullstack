const mongoose = require('mongoose')


const chatschema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    title:{
        type:String,
        required:true
    }
},{timestamps:true})

const chatmodel = mongoose.model('chats',chatschema)

module.exports = chatmodel

