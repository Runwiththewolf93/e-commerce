"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  openCartOverlay,
} from "../../../../../redux/slices/cartSlice";
import CartOverlay from "../../../../cart/overlay/page";
import CartQuantity from "../../../../cart/shared/CartQuantity";
import { useCloseCartOnRouteChange } from "../../../../hooks/useCloseCartOnRouteChange";

export default function ProductCart({ productId, jwt }) {
  const dispatch = useDispatch();
  const { isCartOpen, isLoadingGetCart, quantity, isLoadingAddCart } =
    useSelector(state => state.cart);
  useCloseCartOnRouteChange();

  const handleAddToCart = () => {
    // Dispatch action to add item to cart
    dispatch(addToCart({ productId, quantity, jwt }));
    // Open the cart overlay
    dispatch(openCartOverlay());
  };

  // Combined loading states for disabling the button
  const isButtonDisabled = isLoadingGetCart || isLoadingAddCart;
  const buttonText = isButtonDisabled ? "Processing..." : "Add to cart";

  return (
    <div>
      <div className="flex items-center justify-evenly">
        <p>Select quantity:</p>
        <CartQuantity />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
      {/* <button onClick={() => dispatch(openCartOverlay())}>Open overlay</button> */}

      {isCartOpen ? <CartOverlay /> : null}
    </div>
  );
}
