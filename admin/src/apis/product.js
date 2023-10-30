import { PRODUCT_ENDPOINT, TOKEN, UPLOAD_ENDPOINT } from "."

export const getAllProducts = async (data) => {
  try {
    const request = await fetch(PRODUCT_ENDPOINT)
    const response = await request.json()
    return response
  }
  catch(e) {
    return {
      message: e.message,
      success: false,
    }
  }
}


export const uploadFile = async (data) => {
  try {
    const options = {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }

    const request = await fetch(UPLOAD_ENDPOINT, options)
    const response = await request.json()
    return response
  }
  catch(e) {
    return {
      message: e.message,
      success: false,
    }
  }
}

export const handleAddProduct = async (data) => {
  try {
    const options = {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      }
    }

    const request = await fetch(PRODUCT_ENDPOINT, options)
    const response = await request.json()
    return response
  }
  catch(e) {
    return {
      message: e.message,
      success: false,
    }
  }
}

export const handleUpdateProduct = async (id, data) => {
  try {
    const options = {
      body: JSON.stringify(data),
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    }

    const request = await fetch(PRODUCT_ENDPOINT + `/${id}`, options)
    const response = await request.json()
    return response
  }
  catch(e) {
    return {
      message: e.message,
      success: false,
    }
  }
}
