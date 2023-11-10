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

      return data.message;
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

      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    isLoadingWishlist: false,
    messageWishlist: "",
    errorWishlist: null,
    isLoadingWishlistId: false,
    inWishlist: false,
    errorWishlistId: null,
    isLoadingWishlistDelete: false,
    messageWishlistDelete: "",
    errorWishlistDelete: null,
  },
  reducers: {
    clearSuccessMessages: state => {
      state.messageWishlist = "";
      state.messageWishlistDelete = "";
    },
    clearErrorMessages: state => {
      state.errorWishlist = null;
      state.errorWishlistId = null;
      state.errorWishlistDelete = null;
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
        state.messageWishlist = action.payload;
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
        state.messageWishlistDelete = action.payload;
        state.isLoadingWishlistDelete = false;
        state.errorWishlistDelete = null;
      })
      .addCase(deleteFromWishlist.rejected, (state, action) => {
        state.errorWishlistDelete = action.payload;
        state.isLoadingWishlistDelete = false;
      });
  },
});

export const { clearSuccessMessages, clearErrorMessages } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
