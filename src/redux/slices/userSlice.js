"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const getUser = createAsyncThunk(
  "user/getUser",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get("/api/users/getUser");

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userAddress = createAsyncThunk(
  "user/userAddress",
  async ({ jwt, address }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch(
        "/api/users/address",
        address
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    // getUser
    isLoadingGetUser: false,
    user: {},
    errorGetUser: null,
    // userAddress
    isLoadingUserAddress: false,
    messageUserAddress: "",
    errorUserAddress: null,
  },
  reducers: {
    clearUserMessage: state => {
      state.messageUserAddress = "";
    },
    clearUserError: state => {
      state.errorGetUser = null;
      state.errorUserAddress = null;
    },
  },
  extraReducers: builder => {
    builder
      // getUser reducer
      .addCase(getUser.pending, state => {
        state.isLoadingGetUser = true;
        state.errorGetUser = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoadingGetUser = false;
        state.errorGetUser = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.errorGetUser = action.payload;
        state.isLoadingGetUser = false;
      })
      // userAddress reducer
      .addCase(userAddress.pending, state => {
        state.isLoadingUserAddress = true;
        state.errorUserAddress = null;
      })
      .addCase(userAddress.fulfilled, (state, action) => {
        state.messageUserAddress = action.payload.message;
        state.isLoadingUserAddress = false;
        state.errorUserAddress = null;
      })
      .addCase(userAddress.rejected, (state, action) => {
        state.errorUserAddress = action.payload;
        state.isLoadingUserAddress = false;
      });
  },
});

export const { clearUserMessage, clearUserError } = userSlice.actions;

export default userSlice.reducer;
