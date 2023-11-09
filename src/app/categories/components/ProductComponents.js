"use client";

import { useState, useEffect } from "react";
import { Dropdown, Tooltip, Button, Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, createVote } from "../../../redux/slices/reviewSlice";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillDislike,
  AiFillLike,
} from "react-icons/ai";
import { useSession } from "next-auth/react";

export function FilterDropdown({
  productId,
  filterSortCriteria,
  setFilterSortCriteria,
}) {
  const dispatch = useDispatch();

  const handleFilterChange = filterOption => {
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
  };

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

  console.log("does this trigger on every render?");

  const handleSortFilter = field => {
    const newOrder = sortOrder[field] === "desc" ? "asc" : "desc";
    setSortOrder({ ...sortOrder, [field]: newOrder });

    setFilterSortCriteria(prev => ({
      ...prev,
      sort: { [field]: newOrder },
    }));

    console.log(
      "🚀 ~ file: ProductComponents.js:98 ~ handleSortFilter ~ filterSortCriteria:",
      filterSortCriteria
    );
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
  userId,
}) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(Number(pagination.page));

  // Update currentPage whenever pagination.page changes
  useEffect(() => {
    setCurrentPage(Number(pagination.page));
  }, [pagination.page]);

  console.log(
    "🚀 ~ file: ProductComponents.js:132 ~ pagination.page:",
    pagination.page
  );
  console.log(
    "🚀 ~ file: ProductComponents.js:132 ~ currentPage:",
    currentPage
  );
  console.log(
    "🚀 ~ file: ProductComponents.js:137 ~ pagination.pages:",
    pagination.pages
  );
  const limit = pagination.limit;

  const handleNavigation = newPage => {
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

export const AddVote = ({ review }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const jwt = session?.customJwt;

  const { isLoadingVote, errorVote, latestVoteRequestId } = useSelector(
    state => state.reviews
  );
  const [localUpvotes, setLocalUpvotes] = useState(review?.upvotesCount || 0);
  const [localDownvotes, setLocalDownvotes] = useState(
    review?.downvotesCount || 0
  );
  const [localUserVoteType, setLocalUserVoteType] = useState(
    review?.userVoteType || null
  );

  const handleVote = voteType => {
    if (localUserVoteType === voteType) {
      // User is retracting their vote
      setLocalUpvotes(prev => (voteType === "upvote" ? prev - 1 : prev));
      setLocalDownvotes(prev => (voteType === "downvote" ? prev - 1 : prev));
      setLocalUserVoteType(null);
    } else {
      // User is voting for the first time or changing their vote
      if (voteType === "upvote") {
        // If the user is changing from downvote to upvote
        setLocalUpvotes(prev =>
          localUserVoteType === "downvote" ? prev + 1 : prev + 1
        );
        setLocalDownvotes(prev =>
          localUserVoteType === "downvote" ? prev - 1 : prev
        );
      } else if (voteType === "downvote") {
        // If the user is changing from upvote to downvote
        setLocalDownvotes(prev =>
          localUserVoteType === "upvote" ? prev + 1 : prev + 1
        );
        setLocalUpvotes(prev =>
          localUserVoteType === "upvote" ? prev - 1 : prev
        );
      }
      setLocalUserVoteType(voteType);
    }

    // Dispatch the vote action with the voteType
    dispatch(createVote({ reviewId: review._id, voteType, jwt }));
  };

  useEffect(() => {
    setLocalUpvotes(review?.upvotesCount || 0);
    setLocalDownvotes(review?.downvotesCount || 0);
    setLocalUserVoteType(review?.userVoteType || null);
  }, [review]);

  const isUpvoted = localUserVoteType === "upvote";
  const isDownvoted = localUserVoteType === "downvote";

  return (
    <div className="flex">
      <button
        className={`flex items-center ${
          isUpvoted ? "text-green-600" : "text-green-500"
        }`}
        onClick={() => handleVote("upvote")}
        disabled={isLoadingVote && latestVoteRequestId}
      >
        {isUpvoted ? (
          <AiFillLike className="w-6 h-6 mr-0.5" />
        ) : (
          <AiOutlineLike className="w-6 h-6 mr-0.5" />
        )}
        <span>{localUpvotes}</span>
      </button>
      <button
        className={`flex items-center ml-5 ${
          isDownvoted ? "text-red-600" : "text-red-500"
        }`}
        onClick={() => handleVote("downvote")}
        disabled={isLoadingVote && latestVoteRequestId}
      >
        {isDownvoted ? (
          <AiFillDislike className="w-6 h-6 mr-0.5" />
        ) : (
          <AiOutlineDislike className="w-6 h-6 mr-0.5" />
        )}
        <span>{localDownvotes}</span>
      </button>
      {errorVote && (
        <Alert color="failure" className="ml-5">
          {errorVote}
        </Alert>
      )}
    </div>
  );
};
