import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { Button } from "flowbite-react";
import { fetchReviews } from "../../../../../../redux/slices/reviewSlice";

export const ProductReviewNavigation = React.memo(
  function ProductReviewNavigation({
    productId,
    pagination,
    filterSortCriteria,
    userId,
  }) {
    // console.log("🚀 ~ file: ProductComponents.js:151 ~ userId:", userId);
    // console.log(
    //   "🚀 ~ file: ProductComponents.js:122 ~ filterSortCriteria:",
    //   filterSortCriteria
    // );
    // console.log("🚀 ~ file: ProductComponents.js:122 ~ pagination:", pagination);
    // console.log("🚀 ~ file: ProductComponents.js:122 ~ productId:", productId);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(Number(pagination.page));
    // console.log(
    //   "🚀 ~ file: ProductComponents.js:124 ~ pagination:",
    //   pagination.page
    // );

    // Update currentPage whenever pagination.page changes
    useEffect(() => {
      setCurrentPage(Number(pagination.page));
    }, [pagination.page]);

    const limit = pagination.limit;

    const handleNavigation = useCallback(
      newPage => {
        setCurrentPage(newPage);
        dispatch(
          fetchReviews({
            productId,
            userId,
            page: newPage,
            limit,
            ...filterSortCriteria,
          })
        );
      },
      [dispatch, filterSortCriteria, limit, productId, userId]
    );

    return (
      <div className="flex">
        <Button
          outline
          color="blue"
          gradientDuoTone="purpleToBlue"
          className="mr-3"
          onClick={() => handleNavigation(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <HiOutlineArrowLeft className="mr-1" />
          Previous page
        </Button>
        <Button
          outline
          color="blue"
          gradientDuoTone="purpleToBlue"
          onClick={() => handleNavigation(currentPage + 1)}
          disabled={currentPage === pagination.pages}
        >
          Next page
          <HiOutlineArrowRight className="ml-1" />
        </Button>
      </div>
    );
  }
);
