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

export const getWishlistUser = createAsyncThunk(
  "wishlist/getWishlistUser",
  async (jwt, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get(
        "/api/wishlist/getWishlistUser"
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    // addToWishlist
    isLoadingWishlist: false,
    messageWishlist: "",
    errorWishlist: null,
    // getWishlistId
    isLoadingWishlistId: false,
    inWishlist: false,
    errorWishlistId: null,
    // deleteFromWishlist
    isLoadingWishlistDelete: false,
    messageWishlistDelete: "",
    errorWishlistDelete: null,
    // getWishlistUser
    isLoadingWishlistUser: false,
    wishlist: {},
    messageWishlistUser: "",
    errorWishlistUser: null,
  },
  reducers: {
    clearSuccessMessages: state => {
      state.messageWishlist = "";
      state.messageWishlistDelete = "";
      state.messageWishlistUser = "";
    },
    clearErrorMessages: state => {
      state.errorWishlist = null;
      state.errorWishlistId = null;
      state.errorWishlistDelete = null;
      state.errorWishlistUser = null;
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
        // this approach needs to be refined, backend changes need to happen. This payload isn't good, need to mimic getWishlistUser
        state.wishlist.products.push({
          productId: action.payload.productId,
          addedAt: new Date().toISOString(),
        });
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
        state.wishlist.products = state.wishlist.products.filter(
          productItem => productItem.productId._id !== action.meta.arg.productId
        );
        state.isLoadingWishlistDelete = false;
        state.errorWishlistDelete = null;
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
        state.messageWishlistUser = action.payload.message;
        state.isLoadingWishlistUser = false;
        state.errorWishlistUser = null;
      })
      .addCase(getWishlistUser.rejected, (state, action) => {
        state.errorWishlistUser = action.payload;
        state.isLoadingWishlistUser = false;
      });
  },
});

export const { clearSuccessMessages, clearErrorMessages } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
