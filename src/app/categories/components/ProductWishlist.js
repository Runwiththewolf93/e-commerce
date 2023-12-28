"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import {
  addToWishlist,
  deleteFromWishlist,
  getWishlistId,
  clearSuccessMessages,
  clearErrorMessages,
} from "../../../redux/slices/wishlistSlice";
import { Alert } from "flowbite-react";

export default function ProductWishlist({ productId, jwt }) {
  // console.log(
  //   "🚀 ~ file: ProductWishlist.js:16 ~ ProductWishlist ~ product:",
  //   product
  // );
  const dispatch = useDispatch();
  const {
    isLoadingWishlist,
    messageWishlist,
    errorWishlist,
    isLoadingWishlistId,
    inWishlist,
    errorWishlistId,
    isLoadingWishlistDelete,
    messageWishlistDelete,
    errorWishlistDelete,
  } = useSelector(state => state.wishlist);
  const isFirstRender = useRef(true);
  const prevProductId = useRef(productId);

  useEffect(() => {
    if (
      jwt &&
      productId &&
      (isFirstRender.current || prevProductId.current !== productId)
    ) {
      dispatch(getWishlistId({ productId, jwt }));
      isFirstRender.current = false;
      prevProductId.current = productId;
    }
  }, [dispatch, productId, jwt]);

  const handleWishlistAction = () => {
    if (!productId) return;

    const action = inWishlist
      ? deleteFromWishlist({ productId, jwt })
      : addToWishlist({ productId, jwt });

    dispatch(action).then(() => {
      dispatch(getWishlistId({ productId, jwt }));
    });
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-200 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-3"
        onClick={handleWishlistAction}
        disabled={
          isLoadingWishlist || isLoadingWishlistId || isLoadingWishlistDelete
        }
      >
        {inWishlist ? (
          <HiHeart className="mr-2 mb-1 text-red-600" />
        ) : (
          <HiOutlineHeart className="mr-2 mb-1 text-red-500" />
        )}
        {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      </button>
      <button
        className="mt-5"
        onClick={() =>
          dispatch(
            addToWishlist({ productId: "652578974e6d44d34b3767d7", jwt })
          )
        }
      >
        Add wish - test
      </button>
      {messageWishlist || messageWishlistDelete ? (
        <Alert
          color="success"
          className="mt-3"
          onDismiss={() => dispatch(clearSuccessMessages())}
        >
          {messageWishlist || messageWishlistDelete}
        </Alert>
      ) : null}
      {errorWishlist || errorWishlistId || errorWishlistDelete ? (
        <Alert
          color="failure"
          className="mt-3"
          onDismiss={() => dispatch(clearErrorMessages())}
        >
          {errorWishlist || errorWishlistId || errorWishlistDelete}
        </Alert>
      ) : null}
    </div>
  );
}
