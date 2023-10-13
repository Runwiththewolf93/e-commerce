import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./slices/postsSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    products: productReducer,
  },
});
