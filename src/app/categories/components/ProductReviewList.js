"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../../redux/slices/reviewSlice";
import { Spinner, Alert } from "flowbite-react";
import {
  FilterDropdown,
  SortDropdown,
  ReviewNavigation,
  AddVote,
} from "./ProductComponents";

export default function ProductReviewList({ productId, userId }) {
  console.log(
    "🚀 ~ file: ProductReviewList.js:15 ~ ProductReviewList ~ userId:",
    userId
  );
  console.log(
    "🚀 ~ file: ProductReviewList.js:15 ~ ProductReviewList ~ productId:",
    productId
  );
  const dispatch = useDispatch();
  const { isLoadingFetch, reviews, pagination, reviewsMessage, errorFetch } =
    useSelector(state => state.reviews);
  const [filterSortCriteria, setFilterSortCriteria] = useState({
    filter: null,
    sort: {
      createdAt: "desc",
      updatedAt: "desc",
    },
  });
  const lastFetchedProductIdRef = useRef(null);
  console.log(
    "🚀 ~ file: ProductReviewList.js:30 ~ ProductReviewList ~ lastFetchedProductIdRef:",
    lastFetchedProductIdRef
  );

  useEffect(() => {
    if (productId && productId !== lastFetchedProductIdRef.current) {
      dispatch(fetchReviews({ productId, userId }));
      lastFetchedProductIdRef.current = productId;
    }
  }, [dispatch, productId, userId]);

  return (
    <div className="space-y-4 col-span-2">
      <div className="flex justify-around items-center relative">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl inline-block">
          Product Reviews
        </h1>
        <div className="flex-grow"></div>
        <FilterDropdown
          productId={productId}
          filterSortCriteria={filterSortCriteria}
          setFilterSortCriteria={setFilterSortCriteria}
        />
        <div className="flex-grow"></div>
        <SortDropdown
          productId={productId}
          filterSortCriteria={filterSortCriteria}
          setFilterSortCriteria={setFilterSortCriteria}
        />
        <div className="flex-grow"></div>
      </div>
      {isLoadingFetch ? (
        <div className="flex justify-center">
          <Spinner size="xl" />
        </div>
      ) : errorFetch ? (
        <Alert color="failure" className="text-base">
          {errorFetch}
        </Alert>
      ) : reviews.length === 0 && reviewsMessage ? (
        <Alert color="info" className="text-base">
          {reviewsMessage}
        </Alert>
      ) : (
        reviews?.map((review, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {review.userId.username}
              </h3>
              <span className="text-yellow-400 text-lg">
                {"⭐".repeat(review.rating)}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{review.review}</p>
            <div className="mt-4 flex items-center justify-between">
              <AddVote review={review} />
              <span className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
      {reviews.length === 0 ? null : (
        <ReviewNavigation
          productId={productId}
          pagination={pagination}
          filterSortCriteria={filterSortCriteria}
          userId={userId}
        />
      )}
    </div>
  );
}
