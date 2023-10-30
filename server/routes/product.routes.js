const { ADMIN_ROLE } = require('../config/roles')
const { handleCreateProduct, handleGetAllProducts, handleUpdateProduct } = require('../controllers/product.controller')
const authorized = require('../middlewares/authorized.middleware')

const router = require('express').Router()

// ROUTES
router.post("/", authorized(ADMIN_ROLE), handleCreateProduct)
router.get("/", handleGetAllProducts)

router.route("/:id")
  .patch(authorized(ADMIN_ROLE), handleUpdateProduct)
  .put(authorized(ADMIN_ROLE), handleUpdateProduct)
  // .delete(authorized(ADMIN_ROLE), handleDeleteProduct)

module.exports = router