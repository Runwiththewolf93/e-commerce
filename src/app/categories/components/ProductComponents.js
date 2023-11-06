"use client";

import { Dropdown } from "flowbite-react";
import { useDispatch } from "react-redux";
import { fetchReviews } from "../../../redux/slices/reviewSlice";

export function FilterDropdown({ productId }) {
  const dispatch = useDispatch();

  const handleRatingFilter = rating => {
    const filter = rating ? { productId, rating } : { productId };
    dispatch(fetchReviews(filter));
  };

  return (
    <Dropdown label="Filter" inline placement="right">
      <Dropdown.Item onClick={() => handleRatingFilter(null)}>
        All stars
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleRatingFilter(5)}>
        5 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleRatingFilter(4)}>
        4 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleRatingFilter(3)}>
        3 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleRatingFilter(2)}>
        2 star only
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleRatingFilter(1)}>
        1 star only
      </Dropdown.Item>
      <Dropdown.Item>Positive</Dropdown.Item>
      <Dropdown.Item>Critical</Dropdown.Item>
    </Dropdown>
  );
}

export function SortDropdown() {
  return (
    <Dropdown label="Sort By" inline placement="right">
      <Dropdown.Item>Created At</Dropdown.Item>
      <Dropdown.Item>Updated At</Dropdown.Item>
    </Dropdown>
  );
}
