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

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ product, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch(
        "/api/products/editProduct",
        product
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async ({ productName, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post(`/api/products/getProduct`, {
        productName,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ productName, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete(
        "/api/products/deleteProduct",
        {
          data: {
            productName,
          },
        }
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
    // editProduct
    isLoadingEditProduct: false,
    messageEditProduct: "",
    errorEditProduct: null,
    // getProduct
    isLoadingGetProduct: false,
    productGet: {},
    errorGetProduct: null,
    // deleteProduct
    isLoadingDeleteProduct: false,
    messageDeleteProduct: "",
    errorDeleteProduct: null,
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
      state.messageEditProduct = "";
      state.messageDeleteProduct = "";
    },
    clearProductError: state => {
      state.errorAddProduct = null;
      state.errorEditProduct = null;
      state.errorGetProduct = null;
      state.errorDeleteProduct = null;
    },
    clearProductGet: state => {
      state.productGet = {};
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
      })
      // editProduct reducer
      .addCase(editProduct.pending, state => {
        state.isLoadingEditProduct = true;
        state.errorEditProduct = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.messageEditProduct = action.payload.message;
        state.isLoadingEditProduct = false;
        state.errorEditProduct = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoadingEditProduct = false;
        state.errorEditProduct = action.payload;
      })
      // getProduct reducer
      .addCase(getProduct.pending, state => {
        state.isLoadingGetProduct = true;
        state.errorGetProduct = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.productGet = action.payload.product;
        state.isLoadingGetProduct = false;
        state.errorGetProduct = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoadingGetProduct = false;
        state.errorGetProduct = action.payload;
      })
      // deleteProduct reducer
      .addCase(deleteProduct.pending, state => {
        state.isLoadingDeleteProduct = true;
        state.errorDeleteProduct = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.messageDeleteProduct = action.payload.message;
        state.isLoadingDeleteProduct = false;
        state.errorDeleteProduct = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoadingDeleteProduct = false;
        state.errorDeleteProduct = action.payload;
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
  clearProductGet,
} = productSlice.actions;

export default productSlice.reducer;
