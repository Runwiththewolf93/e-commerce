"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";
import {
  ErrorOrderState,
  OrderAddressArgs,
  OrderAddressResponse,
  OrderCartArgs,
  OrderCartResponse,
  PaymentCheckoutArgs,
  PaymentCheckoutResponse,
  PaymentConfirmationArgs,
  PaymentConfirmationResponse,
  OrderStatusArgs,
  OrderStatusResponse,
  GetOrderArgs,
  GetOrderResponse,
  GetOrdersArgs,
  GetOrdersResponse,
  OrderType,
  OrderStatusType,
} from "../types/orderSliceTypes";

export const orderAddress = createAsyncThunk(
  "order/orderAddress",
  async ({ jwt, address, cartId }: OrderAddressArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch<OrderAddressResponse>(
        "/api/order/address",
        {
          address,
          cartId,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const orderCart = createAsyncThunk(
  "order/orderCart",
  async ({ jwt, cartObject }: OrderCartArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch<OrderCartResponse>(
        "/api/order/cart",
        {
          cartObject,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const paymentCheckout = createAsyncThunk(
  "order/paymentCheckout",
  async ({ cartId, jwt }: PaymentCheckoutArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post<PaymentCheckoutResponse>(
        "/api/order/checkout",
        {
          cartId,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const paymentConfirmation = createAsyncThunk(
  "order/paymentConfirmation",
  async (
    { sessionId, cartId, jwt }: PaymentConfirmationArgs,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await customAxios(jwt).post<PaymentConfirmationResponse>(
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
  async (
    { orderStatus, isDelivered, cartId, jwt }: OrderStatusArgs,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await customAxios(jwt).patch<OrderStatusResponse>(
        "/api/order/status",
        {
          orderStatus,
          isDelivered,
          cartId,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async ({ cartId, jwt }: GetOrderArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get<GetOrderResponse>(
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
  async (jwt: GetOrdersArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get<GetOrdersResponse>(
        "/api/order/getOrders"
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const defaultOrder: OrderType = {
  _id: "",
  userId: "",
  cartId: "",
  totalAmount: 0,
  totalAmountDiscount: 0,
  shippingCost: 0,
  orderStatus: OrderStatusType.Pending,
  shippingAddress: {
    name: "",
    surname: "",
    street: "",
    streetNumber: 0,
    city: "",
    municipality: "",
    zip: "",
    phoneNumber: "",
  },
  isDelivered: false,
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  __v: 0,
  appliedCoupon: null,
  deliveryTime: 0,
  userOrderCount: 0,
};

type OrdersArrayType = OrderType[];

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    // orderAddress
    isLoadingOrderAddress: false,
    messageOrderAddress: "",
    errorOrderAddress: null as ErrorOrderState,
    // orderCart
    isLoadingOrderCart: false,
    messageOrderCart: "",
    errorOrderCart: null as ErrorOrderState,
    // paymentCheckout
    isLoadingPaymentCheckout: false,
    sessionId: "",
    errorPaymentCheckout: null as ErrorOrderState,
    // paymentConfirmation
    isLoadingPaymentConfirmation: false,
    messagePaymentConfirmation: "",
    errorPaymentConfirmation: null as ErrorOrderState,
    // orderStatus
    isLoadingOrderStatus: false,
    messageOrderStatus: "",
    errorOrderStatus: null as ErrorOrderState,
    // getOrder
    isLoadingGetOrder: false,
    order: defaultOrder,
    errorGetOrder: null as ErrorOrderState,
    // getOrders
    isLoadingGetOrders: false,
    orders: [] as OrdersArrayType,
    errorGetOrders: null as ErrorOrderState,
    // isAddressSubmitted
    isAddressSubmitted: false,
    // isPaymentProcessed
    isPaymentProcessed: false,
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
    setIsAddressSubmitted: state => {
      state.isAddressSubmitted = true;
    },
    setIsPaymentProcessed: (state, action: PayloadAction<boolean>) => {
      state.isPaymentProcessed = action.payload;
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
        state.errorOrderAddress = action.payload as string;
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
        state.errorOrderCart = action.payload as string;
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
        state.errorPaymentCheckout = action.payload as string;
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
        state.errorPaymentConfirmation = action.payload as string;
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
        state.errorOrderStatus = action.payload as string;
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
        state.errorGetOrder = action.payload as string;
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
        state.errorGetOrders = action.payload as string;
        state.isLoadingGetOrders = false;
      });
  },
});

export const {
  clearOrderMessage,
  clearOrderError,
  clearSessionId,
  setIsAddressSubmitted,
  setIsPaymentProcessed,
} = orderSlice.actions;

export default orderSlice.reducer;
