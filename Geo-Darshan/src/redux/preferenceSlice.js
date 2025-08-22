import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  preferences: null,
};

const preferenceSlice = createSlice({
  name: "preference",
  initialState,
  reducers: {
    setPreferences: (state, action) => {
      state.preferences = action.payload;
    },
  },
});

export const { setPreferences } = preferenceSlice.actions;
export default preferenceSlice.reducer;
