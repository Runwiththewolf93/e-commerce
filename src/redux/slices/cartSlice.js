"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post("/api/cart/addToCart", {
        productId,
        quantity,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (jwt, { rejectWithValue }) => {
    console.log("🚀 ~ file: cartSlice.js:25 ~ jwt:", jwt);
    try {
      const { data } = await customAxios(jwt).get("/api/cart/getUserCart");

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async ({ productId, quantity, jwt, removeCartItem }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete(
        "/api/cart/deleteFromCart",
        { data: { productId, quantity, removeCartItem } }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async ({ code, cartId, jwt }, { rejectWithValue }) => {
    try {
      clearCouponError();

      const { data } = await customAxios(jwt).post(
        "/api/cart/coupon/applyCoupon",
        {
          code,
          cartId,
          jwt,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // addToCart
    isLoadingAddCart: false,
    errorAddCart: null,
    // cartOverlay
    isCartOpen: false,
    // getUserCart
    isLoadingGetCart: false,
    cart: {},
    errorGetCart: null,
    // deleteFromCart
    isLoadingDeleteCart: false,
    errorDeleteCart: null,
    // quantity
    quantity: 1,
    // applyCoupon
    isLoadingApplyCoupon: false,
    errorApplyCoupon: null,
  },
  reducers: {
    openCartOverlay: state => {
      state.isCartOpen = true;
    },
    closeCartOverlay: state => {
      state.isCartOpen = false;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    clearErrorMessage: state => {
      state.errorAddCart = null;
      state.errorGetCart = null;
      state.errorDeleteCart = null;
    },
    clearCouponError: state => {
      state.errorApplyCoupon = null;
    },
  },
  extraReducers: builder => {
    builder
      // addToCart reducer
      .addCase(addToCart.pending, state => {
        state.isLoadingAddCart = true;
        state.errorAddCart = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.isLoadingAddCart = false;
        state.errorAddCart = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoadingAddCart = false;
        state.errorAddCart = action.payload;
      })
      // getUserCart reducer
      .addCase(getUserCart.pending, state => {
        state.isLoadingGetCart = true;
        state.errorGetCart = null;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.isLoadingGetCart = false;
        state.errorGetCart = null;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoadingGetCart = false;
        state.errorGetCart = action.payload;
      })
      // deleteFromCart reducer
      .addCase(deleteFromCart.pending, state => {
        state.isLoadingDeleteCart = true;
        state.errorDeleteCart = null;
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.isLoadingDeleteCart = false;
        state.errorDeleteCart = null;
      })
      .addCase(deleteFromCart.rejected, (state, action) => {
        state.isLoadingDeleteCart = false;
        state.errorDeleteCart = action.payload;
      })
      // applyCoupon reducer
      .addCase(applyCoupon.pending, state => {
        state.isLoadingApplyCoupon = true;
        state.errorApplyCoupon = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.isLoadingApplyCoupon = false;
        state.errorApplyCoupon = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoadingApplyCoupon = false;
        state.errorApplyCoupon = action.payload;
      });
  },
});

export const {
  openCartOverlay,
  closeCartOverlay,
  setQuantity,
  clearErrorMessage,
  clearCouponError,
} = cartSlice.actions;

export default cartSlice.reducer;

// http://localhost:3000/categories/electronics/65256be84e6d44d34b376798
