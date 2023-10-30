import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  products: [],
  categories: [],
}

// franks laboratory

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    populateProducts: (state, action) => {
      state.products = action.payload
    },
    populateCategory: (state, action) => {
      state.categories = action.payload
    }
  }
})

export const { populateProducts, populateCategory } = contentSlice.actions
export default contentSlice.reducer