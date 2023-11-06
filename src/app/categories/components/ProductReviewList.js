"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../../redux/slices/reviewSlice";
import { Spinner, Alert } from "flowbite-react";
import { FilterDropdown, SortDropdown } from "./ProductComponents";

export default function ProductReviewList({ productId }) {
  const dispatch = useDispatch();
  const { isLoadingFetch, reviews, reviewsMessage, errorFetch } = useSelector(
    state => state.reviews
  );
  console.log(
    "🚀 ~ file: ProductReviewList.js:10 ~ ProductReviewList ~ reviews:",
    reviews
  );

  useEffect(() => {
    if (!reviews && productId) {
      console.log("does this trigger?");
      dispatch(fetchReviews({ productId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, productId]);

  return (
    <div className="space-y-4 col-span-2">
      <div className="flex justify-around items-center relative">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl inline-block">
          Product Reviews
        </h1>
        <div className="flex-grow"></div>
        <FilterDropdown productId={productId} />
        <div className="flex-grow"></div>
        <SortDropdown />
        <div className="flex-grow"></div>
      </div>
      {isLoadingFetch ? (
        <Spinner size="xl" />
      ) : errorFetch ? (
        <Alert color="failure">{errorFetch}</Alert>
      ) : reviews.length === 0 && reviewsMessage ? (
        <Alert color="info">{reviewsMessage}</Alert>
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
              <div>
                <button className="text-green-500">👍 {review.upvotes}</button>
                <button className="ml-4 text-red-500">
                  👎 {review.downvotes}
                </button>
              </div>
              <span className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
