import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: localStorage.getItem("LOGGED_USER") ? JSON.parse(localStorage.getItem("LOGGED_USER")) : null,
  token: localStorage.getItem("LOGGED_USER_TOKEN")
}

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    populateUser: (state, action) => {
      // Save to localstorage
      localStorage.setItem("LOGGED_USER", JSON.stringify(action.payload))
      state.user = action.payload
    },

    populateToken: (state, action) => {
      // Save to localstorage
      localStorage.setItem("LOGGED_USER_TOKEN",action.payload)
      state.token = action.payload
    }, 
  }
})

export const { populateToken, populateUser } = accountSlice.actions
export default accountSlice.reducer