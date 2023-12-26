"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post(
        "/api/wishlist/addToWishlist",
        {
          productId,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getWishlistId = createAsyncThunk(
  "wishlist/getWishlistId",
  async ({ productId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get(
        `/api/wishlist/getWishlistId?productId=${productId}`
      );

      return data.inWishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFromWishlist = createAsyncThunk(
  "wishlist/deleteFromWishlist",
  async ({ productId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete(
        `/api/wishlist/deleteFromWishlist?productId=${productId}`
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getWishlistUser = createAsyncThunk(
  "wishlist/getWishlistUser",
  async ({ jwt, page = 1, limit = 8 }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get(
        `/api/wishlist/getWishlistUser?page=${page}&limit=${limit}`
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const deleteItemsFromWishlist = createAsyncThunk(
  "wishlist/deleteItemsFromWishlist",
  async ({ productIds, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete(
        `/api/wishlist/deleteItemsFromWishlist`,
        { data: { productIds } }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    // addToWishlist
    isLoadingWishlist: false,
    messageWishlist: "",
    addedProduct: {},
    errorWishlist: null,
    // getWishlistId
    isLoadingWishlistId: false,
    inWishlist: false,
    errorWishlistId: null,
    // deleteFromWishlist
    isLoadingWishlistDelete: false,
    messageWishlistDelete: "",
    deletedProductId: "",
    errorWishlistDelete: null,
    // getWishlistUser
    isLoadingWishlistUser: false,
    wishlist: {},
    messageWishlistUser: "",
    errorWishlistUser: null,
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    // deleteItemsFromWishlist
    isLoadingDeleteItemsWishlist: false,
    messageDeleteItemsWishlist: "",
    deletedProductIds: [],
    errorDeleteItemsWishlist: null,
  },
  reducers: {
    clearSuccessMessages: state => {
      state.messageWishlist = "";
      state.messageWishlistDelete = "";
      state.messageWishlistUser = "";
      state.messageDeleteItemsWishlist = "";
    },
    clearErrorMessages: state => {
      state.errorWishlist = null;
      state.errorWishlistId = null;
      state.errorWishlistDelete = null;
      state.errorWishlistUser = null;
      state.errorDeleteItemsWishlist = null;
    },
    resetWishlistState: state => {
      state.isLoadingWishlist = false;
      state.wishlist = {};
      state.messageWishlistUser = "";
      state.errorWishlistUser = null;
      state.currentPage = 1;
      state.totalPages = 0;
      state.totalItems = 0;
    },
  },
  extraReducers: builder => {
    builder
      // addToWishlist reducer
      .addCase(addToWishlist.pending, state => {
        state.isLoadingWishlist = true;
        state.errorWishlist = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.messageWishlist = action.payload.message;
        state.addedProduct = action.payload.addedProduct;
        // if (state.wishlist && state.wishlist.products) {
        //   state.wishlist.products.push({
        //     productId: state.addedProduct,
        //     addedAt: new Date().toISOString(),
        //   });
        // }
        state.isLoadingWishlist = false;
        state.errorWishlist = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoadingWishlist = false;
        state.errorWishlist = action.payload;
      })
      // getWishlistId reducer
      .addCase(getWishlistId.pending, state => {
        state.isLoadingWishlistId = true;
        state.errorWishlistId = null;
      })
      .addCase(getWishlistId.fulfilled, (state, action) => {
        state.inWishlist = action.payload;
        state.isLoadingWishlistId = false;
        state.errorWishlistId = null;
      })
      .addCase(getWishlistId.rejected, (state, action) => {
        state.errorWishlistId = action.payload;
        state.isLoadingWishlistId = false;
      })
      // deleteFromWishlist reducer
      .addCase(deleteFromWishlist.pending, state => {
        state.isLoadingWishlistDelete = true;
        state.errorWishlistDelete = null;
      })
      .addCase(deleteFromWishlist.fulfilled, (state, action) => {
        state.messageWishlistDelete = action.payload.message;
        state.deletedProductId = action.payload.deletedProductId;
        state.isLoadingWishlistDelete = false;
        state.errorWishlistDelete = null;

        if (state.wishlist && state.wishlist.products) {
          state.wishlist.products = state.wishlist.products.filter(
            product => product.productId._id !== action.meta.arg.productId
          );
        }
      })
      .addCase(deleteFromWishlist.rejected, (state, action) => {
        state.errorWishlistDelete = action.payload;
        state.isLoadingWishlistDelete = false;
      })
      // getWishlistUser reducer
      .addCase(getWishlistUser.pending, state => {
        state.isLoadingWishlistUser = true;
        state.errorWishlistUser = null;
      })
      .addCase(getWishlistUser.fulfilled, (state, action) => {
        state.wishlist = action.payload.wishlist;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.messageWishlistUser = action.payload.message;
        state.isLoadingWishlistUser = false;
        state.errorWishlistUser = null;
      })
      .addCase(getWishlistUser.rejected, (state, action) => {
        state.errorWishlistUser = action.payload;
        state.isLoadingWishlistUser = false;
      })
      // deleteItemsFromWishlist reducer
      .addCase(deleteItemsFromWishlist.pending, state => {
        state.isLoadingDeleteItemsWishlist = true;
        state.errorDeleteItemsWishlist = null;
      })
      .addCase(deleteItemsFromWishlist.fulfilled, (state, action) => {
        state.messageDeleteItemsWishlist = action.payload.message;
        state.deletedProductIds = action.payload.deletedProductIds;
        state.isLoadingDeleteItemsWishlist = false;
        state.errorDeleteItemsWishlist = null;

        // Filter wishlist products only if there are product IDs to delete
        if (
          state.wishlist &&
          state.wishlist.products &&
          state.deletedProductIds.length > 0
        ) {
          state.wishlist.products = state.wishlist.products.filter(
            product => !state.deletedProductIds.includes(product.productId._id)
          );
        }
      })
      .addCase(deleteItemsFromWishlist.rejected, (state, action) => {
        state.errorDeleteItemsWishlist = action.payload;
        state.isLoadingDeleteItemsWishlist = false;
      });
  },
});

export const { clearSuccessMessages, clearErrorMessages, resetWishlistState } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
