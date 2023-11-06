import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "../../../subcomponents/StarRating";
import { fetchAggregateRating } from "../../../redux/slices/reviewSlice";
import { TooltipStar } from "./ProductComponents";

export default function ProductAggregateRating({ productId }) {
  const dispatch = useDispatch();
  const { isLoadingAggregateRating, aggregateData, errorAggregateRating } =
    useSelector(state => state.reviews);

  useEffect(() => {
    if ((!aggregateData || aggregateData.length === 0) && productId) {
      dispatch(fetchAggregateRating({ productId }));
    }
  }, [dispatch, productId, aggregateData]);

  const rating = aggregateData.length
    ? aggregateData[0].averageRating.toFixed(2)
    : 0;

  const tooltipContent = isLoadingAggregateRating
    ? "Loading rating..."
    : errorAggregateRating
    ? "Error loading rating"
    : null;

  return (
    <div className="mt-5">
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        <div className="flex items-center">
          {tooltipContent ? (
            <TooltipStar content={tooltipContent}>
              <StarRating aggregateRating={rating} />
            </TooltipStar>
          ) : (
            <StarRating aggregateRating={rating} />
          )}
        </div>
        <p className="sr-only">{`${rating} out of 5 stars`}</p>
        <span className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
          {aggregateData.length ? aggregateData[0].totalReviews : 0} reviews
        </span>
      </div>
    </div>
  );
}
