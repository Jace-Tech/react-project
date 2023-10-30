import { PRODUCT_ENDPOINT } from "."

export const getAllProducts = async () => {
  try {
    const request = await fetch(PRODUCT_ENDPOINT)
    const response = await request.json()
    return response
  } 
  catch (error) {
    console.log("ERROR (PRODUCT):", error.message)
    return {
      message: error.message,
      success: false,
      data: null
    }
  }
}