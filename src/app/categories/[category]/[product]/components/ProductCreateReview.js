import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  resetCreateReview,
} from "../../../../../redux/slices/reviewSlice";
import { Alert } from "flowbite-react";
import Link from "next/link";
import ProductSizeWrapper from "./ProductSizeWrapper";
import ProductCreateReviewSkeleton from "./subcomponents/ProductCreateReviewSkeleton";

/**
 * Creates a review for a product.
 *
 * @param {string} productId - The ID of the product.
 * @param {string} userId - The ID of the user creating the review.
 * @param {string} jwt - The JSON Web Token for authentication.
 * @param {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @return {void} No return value.
 */
const ProductCreateReview = ({ productId, userId, jwt, isAuthenticated }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const dispatch = useDispatch();
  const { isLoadingCreateReview, messageCreateReview, errorCreateReview } =
    useSelector(state => state.reviews);

  useEffect(() => {
    if (jwt !== undefined || !isAuthenticated) {
      setIsLoadingSession(false);
    }
  }, [jwt, isAuthenticated]);

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(createReview({ userId, productId, review, rating, jwt }));
    setReview("");
    setRating(5);
  };

  if (isLoadingSession) {
    return <ProductCreateReviewSkeleton />;
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
      {messageCreateReview && (
        <Alert
          color="success"
          onDismiss={() => dispatch(resetCreateReview())}
          className="mb-3"
        >
          {messageCreateReview}
        </Alert>
      )}
      {errorCreateReview && (
        <Alert
          color="failure"
          onDismiss={() => dispatch(resetCreateReview())}
          className="mb-3"
        >
          {errorCreateReview}
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
          disabled={isLoadingCreateReview}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductCreateReview;
