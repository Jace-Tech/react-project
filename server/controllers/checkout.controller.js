const https = require('https')
const CustomError = require('../utils/error')
const cartModel = require('../models/cart.model')
const axios = require("axios")
const { response, generateId } = require('../utils/helper')
const orderModel = require('../models/order.model')
const transactionModel = require('../models/transaction.model')

const handleInitiateCheckout = async (req, res) => {
  try {
    if (!req.user) throw new CustomError("Not authorized", 401)

    // Get the items from the users cart
    const usersCart = await cartModel.find({ userId: req.user._id }).populate(["productId"])

    let totalPrice = 0
    for (const item of usersCart) {
      const quantity = item.quantity
      const price = item.productId.salePrice || item.productId.regularPrice
      totalPrice += quantity * price
    }

    const transactionRef = generateId("trx_")
    const params = {
      "reference": transactionRef,
      "email": req.user.email,
      "amount": totalPrice * 100,
      "callback_url": "http://localhost:5000/api/v1/checkout/confirm/"
    }

    const result = await axios.post("https://api.paystack.co/transaction/initialize", params, {
      headers: {
        "Authorization": 'Bearer ' + process.env.PAYSTACK_SECRET,
        'Content-Type': 'application/json'
      }
    })

    // ORDERS
    const order = await orderModel.create({
      amount: totalPrice,
      products: usersCart.map(item => item._id),
      user: req.user._id,
    })

    // TRANSACTION
    await transactionModel.create({
      referenceId: transactionRef,
      order: order._id,
      user: req.user._id,
      amount: totalPrice,
    })

    console.log("DATA:", result.data)
    res.status(201).send(response("Transaction created!", result.data))
  }
  catch (e) {
    res.status((e.code > 500 ? 500 : e.code) || 500).send(response(e.message, null, false))
  }
}


const verifyCheckout = async () => {

  // CHECK PAYMENT STATS IN PAYSTACK

  // CLEAR CART IF PAYMENT IS SUCCESSFUL

  // REDIRECT REACT PAYMENT [SUCCESS|ERROR] PAGE
}


module.exports = {
  handleInitiateCheckout,
  verifyCheckout
}