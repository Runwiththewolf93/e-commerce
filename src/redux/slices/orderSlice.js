"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const orderAddress = createAsyncThunk(
  "order/orderAddress",
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
  "order/orderCart",
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

export const paymentCheckout = createAsyncThunk(
  "order/paymentCheckout",
  async ({ cartId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post("/api/order/checkout", {
        cartId,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const paymentConfirmation = createAsyncThunk(
  "order/paymentConfirmation",
  async ({ sessionId, cartId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post(
        "/api/payment/confirmation",
        {
          sessionId,
          cartId,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const orderStatus = createAsyncThunk(
  "order/orderStatus",
  async ({ orderStatus, isDelivered, cartId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch("/api/order/status", {
        orderStatus,
        isDelivered,
        cartId,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async ({ cartId, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get(
        `/api/order/getOrder?cartId=${cartId}`
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (jwt, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get("/api/order/getOrders");

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
    // paymentCheckout
    isLoadingPaymentCheckout: false,
    sessionId: "",
    errorPaymentCheckout: null,
    // paymentConfirmation
    isLoadingPaymentConfirmation: false,
    messagePaymentConfirmation: "",
    errorPaymentConfirmation: null,
    // orderStatus
    isLoadingOrderStatus: false,
    messageOrderStatus: "",
    errorOrderStatus: null,
    // getOrder
    isLoadingGetOrder: false,
    order: {},
    errorGetOrder: null,
    // getOrders
    isLoadingGetOrders: false,
    orders: [],
    errorGetOrders: null,
  },
  reducers: {
    clearOrderMessage: state => {
      state.messageOrderAddress = "";
      state.messageOrderCart = "";
      state.messagePaymentConfirmation = "";
      state.messageOrderStatus = "";
    },
    clearOrderError: state => {
      state.errorOrderAddress = null;
      state.errorOrderCart = null;
      state.errorPaymentCheckout = null;
      state.errorPaymentConfirmation = null;
      state.errorOrderStatus = null;
      state.errorGetOrder = null;
      state.errorGetOrders = null;
    },
    clearSessionId: state => {
      state.sessionId = "";
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
      })
      // paymentCheckout reducer
      .addCase(paymentCheckout.pending, state => {
        state.isLoadingPaymentCheckout = true;
        state.errorPaymentCheckout = null;
      })
      .addCase(paymentCheckout.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.isLoadingPaymentCheckout = false;
        state.errorPaymentCheckout = null;
      })
      .addCase(paymentCheckout.rejected, (state, action) => {
        state.errorPaymentCheckout = action.payload;
        state.isLoadingPaymentCheckout = false;
      })
      // paymentConfirmation reducer
      .addCase(paymentConfirmation.pending, state => {
        state.isLoadingPaymentConfirmation = true;
        state.errorPaymentConfirmation = null;
      })
      .addCase(paymentConfirmation.fulfilled, (state, action) => {
        state.messagePaymentConfirmation = action.payload.message;
        state.isLoadingPaymentConfirmation = false;
        state.errorPaymentConfirmation = null;
      })
      .addCase(paymentConfirmation.rejected, (state, action) => {
        state.errorPaymentConfirmation = action.payload;
        state.isLoadingPaymentConfirmation = false;
      })
      // orderStatus reducer
      .addCase(orderStatus.pending, state => {
        state.isLoadingOrderStatus = true;
        state.errorOrderStatus = null;
      })
      .addCase(orderStatus.fulfilled, (state, action) => {
        state.messageOrderStatus = action.payload.message;
        state.isLoadingOrderStatus = false;
        state.errorOrderStatus = null;
      })
      .addCase(orderStatus.rejected, (state, action) => {
        state.errorOrderStatus = action.payload;
        state.isLoadingOrderStatus = false;
      })
      // getOrder reducer
      .addCase(getOrder.pending, state => {
        state.isLoadingGetOrder = true;
        state.errorGetOrder = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.isLoadingGetOrder = false;
        state.errorGetOrder = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.errorGetOrder = action.payload;
        state.isLoadingGetOrder = false;
      })
      // getOrders reducer
      .addCase(getOrders.pending, state => {
        state.isLoadingGetOrders = true;
        state.errorGetOrders = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isLoadingGetOrders = false;
        state.errorGetOrders = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.errorGetOrders = action.payload;
        state.isLoadingGetOrders = false;
      });
  },
});

export const { clearOrderMessage, clearOrderError, clearSessionId } =
  orderSlice.actions;

export default orderSlice.reducer;
