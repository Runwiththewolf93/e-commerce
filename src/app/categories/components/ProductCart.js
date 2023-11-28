"use client";

import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, openCartOverlay } from "../../../redux/slices/cartSlice";
import CartOverlay from "../../cart/overlay/page";
import CartQuantity from "../../cart/shared/CartQuantity";

export default function ProductCart({ product, jwt }) {
  const dispatch = useDispatch();
  const { isCartOpen, isLoadingGetCart, quantity } = useSelector(
    state => state.cart
  );

  const handleAddToCart = () => {
    // Dispatch action to add item to cart
    dispatch(addToCart({ productId: product._id, quantity, jwt }));
    // Open the cart overlay
    dispatch(openCartOverlay());
  };

  return (
    <div>
      <CartQuantity />

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={handleAddToCart}
        disabled={isLoadingGetCart}
      >
        {isLoadingGetCart ? "Adding..." : "Add to cart"}
      </button>

      {isCartOpen ? <CartOverlay /> : null}
    </div>
  );
}
