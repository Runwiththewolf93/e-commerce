import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "products",
  initialState: {
    productIds: [],
    currentGallery: "bestsellers",
  },
  reducers: {
    addProductIds: (state, action) => {
      state.productIds = [...state.productIds, ...action.payload];
    },
    setCurrentGallery: (state, action) => {
      state.currentGallery = action.payload;
    },
  },
});

export const { addProductIds, setCurrentGallery } = productSlice.actions;

export default productSlice.reducer;
