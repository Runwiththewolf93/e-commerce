"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  openCartOverlay,
} from "../../../../../redux/slices/cartSlice";
import CartOverlay from "../../../../cart/overlay/page";
import CartQuantity from "../../../../cart/shared/CartQuantity";
import { useCloseCartOnRouteChange } from "../../../../hooks/useCloseCartOnRouteChange";

/**
 * Renders a product cart component.
 *
 * @param {Object} props - The props object.
 * @param {string} props.productId - The ID of the product.
 * @param {string} props.jwt - The JSON Web Token.
 * @return {JSX.Element} The rendered product cart component.
 */
export default function ProductCart({ productId, jwt }) {
  const dispatch = useDispatch();
  const { isCartOpen, quantity, isLoadingGetCart, isLoadingAddCart } =
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
        <CartQuantity jwt={jwt} />
      </div>
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
      >
        {buttonText}
      </button>

      <button
        onClick={() => dispatch(openCartOverlay())}
        className="block mx-auto mt-3"
      >
        Open overlay
      </button>

      {isCartOpen ? <CartOverlay /> : null}
    </div>
  );
}
