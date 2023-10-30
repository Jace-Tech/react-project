import { CATEGORY_ENDPOINT } from "."

export const getAllCategories = async () => {
  try {
    const request = await fetch(CATEGORY_ENDPOINT)
    const response = await request.json()
    return response
  } 
  catch (error) {
    console.log("ERROR (CATEGORY):", error.message)
    return {
      message: error.message,
      success: false,
      data: null
    }
  }
}