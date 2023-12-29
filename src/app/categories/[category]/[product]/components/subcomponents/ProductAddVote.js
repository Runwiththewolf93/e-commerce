import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillDislike,
  AiOutlineDislike,
} from "react-icons/ai";
import { createVote } from "../../../../../../redux/slices/reviewSlice";
import { Alert } from "flowbite-react";

export const ProductAddVote = React.memo(function ProductAddVote({ review }) {
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:177 ~ AddVote ~ review:",
  //   review
  // );
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const jwt = session?.customJwt;

  const { isLoadingVote, errorVote, latestVoteRequestId } = useSelector(
    state => state.reviews
  );
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:226 ~ AddVote ~ latestVoteRequestId:",
  //   latestVoteRequestId
  // );
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:226 ~ AddVote ~ errorVote:",
  //   errorVote
  // );
  // console.log(
  //   "🚀 ~ file: ProductComponents.js:226 ~ AddVote ~ isLoadingVote:",
  //   isLoadingVote
  // );
  const [localUpvotes, setLocalUpvotes] = useState(review?.upvotesCount || 0);
  const [localDownvotes, setLocalDownvotes] = useState(
    review?.downvotesCount || 0
  );
  const [localUserVoteType, setLocalUserVoteType] = useState(
    review?.userVoteType || null
  );

  const handleVote = useCallback(
    voteType => {
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
    },
    [localUserVoteType, dispatch, review._id, jwt]
  );

  useEffect(() => {
    // console.log("The main culprit, how often do you log?");
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
});
