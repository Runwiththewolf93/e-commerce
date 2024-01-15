"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";
import {
  AddToCartArgs,
  AddToCartResponse,
  GetUserCartArgs,
  GetUserCartResponse,
  DeleteFromCartArgs,
  DeleteFromCartResponse,
  ApplyCouponArgs,
  ApplyCouponResponse,
  ExcludeCouponArgs,
  ExcludeCouponResponse,
  AddCouponArgs,
  AddCouponResponse,
  DeleteCouponArgs,
  DeleteCouponResponse,
  RemoveCartArgs,
  RemoveCartResponse,
  CartType,
  CouponType,
  ErrorCartState,
} from "../types/cartSliceTypes";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, jwt }: AddToCartArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post<AddToCartResponse>(
        "/api/cart/addToCart",
        {
          productId,
          quantity,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async ({ jwt }: GetUserCartArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get<GetUserCartResponse>(
        "/api/cart/getUserCart"
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async (
    { productId, quantity, jwt, removeCartItem }: DeleteFromCartArgs,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await customAxios(jwt).delete<DeleteFromCartResponse>(
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
  async ({ code, cartId, jwt }: ApplyCouponArgs, { rejectWithValue }) => {
    try {
      clearCouponError();

      const { data } = await customAxios(jwt).post<ApplyCouponResponse>(
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

export const excludeCoupon = createAsyncThunk(
  "cart/excludeCoupon",
  async ({ cartId, jwt }: ExcludeCouponArgs, { rejectWithValue }) => {
    try {
      clearCouponError();

      const { data } = await customAxios(jwt).delete<ExcludeCouponResponse>(
        "/api/cart/coupon/excludeCoupon",
        { data: { cartId, jwt } }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCoupon = createAsyncThunk(
  "cart/addCoupon",
  async (
    { code, discountPercentage, expirationDate, jwt }: AddCouponArgs,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await customAxios(jwt).post<AddCouponResponse>(
        "api/cart/coupon/addCoupon",
        { code, discountPercentage, expirationDate }
      );

      if (data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "cart/deleteCoupon",
  async ({ code, jwt }: DeleteCouponArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete<DeleteCouponResponse>(
        "api/cart/coupon/deleteCoupon",
        { data: { code } }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async ({ cartId, jwt }: RemoveCartArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).delete<RemoveCartResponse>(
        "/api/cart/removeCart",
        {
          data: { cartId },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const defaultCart: CartType = {
  _id: "",
  user: "",
  items: [],
  totalAmountDiscount: 0,
  totalAmount: 0,
  shippingCost: 0,
  totalWeight: 0,
  createdAt: "",
  updatedAt: "",
  __v: 0,
};

const defaultCoupon: CouponType = {
  _id: "",
  code: "",
  discountPercentage: 0,
  expirationDate: "",
  usedBy: [],
  __v: 0,
  updatedAt: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // addToCart
    isLoadingAddCart: false,
    errorAddCart: null as ErrorCartState,
    // cartOverlay
    isCartOpen: false,
    // getUserCart
    isLoadingGetCart: false,
    cart: defaultCart,
    errorGetCart: null as ErrorCartState,
    // deleteFromCart
    isLoadingDeleteCart: false,
    errorDeleteCart: null as ErrorCartState,
    // quantity
    quantity: 1,
    // applyCoupon
    isLoadingApplyCoupon: false,
    errorApplyCoupon: null as ErrorCartState,
    // excludeCoupon
    isLoadingExcludeCoupon: false,
    errorExcludeCoupon: null as ErrorCartState,
    // addCoupon
    isLoadingAddCoupon: false,
    coupon: defaultCoupon,
    couponAddMessage: "",
    errorAddCoupon: null as ErrorCartState,
    // deleteCoupon
    isLoadingDeleteCoupon: false,
    couponDeleteMessage: "",
    errorDeleteCoupon: null as ErrorCartState,
    // removeCart
    isLoadingRemoveCart: false,
    messageRemoveCart: "",
    errorRemoveCart: null as ErrorCartState,
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
      state.errorRemoveCart = null;
    },
    clearCouponError: state => {
      state.errorApplyCoupon = null;
      state.errorExcludeCoupon = null;
      state.errorAddCoupon = null;
      state.errorDeleteCoupon = null;
    },
    clearCartMessage: state => {
      state.couponAddMessage = "";
      state.couponDeleteMessage = "";
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
        state.errorAddCart = action.payload as string;
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
        state.errorGetCart = action.payload as string;
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
        state.errorDeleteCart = action.payload as string;
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
        state.errorApplyCoupon = action.payload as string;
      })
      // excludeCoupon reducer
      .addCase(excludeCoupon.pending, state => {
        state.isLoadingExcludeCoupon = true;
        state.errorExcludeCoupon = null;
      })
      .addCase(excludeCoupon.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.isLoadingExcludeCoupon = false;
        state.errorExcludeCoupon = null;
      })
      .addCase(excludeCoupon.rejected, (state, action) => {
        state.isLoadingExcludeCoupon = false;
        state.errorExcludeCoupon = action.payload as string;
      })
      // addCoupon reducer
      .addCase(addCoupon.pending, state => {
        state.isLoadingAddCoupon = true;
        state.errorAddCoupon = null;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.coupon = action.payload.coupon;
        state.couponAddMessage = action.payload.message;
        state.isLoadingAddCoupon = false;
        state.errorAddCoupon = null;
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.isLoadingAddCoupon = false;
        state.errorAddCoupon = action.payload as string;
      })
      // deleteCoupon reducer
      .addCase(deleteCoupon.pending, state => {
        state.isLoadingDeleteCoupon = true;
        state.errorDeleteCoupon = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.couponDeleteMessage = action.payload.message;
        state.isLoadingDeleteCoupon = false;
        state.errorDeleteCoupon = null;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.isLoadingDeleteCoupon = false;
        state.errorDeleteCoupon = action.payload as string;
      })
      // removeCart reducer
      .addCase(removeCart.pending, state => {
        state.isLoadingRemoveCart = true;
        state.errorRemoveCart = null;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.messageRemoveCart = action.payload.message;
        state.cart = defaultCart;
        state.isLoadingRemoveCart = false;
        state.errorRemoveCart = null;
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.isLoadingRemoveCart = false;
        state.errorRemoveCart = action.payload as string;
      });
  },
});

export const {
  openCartOverlay,
  closeCartOverlay,
  setQuantity,
  clearErrorMessage,
  clearCouponError,
  clearCartMessage,
} = cartSlice.actions;

export default cartSlice.reducer;

// http://localhost:3000/categories/electronics/65256be84e6d44d34b376798
