"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineHeart, HiMinusSm, HiPlusSm, HiHeart } from "react-icons/hi";
import styles from "./ProductCart.module.css";
import { Alert, Spinner } from "flowbite-react";
import {
  addToWishlist,
  getWishlistId,
  deleteFromWishlist,
  clearSuccessMessages,
  clearErrorMessages,
} from "../../../redux/slices/wishlistSlice";
import Link from "next/link";
import ProductSizeWrapper from "./ProductSizeWrapper";

export default function ProductCart({ product, jwt }) {
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

  const [quantity, setQuantity] = useState(1);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    if (jwt !== undefined) {
      setIsLoadingSession(false);

      if (jwt) {
        dispatch(getWishlistId({ productId: product._id, jwt }));
      }
    }
  }, [dispatch, product._id, jwt]);

  const handleQuantityChange = newQuantity => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  const handleWishlistAction = () => {
    const action = inWishlist
      ? deleteFromWishlist({ productId: product._id, jwt })
      : addToWishlist({ productId: product._id, jwt });

    dispatch(action).then(() => {
      dispatch(getWishlistId({ productId: product._id, jwt }));
    });
  };

  if (isLoadingSession) {
    return (
      <ProductSizeWrapper minHeight="200px" minWidth="350px">
        <Spinner size="xl" />
      </ProductSizeWrapper>
    );
  }

  if (!jwt) {
    return (
      <ProductSizeWrapper minHeight="200px" minWidth="350px">
        <Alert color="info" className="mt-3">
          You are not logged in! Please log in to add items to cart or wishlist.
          Click{" "}
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
    <div className="flex flex-col mt-12">
      <div className="flex items-center p-3">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-2 text-gray-600 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={quantity === 1}
        >
          <HiMinusSm />
        </button>
        <input
          type="number"
          className={`w-12 text-center border-t border-b ${styles["quantity-input"]}`}
          value={quantity}
          onChange={e => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          max={product.stock}
        />
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-2 text-gray-600 border rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={quantity === product.stock}
        >
          <HiPlusSm />
        </button>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={addToCart}
      >
        Add to cart
      </button>

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
    </div>
  );
}

{
  /* <button
onClick={() =>
  dispatch(
    addToWishlist({ productId: "65256e8a4e6d44d34b3767ad", jwt })
  )
}
>
Add wish
</button>
<button
onClick={() =>
  dispatch(
    deleteFromWishlist({ productId: "65256c944e6d44d34b37679e", jwt })
  )
}
>
Remove wish
</button> */
}
