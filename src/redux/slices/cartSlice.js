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
  async ({ productId, quantity, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete(
        "/api/cart/deleteFromCart",
        { data: { productId, quantity } }
      );
      console.log("Write something and all goes to shit yet again.");

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// either return the full cart, or part of it (the product)
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
  },
  reducers: {
    openCartOverlay: state => {
      state.isCartOpen = true;
    },
    closeCartOverlay: state => {
      state.isCartOpen = false;
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
      });
  },
});

export const { openCartOverlay, closeCartOverlay } = cartSlice.actions;

export default cartSlice.reducer;

// http://localhost:3000/categories/electronics/65256be84e6d44d34b376798
