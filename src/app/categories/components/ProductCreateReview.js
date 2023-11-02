import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../../redux/slices/reviewSlice";
import { Alert } from "flowbite-react";

const CreateReview = ({ productId, userId, jwt }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector(state => state.reviews);

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(createReview({ userId, productId, review, rating, jwt }));
    setReview("");
    setRating(5);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
      {message && <Alert color="success">{message}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
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
