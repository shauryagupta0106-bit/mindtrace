import { createSlice } from "@reduxjs/toolkit"

const thoughtSlice = createSlice({

  name: "thoughts",

  initialState: {
    list: []
  },

  reducers: {

    setThoughts: (state, action) => {
      state.list = action.payload
    },

    addThought: (state, action) => {
      state.list.push(action.payload)
    }

  }

})

export const { setThoughts, addThought } = thoughtSlice.actions

export default thoughtSlice.reducer