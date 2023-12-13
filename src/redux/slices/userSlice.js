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

export const resetUserPassword = createAsyncThunk(
  "user/resetUserPassword",
  async ({ jwt, email, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).post("/api/users/reset", {
        email,
        currentPassword,
        newPassword,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios().post("/api/users/register", {
        name,
        email,
        password,
      });

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
    // resetUserPassword
    isLoadingResetUserPassword: false,
    messageResetUserPassword: "",
    errorResetUserPassword: null,
    // registerUser
    isLoadingRegisterUser: false,
    user: {},
    errorRegisterUser: null,
  },
  reducers: {
    clearUserMessage: state => {
      state.messageUserAddress = "";
      state.messageResetUserPassword = "";
    },
    clearUserError: state => {
      state.errorGetUser = null;
      state.errorUserAddress = null;
      state.errorResetUserPassword = null;
      state.errorRegisterUser = null;
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
      })
      // resetUserPassword reducer
      .addCase(resetUserPassword.pending, state => {
        state.isLoadingResetUserPassword = true;
        state.errorResetUserPassword = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.messageResetUserPassword = action.payload.message;
        state.isLoadingResetUserPassword = false;
        state.errorResetUserPassword = null;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.errorResetUserPassword = action.payload;
        state.isLoadingResetUserPassword = false;
      })
      // registerUser reducer
      .addCase(registerUser.pending, state => {
        state.isLoadingRegisterUser = true;
        state.errorRegisterUser = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoadingRegisterUser = false;
        state.errorRegisterUser = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.errorRegisterUser = action.payload;
        state.isLoadingRegisterUser = false;
      });
  },
});

export const { clearUserMessage, clearUserError } = userSlice.actions;

export default userSlice.reducer;
