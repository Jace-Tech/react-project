const { USER_ROLE } = require('../config/roles')
const authorized = require('../middlewares/authorized.middleware')
const { handleAddToCart } = require("../controllers/cart.controller")
const router = require('express').Router()

// ROUTES
router.post("/", authorized(USER_ROLE), handleAddToCart)

module.exports = router