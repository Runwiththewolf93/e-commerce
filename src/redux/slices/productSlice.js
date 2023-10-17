import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/products/getProducts");
      const bestSellersRandomDiscount = data.products.map(product => ({
        ...product,
        randomDiscount: Math.floor(Math.random() * 50) + 1,
      }));

      const newIds = data.products.map(p => p._id);
      dispatch(addProductIds(newIds));
      dispatch(setCurrentGallery("featured"));

      return bestSellersRandomDiscount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  "products/fetchFeatured",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const existingProductIds = getState().productIds;

      const { data } = await axios.post("/api/products/getProducts", {
        fetchedIds: existingProductIds,
      });

      const productsWithRandomReviews = data.products.map(product => ({
        ...product,
        randomReviews: Array.from(
          { length: Math.floor(Math.random() * 10) + 1 },
          () => Math.floor(Math.random() * 5) + 1
        ),
      }));
      const productsWithAggregateRating = productsWithRandomReviews.map(
        product => {
          const totalRating = product.randomReviews.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const avgRating = (
            totalRating / product.randomReviews.length
          ).toFixed(1);
          return {
            ...product,
            aggregateRating: avgRating,
          };
        }
      );

      const newIds = data.products.map(p => p._id);
      dispatch(addProductIds(newIds));
      dispatch(setCurrentGallery("newArrivals"));

      return productsWithAggregateRating;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState: {
    productIds: [],
    bestSellers: [],
    featured: [],
    isLoading: false,
    error: null,
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
  extraReducers: builder => {
    builder
      // fetchBestSellers reducer
      .addCase(fetchBestSellers.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchFeatured reducer
      .addCase(fetchFeatured.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addProductIds, setCurrentGallery } = productSlice.actions;

export default productSlice.reducer;
