const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true
  },
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "product",
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
}, { timestamps: true })


module.exports = mongoose.model("cart", cartSchema)