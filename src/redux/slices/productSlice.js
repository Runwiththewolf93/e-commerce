"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(resetProductState());
      if (getState().products.productIds.length > 0) return;

      const { data } = await customAxios().post("/api/products/getProducts", {
        fetchedIds: [],
      });

      const newIds = data.products.map(p => p._id);
      dispatch(addProductIds(newIds));
      dispatch(setCurrentGallery("featured"));

      return data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  "products/fetchFeatured",
  async (existingProductIds, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await customAxios().post("/api/products/getProducts", {
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

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (existingProductIds, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await customAxios().post("/api/products/getProducts", {
        fetchedIds: existingProductIds,
      });

      const newIds = data.products.map(p => p._id);
      dispatch(addProductIds(newIds));

      return data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSearch = createAsyncThunk(
  "products/fetchSearch",
  async ({ productName, search }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios().post("/api/products/getProduct", {
        productName,
        search,
      });

      return { products: data.products, message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategory = createAsyncThunk(
  "products/fetchCategory",
  async (link, { rejectWithValue }) => {
    try {
      const { data } = await customAxios().post("/api/products/getCategory", {
        link,
      });

      return data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await customAxios().get(
        `/api/products/getProduct/${id}`
      );

      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log("does it trigger");
      const { data } = await customAxios().get("/api/products/getAllProducts");

      console.log("🚀 ~ file: productSlice.js:142 ~ data:", data);
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async ({ product, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post(
        "/api/products/addProduct",
        product
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState: {
    // fetchBestSellers, featured, newArrivals
    isLoading: false,
    productIds: [],
    bestSellers: [],
    featured: [],
    newArrivals: [],
    error: null,
    currentGallery: "bestSellers",
    // fetchSearch
    isLoadingSearch: false,
    searchMessage: "",
    products: [],
    errorSearch: null,
    // fetchCategory
    isLoadingCategory: false,
    productsCategory: [],
    errorCategory: null,
    // fetchProduct
    isLoadingProduct: true,
    product: {},
    errorProduct: null,
    // fetchAllProducts
    isLoadingAllProducts: false,
    productsAll: [],
    errorAllProducts: null,
    // addProduct
    isLoadingAddProduct: false,
    messageAddProduct: "",
    errorAddProduct: null,
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
      state.newArrivals = [];
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
      state.isLoadingSearch = false;
      state.errorSearch = null;
    },
    clearProductMessage: state => {
      state.messageAddProduct = "";
    },
    clearProductError: state => {
      state.errorAddProduct = null;
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
      // fetchNewArrivals reducer
      .addCase(fetchNewArrivals.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchSearch reducer
      .addCase(fetchSearch.pending, state => {
        state.isLoadingSearch = true;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.searchMessage = action.payload.message;
        state.isLoadingSearch = false;
        state.errorSearch = null;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.isLoadingSearch = false;
        state.errorSearch = action.payload;
      })
      // fetchCategory reducer
      .addCase(fetchCategory.pending, state => {
        state.isLoadingCategory = true;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.productsCategory = action.payload;
        state.isLoadingCategory = false;
        state.errorCategory = null;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.isLoadingCategory = false;
        state.errorCategory = action.payload;
      })
      // fetchProduct reducer
      .addCase(fetchProduct.pending, state => {
        state.isLoadingProduct = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.isLoadingProduct = false;
        state.errorProduct = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoadingProduct = false;
        state.errorProduct = action.payload;
      })
      // fetchAllProducts reducer
      .addCase(fetchAllProducts.pending, state => {
        state.isLoadingAllProducts = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsAll = action.payload;
        state.isLoadingAllProducts = false;
        state.errorAllProducts = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoadingAllProducts = false;
        state.errorAllProducts = action.payload;
      })
      // addProduct reducer
      .addCase(addProduct.pending, state => {
        state.isLoadingAddProduct = true;
        state.errorAddProduct = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.messageAddProduct = action.payload.message;
        state.isLoadingAddProduct = false;
        state.errorAddProduct = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoadingAddProduct = false;
        state.errorAddProduct = action.payload;
      });
  },
});

export const {
  addProductIds,
  resetProductState,
  setCurrentGallery,
  clearProducts,
  clearProductMessage,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;
