const router = require('express').Router()
const cloudinary = require("cloudinary").v2
require("dotenv").config()

const CustomError = require('../utils/error')
const { response } = require('../utils/helper')
const authRoute = require('./auth.routes')
router.use("/auth", authRoute)

const categoryRoute = require('./category.routes')
router.use("/category", categoryRoute)

const productRoute = require('./product.routes')
router.use("/product", productRoute)


          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API, 
  api_secret: process.env.CLOUD_SECRET
});

router.post("/upload", async (req, res) => {
  try {
    if(!req.body.image) throw new CustomError("Image is required")
    if(!req.body.name) throw new CustomError("name is required")

    // base64
    const result = await cloudinary.uploader.upload(req.body.image, { public_id: req.body.name });
    res.send(response("Uploaded", result))

  } catch (error) {
    console.log("ERROR:", error.message)
    res.send(response("Failed to upload", null, false))
  }
})

module.exports = router