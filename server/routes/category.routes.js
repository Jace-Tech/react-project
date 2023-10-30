const { handleCreateCategory, handleDeleteCategory, handleUpdateCategory, handleGetAllCategories } = require('../controllers/category.controller')

const router = require('express').Router()

// ROUTES
// CREATE CATEGORY
router.post("/", handleCreateCategory)

// GET ALL CATEGORY
router.get("/", handleGetAllCategories)

// UPDATE CATEGORY
router.put("/:id", handleUpdateCategory)

// UPDATE CATEGORY
router.patch("/:id", handleUpdateCategory)

// DELETE CATEGORY
router.delete("/:id", handleDeleteCategory)

// router.route("/:id")
  //  DELETE CATEGORY
//   .delete(handleDeleteCategory)
//   .put(handleUpdateCategory)
//   .patch(handleUpdateCategory)


module.exports = router