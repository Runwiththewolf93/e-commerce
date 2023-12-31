"use client";

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

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (
    { productId, filter, sort, aggregateRating, page, limit, userId },
    { rejectWithValue }
  ) => {
    const rating = filter?.rating;
    const reviewType = filter?.reviewType;
    const sortField = sort ? Object.keys(sort).find(key => sort[key]) : null;
    const sortOrder = sort ? sort[sortField] : null;

    // Initialize paramsObject with mandatory parameters
    let paramsObject = { productId };

    // Add optional parameters if they are defined
    if (page !== undefined) paramsObject.page = page.toString();
    if (limit !== undefined) paramsObject.limit = limit.toString();
    if (rating !== undefined) paramsObject.rating = rating.toString();
    if (reviewType !== undefined) paramsObject.reviewType = reviewType;
    if (sortField && sortOrder) paramsObject.sort = `${sortField}_${sortOrder}`;
    if (aggregateRating !== undefined)
      paramsObject.aggregateRating = aggregateRating;
    if (userId !== undefined) paramsObject.userId = userId;

    // console.log("🚀 ~ file: reviewSlice.js:45 ~ paramsObject:", paramsObject);

    try {
      // Convert the parameters object to a query string
      const queryParams = new URLSearchParams(paramsObject).toString();

      const { data } = await customAxios().get(
        `/api/reviews/getReviews?${queryParams}`
      );
      // console.log("🚀 ~ file: reviewSlice.js:48 ~ data:", data);

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

export const fetchAggregateRating = createAsyncThunk(
  "reviews/fetchAggregateRating",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios().get(
        `/api/reviews/getReviews?productId=${productId}&aggregateRating=${true}`
      );

      return data.aggregateData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createVote = createAsyncThunk(
  "reviews/createVote",
  async ({ reviewId, voteType, jwt }, { rejectWithValue }) => {
    try {
      const { data } = await customAxios(jwt).patch("/api/reviews/addVote", {
        reviewId,
        voteType,
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
    // createReview
    isLoadingCreateReview: false,
    messageCreateReview: "",
    errorCreateReview: null,
    // fetchReview
    isLoadingFetchReviews: false,
    reviews: [],
    pagination: {},
    reviewsMessage: "",
    errorFetchReviews: null,
    // createVote
    isLoadingVote: false,
    prevReviewState: null,
    latestVoteRequestId: null,
    errorVote: null,
    // fetchAggregateRating
    isLoadingAggregateRating: false,
    aggregateData: [],
    errorAggregateRating: null,
  },
  reducers: {
    resetCreateReview: state => {
      state.isLoadingCreateReview = false;
      state.messageCreateReview = "";
      state.errorCreateReview = null;
    },
  },
  extraReducers: builder => {
    builder
      // createReview reducer
      .addCase(createReview.pending, state => {
        state.isLoadingCreateReview = true;
        state.errorCreateReview = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        const newReview = action.payload.review;
        const existingReviewIndex = state.reviews.findIndex(
          review => review.userId === newReview.userId
        );

        if (existingReviewIndex !== -1) {
          // Replace the existing review
          state.reviews[existingReviewIndex] = newReview;
        } else {
          // Add new review
          state.reviews.push(newReview);
        }

        state.messageCreateReview = action.payload.message;
        state.isLoadingCreateReview = false;
        state.errorCreateReview = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoadingCreateReview = false;
        state.errorCreateReview = action.payload;
      })
      // fetchReview reducer
      .addCase(fetchReviews.pending, state => {
        state.isLoadingFetchReviews = true;
        state.reviews = [];
        state.errorFetchReviews = null;
        state.reviewsMessage = "";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.reviewsMessage = action.payload.reviewsMessage;
        state.isLoadingFetchReviews = false;
        state.errorFetchReviews = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoadingFetchReviews = false;
        state.errorFetchReviews = action.payload;
      })
      // fetchAggregateRating reducer
      .addCase(fetchAggregateRating.pending, state => {
        state.isLoadingAggregateRating = true;
        state.errorAggregateRating = null;
      })
      .addCase(fetchAggregateRating.fulfilled, (state, action) => {
        state.aggregateData = action.payload;
        state.isLoadingAggregateRating = false;
        state.errorAggregateRating = null;
      })
      .addCase(fetchAggregateRating.rejected, (state, action) => {
        state.isLoadingAggregateRating = false;
        state.errorAggregateRating = action.payload;
      })
      // createVote reducer
      .addCase(createVote.pending, (state, action) => {
        // Store the previous state before the optimistic update
        const { reviewId } = action.meta.arg;
        const reviewIndex = state.reviews.findIndex(
          review => review._id === reviewId
        );
        if (reviewIndex !== -1) {
          state.prevReviewState = { ...state.reviews[reviewIndex] };
        }
        state.isLoadingVote = true;
        state.errorVote = null;
        state.latestVoteRequestId = action.meta.requestId;
      })
      .addCase(createVote.fulfilled, (state, action) => {
        if (action.meta.requestId === state.latestVoteRequestId) {
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
        }
        // Clear previous state if updated confirmed
        state.prevReviewState = null;
        state.isLoadingVote = false;
        state.errorVote = null;
        state.latestVoteRequestId = null;
      })
      .addCase(createVote.rejected, (state, action) => {
        // Rollback to previous state if the API call fails
        if (action.meta.requestId === state.latestVoteRequestId) {
          if (state.prevReviewState) {
            const reviewIndex = state.reviews.findIndex(
              review => review._id === state.prevReviewState._id
            );
            if (reviewIndex !== -1) {
              state.reviews[reviewIndex] = state.prevReviewState;
            }
          }
        }
        state.prevReviewState = null;
        state.isLoadingVote = false;
        state.errorVote = action.payload;
        state.latestVoteRequestId = null;
      });
  },
});

export const { resetCreateReview } = reviewSlice.actions;

export default reviewSlice.reducer;
