const jwt = require('jsonwebtoken')
const usermodel = require('../models/user.model')


async function authmiddleware(req,res,next){
    const {token} = req.cookies
    if(!token){
        return res.status(401).json({message:"unauthorised access declined"})
    }
    try{
        const decoded = jwt.verify(token,process.env.jwt_private_key)
        const user = await usermodel.findOne({
            _id:decoded.id
        })
        req.user = user
        next()
    }
    catch(err){
        console.log(err)
    }
    
    
}

module.exports = authmiddleware