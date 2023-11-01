import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (
    { userId, productId, review, rating, jwt },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(resetCreateReview());

      const { data } = await axios.post(
        "/api/reviews/addReview",
        { userId, productId, review, rating },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      console.log("🚀 ~ file: reviewSlice.js:16 ~ data:", data.message);

      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    isLoading: false,
    message: "",
    error: null,
  },
  reducers: {
    resetCreateReview: state => {
      state.isLoading = false;
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createReview.pending, state => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCreateReview } = reviewSlice.actions;

export default reviewSlice.reducer;

// http://localhost:3000/categories/electronics/65256be84e6d44d34b376798
