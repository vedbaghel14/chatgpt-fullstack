const express = require('express')
const authcontroller = require('../controllers/auth.controller')
const router = express.Router()

router.post('/register',authcontroller.registercontroller)
router.post('/login',authcontroller.logincontroller)



module.exports = router