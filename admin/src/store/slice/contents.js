import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  categories: [],
  products: []
}

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    addCategories: (state, action) => {
      state.categories = action.payload
    },
    addProducts: (state, action) => {
      state.products = action.payload
    }
  }
})


export const { addCategories, addProducts } = contentSlice.actions
export default contentSlice.reducer