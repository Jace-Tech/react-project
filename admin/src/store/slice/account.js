import { createSlice } from "@reduxjs/toolkit"
import { USER_KEY } from "../../utils/Constants"

// GET DATA FROM STORAGE
const prevState = localStorage.getItem(USER_KEY)

const initialState = {
  // IF PREVSTATE EXIS, CONVERT IT TO AN OBJECT
  info: prevState ? JSON.parse(prevState) : null
}

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    addAccount: (state, action) => {
      // STORE THE INFO IN LOCALSTORAGE
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload))
      state.info = action.payload
    },
    logoutAccount: (state, action) => {
      // CLEAR LOCAL STORAGE
      localStorage.removeItem(USER_KEY)

      // CLEAR THE STATE
      state.info = null
    }
  }
})


export const { addAccount, logoutAccount } = accountSlice.actions
export default accountSlice.reducer