import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown } from "flowbite-react";
import { fetchReviews } from "../../../../../../redux/slices/reviewSlice";

export const ProductSortDropdown = React.memo(function ProductSortDropdown({
  productId,
  filterSortCriteria,
  setFilterSortCriteria,
}) {
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:87 ~ setFilterSortCriteria:",
  //   setFilterSortCriteria
  // );
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:87 ~ filterSortCriteria:",
  //   filterSortCriteria
  // );
  // console.log("🚀 ~ file: ProductComponents.js:87 ~ productId:", productId);
  const dispatch = useDispatch();

  const [sortOrder, setSortOrder] = useState({
    createdAt: "desc",
    updatedAt: "desc",
  });

  const handleSortFilter = useCallback(
    field => {
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
    },
    [
      sortOrder,
      setSortOrder,
      setFilterSortCriteria,
      dispatch,
      filterSortCriteria,
      productId,
    ]
  );

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
});
