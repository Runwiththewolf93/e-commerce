import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(resetProductState());
      if (getState().products.productIds.length > 0) return;

      const { data } = await axios.post("/api/products/getProducts", {
        fetchedIds: [],
      });
      const bestSellersRandomDiscount = data.products.map(product => ({
        ...product,
        randomDiscount: Math.floor(Math.random() * 50) + 1,
      }));

      const newIds = data.products.map(p => p._id);
      console.log("🚀 ~ file: productSlice.js:22 ~ newIds:", newIds);
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
  async (existingProductIds, { dispatch, rejectWithValue }) => {
    try {
      console.log(
        "🚀 ~ file: productSlice.js:38 ~ existingProductIds:",
        existingProductIds
      );

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
      console.log("🚀 ~ file: productSlice.js:70 ~ newIds:", newIds);
      dispatch(addProductIds(newIds));
      dispatch(setCurrentGallery("newArrivals"));

      return productsWithAggregateRating;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSearch = createAsyncThunk(
  "/products/fetchSearch",
  async ({ productName, search }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/products/getProduct", {
        productName,
        search,
      });

      return { products: data.products, message: data.message };
    } catch (error) {
      rejectWithValue(error.response?.data?.message || error.message);
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
    currentGallery: "bestSellers",
    products: [],
    searchMessage: "",
  },
  reducers: {
    addProductIds: (state, action) => {
      const uniqueIds = new Set([...state.productIds, ...action.payload]);
      const uniqueIdsArray = Array.from(uniqueIds);
      const limitedIds = uniqueIdsArray.slice(-30);
      state.productIds = limitedIds;
    },
    resetProductState: state => {
      state.productIds = [];
      state.bestSellers = [];
      state.featured = [];
      state.isLoading = false;
      state.error = null;
      state.currentGallery = "bestSellers";
    },
    setCurrentGallery: (state, action) => {
      state.currentGallery = action.payload;
    },
    clearProducts: state => {
      state.products = [];
      state.searchMessage = "";
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
      })
      // fetchSearch reducer
      .addCase(fetchSearch.pending, state => {
        state.isLoading = false;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.searchMessage = action.payload.message;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addProductIds,
  resetProductState,
  setCurrentGallery,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;
