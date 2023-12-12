"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const orderAddress = createAsyncThunk(
  "user/orderAddress",
  async ({ jwt, address, orderId }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch("/api/order/address", {
        address,
        orderId,
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
  },
  reducers: {
    clearOrderMessage: state => {
      state.messageOrderAddress = "";
    },
    clearOrderError: state => {
      state.errorOrderAddress = null;
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
      });
  },
});

export const { clearOrderMessage, clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
