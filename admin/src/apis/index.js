import { USER_KEY } from "../utils/Constants"

export const BASE_URL = "http://localhost:5000/api/v1"

// ENDPOINTS
export const REGISTER_ENDPOINT = BASE_URL + "/auth/admin/signup"
export const LOGIN_ENDPOINT = BASE_URL + "/auth/admin/login"
export const CATEGORY_ENDPOINT = BASE_URL + "/category"
export const PRODUCT_ENDPOINT = BASE_URL + "/product"
export const UPLOAD_ENDPOINT = BASE_URL + "/upload"

let userObject = localStorage.getItem(USER_KEY) ? 
  JSON.parse(localStorage.getItem(USER_KEY)) : null

export const TOKEN = userObject?.token