const { response } = require('../utils/helper')
const CustomError = require('../utils/error')
const categoryModel = require('../models/category.model')

const handleCreateCategory = async (req, res) => {
  try {
    // CHECK IF NAME IS IN THE BODY
    if(!req.body.name) throw new CustomError("Name is required")

    // ADD TO DATABASE
    const category = await categoryModel.create({ name: req.body.name }) 
    res.status(201).send(response("Category added!", category))

  } catch (err) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}

const handleGetAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({}, "-__v").sort({ createdAt: "desc" })
    res.status(200).send(response("All categories!", categories))

  } catch (err) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}

//  ASSIGNMENT
const handleUpdateCategory = async (req, res) => {
  try {
    if(!req.params.id) throw new CustomError("ID (param) is required")

    // CHECK IF EXISTS
    const check = await categoryModel.findById(req.params.id)
    if(!check) throw new CustomError("Category not found")

    // UPDATE CATEGORY
  
    const data = {
      ...check.toObject(), 
      ...req.body
    }
    const category = await categoryModel.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send(response("Category updated!", category))
  } catch (e) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}


const handleDeleteCategory = async (req, res) => {
  try {
    if(!req.params.id) throw new CustomError("ID (param) is required")

    // CHECK IF EXISTS
    const category = await categoryModel.findById(req.params.id)
    if(!category) throw new CustomError("Category not found")

    // DELETE CATEGORY
    await category.deleteOne()

    res.status(200).send(response("Category deleted!", category))

  } catch (e) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}


module.exports = {
  handleCreateCategory,
  handleGetAllCategories,
  handleUpdateCategory,
  handleDeleteCategory,
}

// ASSIGNMENTS
// 1. Add the controller function for Update of category [SERVER]
// 2. Add the controller function for Delete of category [SERVER]
// 3. Add page for the category in the admin dashboard [ADMIN]
// 4. Create Routes for the category and link it to the appropriate controller function [SERVER]
// 5. Create routes for the product page [SERVER]
// 6. Remove the other sidebar links below the `Return to` [ADMIN]