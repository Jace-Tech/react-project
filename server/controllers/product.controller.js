const productModel = require("../models/product.model")
const CustomError = require("../utils/error")
const { response } = require("../utils/helper")

const handleCreateProduct = async (req, res) => {
  try {
    // CHECK IF NAME IS IN THE BODY
    if(!req.body.name) throw new CustomError("Name is required")
    if(!req.body.regularPrice) throw new CustomError("Regular Price is required")
    if(!req.body.category) throw new CustomError("Category is required")
    if(!req.body.description) throw new CustomError("description is required")
    if(!req.body.images) throw new CustomError("Image is required")

    // ADD TO DATABASE
    const product = (await productModel.create(req.body))
    res.status(201).send(response("Product added!", product))

  } catch (e) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}

const handleGetAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("category")
    res.status(200).send(response("All products", products))
  } catch (e) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}

const handleUpdateProduct = async (req, res) => {
  try {
    if(!req.params.id) throw new CustomError("ID param is required", 400)

    // CHECK IF PRODUCT EXISTS
    const prevProduct = await productModel.findById(req.params.id)
    if(!prevProduct) throw new CustomError("No product found!", 404)

    // prevProduct.
    
    const newData = {
      // Old data
      ...prevProduct.toObject(),
      ...req.body
    }

    const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, newData, { new: true })
    res.status(200).send(response("Product updated!", updatedProduct))

  } catch (e) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}

const handleDeleteProduct = async (req, res) => {
  try {
    if(!req.params.id) throw new CustomError("ID param is required", 400)

    // CHECK IF PRODUCT EXISTS
    const prevProduct = await productModel.findById(req.params.id)
    if(!prevProduct) throw new CustomError("No product found!", 404)

    await productModel.findByIdAndDelete(req.params.id)
    res.status(200).send(response("Product deleted!", prevProduct))

  } catch (e) {
    res.status(e.code || 500).send(response(e.message, null, false))
  }
}

module.exports = {
  handleCreateProduct,
  handleGetAllProducts,
  handleUpdateProduct,
  handleDeleteProduct
}