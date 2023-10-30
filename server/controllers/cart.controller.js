const cartModel = require("../models/cart.model")
const CustomError = require("../utils/error")
const { response } = require("../utils/helper")

const handleAddToCart = async (req, res) => {
  try{
    if(!req.body.productId) throw new CustomError("Product Id is required")

    // CHECK IF PRODUCT ALREADY EXIST
    const prevItem = await cartModel.findOne({ userId: req.user._id, productId: req.body.productId })

    if(!prevItem) {
      const cartItem = await cartModel.create({
        productId: req.body.productId,
        userId: req.user._id
      })

      return res.status(201).send(response("Added product to cart", cartItem))
    }

    // IF PRODUCT EXISTS
    const cartItem = await cartModel.findByIdAndUpdate(prevItem._id, {
      ...prevItem.toObject(),
      quantity: prevItem.quantity + 1
    }, { new: true })

    res.status(201).send(response("Added product to cart", cartItem))
  }

  catch (e) {
    res.status((e.code > 500 ? 500 : e.code) || 500).send(response(e.message, null, false))
  }
}
  

module.exports = {
  handleAddToCart
}