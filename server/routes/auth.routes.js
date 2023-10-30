const { handleSignUpAdmin, handleSignUpUser, handleLogin } = require('../controllers/auth.controller')

const router = require('express').Router()



// REGISTER
router.post("/admin/signup", handleSignUpAdmin)
router.post("/signup", handleSignUpUser)

// LOGIN
router.post("/admin/login", handleLogin)
router.post("/login", handleLogin)

module.exports = router

// TODO: UPDATE THE ROUTE IN THE CLIENT