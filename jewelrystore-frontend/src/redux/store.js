import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import counterSlice from "./slices/counterSlice";
export const store = configureStore({
  reducer: {
    counter: counterSlice,
  },
});
