import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../lib/api";

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (
    { userId, productId, review, rating, jwt },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(resetCreateReview());

      const { data } = await customAxios(jwt).post("/api/reviews/addReview", {
        userId,
        productId,
        review,
        rating,
      });

      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (
    {
      productId,
      rating,
      reviewType,
      sort,
      aggregateRating,
      page,
      limit,
      userId,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await customAxios().get(
        `/api/reviews/getReviews?productId=${productId}&rating=${rating}&reviewType=${reviewType}&sort=${sort}&aggregateRating=${aggregateRating}&page=${page}&limit=${limit}&userId=${userId}`
      );

      return {
        reviews: data.reviews,
        pagination: data.pagination,
        reviewsMessage: data.message,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createVote = createAsyncThunk(
  "reviews/createVote",
  async ({ userId, reviewId, voteType, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch("/api/reviews/addVote", {
        userId,
        reviewId,
        voteType,
        jwt,
      });

      return data;
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
    isLoadingFetch: false,
    reviews: [],
    pagination: {},
    reviewsMessage: "",
    errorFetch: null,
    isLoadingVote: false,
    errorVote: null,
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
      // createReview reducer
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
      })
      // fetchReview reducer
      .addCase(fetchReviews.pending, state => {
        state.isLoadingFetch = true;
        state.reviews = [];
        state.errorFetch = null;
        state.reviewsMessage = "";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.reviewsMessage = action.payload.reviewsMessage;
        state.isLoadingFetch = false;
        state.errorFetch = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoadingFetch = false;
        state.errorFetch = action.payload;
      })
      // addVote reducer
      .addCase(createVote.pending, state => {
        state.isLoadingVote = true;
        state.errorVote = null;
      })
      .addCase(createVote.fulfilled, (state, action) => {
        const { reviewId, userVoteType, upvotesCount, downvotesCount } =
          action.payload;
        const reviewIndex = state.reviews.findIndex(
          review => review._id === reviewId
        );
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex].upvotesCount = upvotesCount;
          state.reviews[reviewIndex].downvotesCount = downvotesCount;
          state.reviews[reviewIndex].userVoteType = userVoteType;
        }
        state.isLoadingVote = false;
        state.errorVote = null;
      })
      .addCase(createVote.rejected, (state, action) => {
        state.isLoadingVote = false;
        state.errorVote = action.payload;
      });
  },
});

export const { resetCreateReview } = reviewSlice.actions;

export default reviewSlice.reducer;

// http://localhost:3000/categories/electronics/65256be84e6d44d34b376798