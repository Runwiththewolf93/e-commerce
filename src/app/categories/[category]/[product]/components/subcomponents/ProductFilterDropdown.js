import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Dropdown } from "flowbite-react";
import { fetchReviews } from "../../../../../../redux/slices/reviewSlice";

export const ProductFilterDropdown = React.memo(function ProductFilterDropdown({
  productId,
  filterSortCriteria,
  setFilterSortCriteria,
}) {
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:21 ~ setFilterSortCriteria:",
  //   setFilterSortCriteria
  // );
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:21 ~ filterSortCriteria:",
  //   filterSortCriteria
  // );
  // console.log("🚀 ~ file: ProductComponents.js:21 ~ productId:", productId);
  const dispatch = useDispatch();

  const handleFilterChange = useCallback(
    filterOption => {
      const newFilter = filterOption.hasOwnProperty("rating")
        ? { rating: filterOption.rating }
        : { reviewType: filterOption.reviewType };

      setFilterSortCriteria(prev => ({
        ...prev,
        filter: newFilter,
      }));

      dispatch(
        fetchReviews({ ...filterSortCriteria, filter: newFilter, productId })
      );
    },
    [dispatch, filterSortCriteria, productId, setFilterSortCriteria]
  );

  return (
    <Dropdown label="Filter" inline placement="right">
      <Dropdown.Item onClick={() => handleFilterChange({})}>
        All stars
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleFilterChange({ rating: 5 })}>
        5 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleFilterChange({ rating: 4 })}>
        4 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleFilterChange({ rating: 3 })}>
        3 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleFilterChange({ rating: 2 })}>
        2 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleFilterChange({ rating: 1 })}>
        1 star only
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => handleFilterChange({ reviewType: "positive" })}
      >
        Positive
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => handleFilterChange({ reviewType: "critical" })}
      >
        Critical
      </Dropdown.Item>
    </Dropdown>
  );
});
