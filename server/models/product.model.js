const mongoose = require('mongoose')
const Category = require("./category.model")


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  regularPrice: {
    type: Number,
    default: 0.00,
    required: true
  },
  salePrice: {
    type: Number,
    default: 0.00,
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  }],
  description: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 1,
  },
  images: [{
    type: String,
    required: true,
  }]
}, { timestamps: true })

module.exports = mongoose.model("product", productSchema)

