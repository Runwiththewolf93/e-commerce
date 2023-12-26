import { useEffect } from "react";
import { Button, Tooltip, Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItemsFromWishlist,
  clearSuccessMessages,
  clearErrorMessages,
} from "../../../redux/slices/wishlistSlice";
import { getOrders, clearOrderError } from "../../../redux/slices/orderSlice";

export default function WishlistDeleteItems({ jwt, wishlist }) {
  const dispatch = useDispatch();
  const {
    isLoadingDeleteItemsWishlist,
    messageDeleteItemsWishlist,
    errorDeleteItemsWishlist,
  } = useSelector(state => state.wishlist);
  const { isLoadingGetOrders, orders, errorGetOrders } = useSelector(
    state => state.order
  );

  useEffect(() => {
    if ((!orders || Object.keys(orders).length === 0) && jwt) {
      dispatch(getOrders(jwt));
    }

    return () => {
      dispatch(clearSuccessMessages());
      dispatch(clearErrorMessages());
      dispatch(clearOrderError());
    };
  }, [dispatch, jwt, orders]);

  const orderItemsProductIds = orders.map(order =>
    order?.items.map(item => item.product)
  );
  const uniqueOrderProductIds = [...new Set(...orderItemsProductIds)];
  // console.log(
  //   "🚀 ~ file: WishlistDeleteItems.js:21 ~ WishlistDeleteItems ~ uniqueOrderProductIds:",
  //   uniqueOrderProductIds
  // );

  const wishlistProductIds = wishlist?.productIds;
  // console.log(
  //   "🚀 ~ file: WishlistDeleteItems.js:27 ~ WishlistDeleteItems ~ wishlistProductIds:",
  //   wishlistProductIds
  // );

  const productIdsToRemove = wishlistProductIds?.filter(id =>
    uniqueOrderProductIds.includes(id)
  );
  // console.log(
  //   "🚀 ~ file: WishlistDeleteItems.js:35 ~ WishlistDeleteItems ~ productIdsToRemove:",
  //   productIdsToRemove
  // );

  const handleRemoveOrderedItems = () => {
    if (productIdsToRemove.length > 0) {
      dispatch(
        deleteItemsFromWishlist({ jwt, productIds: productIdsToRemove })
      );
    }
  };

  return (
    <div className="flex justify-between items-center mb-3">
      <h1 className="font-bold text-2xl">Wishlist</h1>
      <Tooltip
        content={
          productIdsToRemove.length === 0
            ? "You haven't bought any items from your wishlist!"
            : "Items will be removed regardless of quantity bought!"
        }
      >
        <Button
          className={
            productIdsToRemove.length === 0
              ? "cursor-not-allowed mr-16"
              : "mr-16"
          }
          color="blue"
          onClick={handleRemoveOrderedItems}
          disabled={isLoadingDeleteItemsWishlist || isLoadingGetOrders}
        >
          {isLoadingDeleteItemsWishlist ? (
            <span className="text-base">Processing...</span>
          ) : (
            <span className="text-base">Remove ordered wishlist items</span>
          )}
        </Button>
      </Tooltip>
      {(messageDeleteItemsWishlist ||
        errorDeleteItemsWishlist ||
        errorGetOrders) && (
        <Alert
          color={
            errorDeleteItemsWishlist || errorGetOrders ? "failure" : "success"
          }
          onDismiss={() => {
            dispatch(clearSuccessMessages());
            dispatch(clearErrorMessages());
            dispatch(clearOrderError());
          }}
        >
          {messageDeleteItemsWishlist ||
            errorDeleteItemsWishlist ||
            errorGetOrders}
        </Alert>
      )}
    </div>
  );
}
