import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./authslice"
import thoughtReducer from "./thoughtslice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thoughts: thoughtReducer
  }
})