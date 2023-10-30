const userModel = require("../models/user.model")
const CustomError = require("../utils/error")
const { response } = require("../utils/helper")
const { verifyToken } = require("../utils/token")


const authorized = (roles = []) => {
  const wrapper = async(req, res, next) => {
    try {
      if(!req.headers.authorization) throw new CustomError("Unauthorized: No authentication header found", 401)
      const token = req.headers.authorization.split(" ")[1] // `Bearer hdhdhddhhdhhdhdhd`

      const data = verifyToken(token)
      if(!data) throw new CustomError("Invalid Token", 401)

      const user = await userModel.findById(data.id)
      if(!user) throw new CustomError("User does not exist", 404)

      if(!roles.includes(user.role)) throw new CustomError("Unauthorized", 401)
      req.user = user
      next()
    }
    catch(e) {
      res.status((e?.code > 500 ? 500 : e.code) || 500).send(response(e.message, null, false))
    }
  }
  return wrapper
}

module.exports = authorized