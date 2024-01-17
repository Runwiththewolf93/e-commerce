"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";
import {
  UserType,
  GetUserArgs,
  GetUserResponse,
  RegisterUserType,
  ErrorUserState,
  UserAddressArgs,
  UserAddressResponse,
  ResetUserPasswordArgs,
  ResetUserPasswordResponse,
  RegisterUserArgs,
  RegisterUserResponse,
  CheckAdminArgs,
  CheckAdminResponse,
} from "../types/userSliceTypes";

export const getUser = createAsyncThunk(
  "user/getUser",
  async ({ jwt }: GetUserArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get<GetUserResponse>(
        "/api/users/getUser"
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userAddress = createAsyncThunk(
  "user/userAddress",
  async ({ jwt, address }: UserAddressArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch<UserAddressResponse>(
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
  async (
    { jwt, email, currentPassword, newPassword }: ResetUserPasswordArgs,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await customAxios(jwt).post<ResetUserPasswordResponse>(
        "/api/users/reset",
        {
          email,
          currentPassword,
          newPassword,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ name, email, password }: RegisterUserArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios().post<RegisterUserResponse>(
        "/api/users/register",
        {
          name,
          email,
          password,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const checkAdmin = createAsyncThunk(
  "user/checkAdmin",
  async ({ jwt }: CheckAdminArgs, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).get<CheckAdminResponse>(
        "/api/users/checkAdmin"
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const defaultUser: UserType = {
  _id: "",
  username: "",
  email: "",
  roles: [],
  createdAt: "",
  __v: 0,
  updatedAt: "",
};

const registerUserDefault: RegisterUserType = {
  name: "",
  email: "",
  password: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    // getUser
    isLoadingGetUser: false,
    user: defaultUser,
    errorGetUser: null as ErrorUserState,
    // userAddress
    isLoadingUserAddress: false,
    messageUserAddress: "",
    errorUserAddress: null as ErrorUserState,
    // resetUserPassword
    isLoadingResetUserPassword: false,
    messageResetUserPassword: "",
    errorResetUserPassword: null as ErrorUserState,
    // registerUser
    isLoadingRegisterUser: false,
    registerUserDetails: registerUserDefault,
    errorRegisterUser: null as ErrorUserState,
    // checkAdmin
    isLoadingCheckAdmin: false,
    isAdmin: null,
    errorCheckAdmin: null as ErrorUserState,
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
      state.errorCheckAdmin = null;
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
        state.errorGetUser = null;
        state.isLoadingGetUser = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.errorGetUser = action.payload as string;
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
        state.errorUserAddress = action.payload as string;
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
        state.errorResetUserPassword = action.payload as string;
        state.isLoadingResetUserPassword = false;
      })
      // registerUser reducer
      .addCase(registerUser.pending, state => {
        state.isLoadingRegisterUser = true;
        state.errorRegisterUser = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerUserDetails = action.payload.user;
        state.isLoadingRegisterUser = false;
        state.errorRegisterUser = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.errorRegisterUser = action.payload as string;
        state.isLoadingRegisterUser = false;
      })
      // checkAdmin reducer
      .addCase(checkAdmin.pending, state => {
        state.isLoadingCheckAdmin = true;
        state.errorCheckAdmin = null;
      })
      .addCase(checkAdmin.fulfilled, (state, action) => {
        state.isAdmin = action.payload.isAdmin;
        state.isLoadingCheckAdmin = false;
        state.errorCheckAdmin = null;
      })
      .addCase(checkAdmin.rejected, (state, action) => {
        state.errorCheckAdmin = action.payload as string;
        state.isLoadingCheckAdmin = false;
      });
  },
});

export const { clearUserMessage, clearUserError } = userSlice.actions;

export default userSlice.reducer;
