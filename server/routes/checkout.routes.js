const router = require('express').Router()
const authorized = require('../middlewares/authorized.middleware')
const { handleInitiateCheckout, verifyCheckout } = require("../controllers/checkout.controller")
const roles = require("../config/roles")

// ROUTES
router.post("/initiate", authorized(roles.USER_ROLE),  handleInitiateCheckout)

router.get("/confirm", verifyCheckout)

module.exports = router