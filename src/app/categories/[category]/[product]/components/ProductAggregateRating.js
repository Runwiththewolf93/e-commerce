import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "../../../../../subcomponents/StarRating";
import { fetchAggregateRating } from "../../../../../redux/slices/reviewSlice";
import ProductTooltipStar from "../components/subcomponents/ProductTooltipStar";

export default function ProductAggregateRating({ productId }) {
  const dispatch = useDispatch();
  const { isLoadingAggregateRating, aggregateData, errorAggregateRating } =
    useSelector(state => state.reviews);
  const lastFetchedProductIdRef = useRef(null);

  useEffect(() => {
    if (productId && productId !== lastFetchedProductIdRef.current) {
      dispatch(fetchAggregateRating({ productId }));
      lastFetchedProductIdRef.current = productId;
    }
  }, [dispatch, productId]);

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
            <ProductTooltipStar content={tooltipContent}>
              <StarRating aggregateRating={rating} />
            </ProductTooltipStar>
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
