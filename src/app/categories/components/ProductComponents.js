"use client";

import { useState } from "react";
import { Dropdown, Tooltip, Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { fetchReviews } from "../../../redux/slices/reviewSlice";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

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

export const ReviewNavigation = ({
  productId,
  pagination,
  filterSortCriteria,
}) => {
  console.log(
    "🚀 ~ file: ProductComponents.js:99 ~ ReviewNavigation ~ pagination:",
    pagination
  );
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(pagination.page);
  const limit = pagination.limit;

  const handleNavigation = newPage => {
    setCurrentPage(newPage);
    dispatch(
      fetchReviews({ productId, page: newPage, limit, ...filterSortCriteria })
    );
  };

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
};
