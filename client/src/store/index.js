import { configureStore } from "@reduxjs/toolkit"
import contentReducer from "./slice/contentSice"
import accountReducer from "./slice/accountSlice"

const store = configureStore({
  reducer: {
    contentStore: contentReducer,
    accountStore: accountReducer
  }
})

export default store