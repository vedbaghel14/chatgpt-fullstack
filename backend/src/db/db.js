const mongoose = require('mongoose')
const dns = require('dns')

dns.setServers(['1.1.1.1','8.8.8.8'])

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to database")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDb