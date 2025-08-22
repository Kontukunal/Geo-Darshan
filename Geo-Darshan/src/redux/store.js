import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import preferenceReducer from "./preferenceSlice";
import destinationReducer from "./destinationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preference: preferenceReducer,
    destination: destinationReducer,
  },
});

export default store;
