"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Alert } from "flowbite-react";
import { ProductFilterDropdown } from "../components/subcomponents/ProductFilterDropdown";
import { ProductSortDropdown } from "../components/subcomponents/ProductSortDropdown";
import { ProductReviewNavigation } from "../components/subcomponents/ProductReviewNavigation";
import { ProductAddVote } from "../components/subcomponents/ProductAddVote";

const ProductReviewList = React.memo(function ProductReviewList({
  productId,
  userId,
  reviews,
}) {
  const { pagination, reviewsMessage, errorFetch } = useSelector(
    state => state.reviews
  );

  const [filterSortCriteria, setFilterSortCriteria] = useState({
    filter: null,
    sort: {
      createdAt: "desc",
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-4 col-span-2 mt-10">
      <div className="flex justify-around items-center relative">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl inline-block">
          Product Reviews
        </h1>
        <div className="flex-grow"></div>
        <ProductFilterDropdown
          productId={productId}
          filterSortCriteria={filterSortCriteria}
          setFilterSortCriteria={setFilterSortCriteria}
        />
        <div className="flex-grow"></div>
        <ProductSortDropdown
          productId={productId}
          filterSortCriteria={filterSortCriteria}
          setFilterSortCriteria={setFilterSortCriteria}
        />
        <div className="flex-grow"></div>
      </div>
      {errorFetch ? (
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
              <ProductAddVote review={review} />
              <span className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
      {reviews.length === 0 ? null : (
        <ProductReviewNavigation
          productId={productId}
          pagination={pagination}
          filterSortCriteria={filterSortCriteria}
          userId={userId}
        />
      )}
    </div>
  );
});

export default ProductReviewList;
