import { REGISTER_ENDPOINT, LOGIN_ENDPOINT } from "."

export const registerUser = async (data) => {
  try {
    const request = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const response = await request.json()
    return response
  } 
  catch (error) {
    console.log("ERROR (REGISTER):", error.message)
    return {
      message: error.message,
      success: false,
      data: null
    }
  }
}

export const loginUser = async (data) => {
  try {
    const request = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const response = await request.json()
    return response
  } 
  catch (error) {
    console.log("ERROR (LOGIN):", error.message)
    return {
      message: error.message,
      success: false,
      data: null
    }
  }
}