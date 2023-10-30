const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true
  },
  products: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
      required: true
    }
  ],
  amount: {
    type: Number,
    required: true
  },
}, { timestamps: true })


module.exports = mongoose.model("transaction", transactionSchema)