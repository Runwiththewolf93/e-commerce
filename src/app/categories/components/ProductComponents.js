"use client";

import { useState } from "react";
import { Dropdown, Tooltip } from "flowbite-react";
import { useDispatch } from "react-redux";
import { fetchReviews } from "../../../redux/slices/reviewSlice";

export function FilterDropdown({
  productId,
  filterSortCriteria,
  setFilterSortCriteria,
}) {
  const dispatch = useDispatch();

  const handleRatingFilter = rating => {
    setFilterSortCriteria(prev => ({
      ...prev,
      filter: { rating },
    }));
    dispatch(
      fetchReviews({ ...filterSortCriteria, filter: { rating }, productId })
    );
  };

  return (
    <Dropdown label="Filter" inline placement="right">
      <Dropdown.Item onClick={() => handleRatingFilter(undefined)}>
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

export function SortDropdown({
  productId,
  filterSortCriteria,
  setFilterSortCriteria,
}) {
  const dispatch = useDispatch();

  const [sortOrder, setSortOrder] = useState({
    createdAt: "desc",
    updatedAt: "desc",
  });

  const handleSortFilter = field => {
    const newOrder = sortOrder[field] === "desc" ? "asc" : "desc";
    setSortOrder({ ...sortOrder, [field]: newOrder });

    setFilterSortCriteria(prev => ({
      ...prev,
      sort: { [field]: newOrder },
    }));

    dispatch(
      fetchReviews({
        ...filterSortCriteria,
        sort: { [field]: newOrder },
        productId,
      })
    );
  };

  return (
    <Dropdown label="Sort By" inline placement="right">
      <Dropdown.Item onClick={() => handleSortFilter("createdAt")}>
        Created At ({sortOrder.createdAt === "desc" ? "↓" : "↑"})
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleSortFilter("updatedAt")}>
        Updated At ({sortOrder.updatedAt === "desc" ? "↓" : "↑"})
      </Dropdown.Item>
    </Dropdown>
  );
}

export const TooltipStar = ({ content, children }) => {
  return <Tooltip content={content}>{children}</Tooltip>;
};
