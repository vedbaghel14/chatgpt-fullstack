const usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registercontroller(req,res){
    const {fullname:{firstname,secondname},email,password} = req.body
    const userexist = await usermodel.findOne({email})
    if(userexist){
        return res.status(400).json({message:"user already exists"})
    }
    const hashedpass = await bcrypt.hash(password,10)
    const user = await usermodel.create({
        fullname:{
            firstname,secondname
        },
        email,
        password:hashedpass
    })

    res.status(200).json({
        message:"user registered successfully",
        user
    })


}

async function logincontroller(req,res){
 const {email,password} = req.body
 const user = await usermodel.findOne({email})
 if(!user){
    return res.status(400).json({message:"invalid email or password"})
 }
 const ispasswordcorrect = await bcrypt.compare(password,user.password)
 if(!ispasswordcorrect){
    return res.status(400).json({message:"incorrect password"})
 }
 const token = jwt.sign({id:user._id},process.env.jwt_private_key)
 res.cookie('token',token)

 res.status(200).json({
    message:"user successfully logged in to server",
    firstname:user.fullname.firstname,
    secondname:user.fullname.secondname,
    email:user.email,
    id:user._id
 })

}

module.exports = {registercontroller,logincontroller}