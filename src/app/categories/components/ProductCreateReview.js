import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  resetCreateReview,
} from "../../../redux/slices/reviewSlice";
import { Alert, Spinner } from "flowbite-react";
import Link from "next/link";
import ProductSizeWrapper from "./ProductSizeWrapper";

const CreateReview = ({ productId, userId, jwt }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector(state => state.reviews);

  useEffect(() => {
    if (jwt !== undefined) {
      setIsLoadingSession(false);
    }
  }, [jwt]);

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(createReview({ userId, productId, review, rating, jwt }));
    setReview("");
    setRating(5);
  };

  if (isLoadingSession) {
    return (
      <ProductSizeWrapper minHeight="350px" minWidth="350px">
        <Spinner size="xl" />
      </ProductSizeWrapper>
    );
  }

  if (!jwt) {
    return (
      <ProductSizeWrapper minHeight="350px" minWidth="350px">
        <Alert color="info" className="mt-3">
          You are not logged in! Please log in to add reviews. Click{" "}
          <Link href="/register" className="underline">
            here
          </Link>{" "}
          to create an account, or{" "}
          <Link href="/login" className="underline">
            here
          </Link>{" "}
          to login.
        </Alert>
      </ProductSizeWrapper>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
      {message && (
        <Alert color="success" onDismiss={() => dispatch(resetCreateReview())}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert color="failure" onDismiss={() => dispatch(resetCreateReview())}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-600"
          >
            Your Review
          </label>
          <textarea
            id="review"
            name="review"
            rows="4"
            className="mt-1 p-2 w-full rounded border"
            value={review}
            onChange={e => setReview(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-600"
          >
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            className="mt-1 p-2 w-full rounded border"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            required
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default CreateReview;

// login as stevan1 and add a review tomorrow
