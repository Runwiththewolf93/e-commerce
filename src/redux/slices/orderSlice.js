"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const orderAddress = createAsyncThunk(
  "user/orderAddress",
  async ({ jwt, address, cartId }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch("/api/order/address", {
        address,
        cartId,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const orderCart = createAsyncThunk(
  "user/orderCart",
  async ({ jwt, cartObject }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch("/api/order/cart", {
        cartObject,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    // orderAddress
    isLoadingOrderAddress: false,
    messageOrderAddress: "",
    errorOrderAddress: null,
    // orderCart
    isLoadingOrderCart: false,
    messageOrderCart: "",
    errorOrderCart: null,
  },
  reducers: {
    clearOrderMessage: state => {
      state.messageOrderAddress = "";
      state.messageOrderCart = "";
    },
    clearOrderError: state => {
      state.errorOrderAddress = null;
      state.errorOrderCart = null;
    },
  },
  extraReducers: builder => {
    builder
      // orderAddress reducer
      .addCase(orderAddress.pending, state => {
        state.isLoadingOrderAddress = true;
        state.errorOrderAddress = null;
      })
      .addCase(orderAddress.fulfilled, (state, action) => {
        state.messageOrderAddress = action.payload.message;
        state.isLoadingOrderAddress = false;
        state.errorOrderAddress = null;
      })
      .addCase(orderAddress.rejected, (state, action) => {
        state.errorOrderAddress = action.payload;
        state.isLoadingOrderAddress = false;
      })
      // orderAddress reducer
      .addCase(orderCart.pending, state => {
        state.isLoadingOrderCart = true;
        state.errorOrderCart = null;
      })
      .addCase(orderCart.fulfilled, (state, action) => {
        state.messageOrderCart = action.payload.message;
        state.isLoadingOrderCart = false;
        state.errorOrderCart = null;
      })
      .addCase(orderCart.rejected, (state, action) => {
        state.errorOrderCart = action.payload;
        state.isLoadingOrderCart = false;
      });
  },
});

export const { clearOrderMessage, clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
