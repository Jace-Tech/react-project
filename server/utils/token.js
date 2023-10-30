const jwt = require('jsonwebtoken')
require("dotenv").config()

const generateToken = (value) => {
  return jwt.sign(value, process.env.APP_SECRET, { expiresIn: "7d" })
}


const verifyToken = (token) => {
  return jwt.verify(token, process.env.APP_SECRET)
}

module.exports = {
  generateToken,
  verifyToken
}

