"use client";

import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import styles from "./ProductCart.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, openCartOverlay } from "../../../redux/slices/cartSlice";
import CartOverlay from "../../cart/overlay/page";

export default function ProductCart({ product, jwt }) {
  const dispatch = useDispatch();
  const { isCartOpen, isLoadingGetCart } = useSelector(state => state.cart);

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = newQuantity => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Dispatch action to add item to cart
    dispatch(addToCart({ productId: product._id, quantity, jwt }));
    // Open the cart overlay
    dispatch(openCartOverlay());
  };

  return (
    <div>
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
        onClick={handleAddToCart}
        disabled={isLoadingGetCart}
      >
        {isLoadingGetCart ? "Adding..." : "Add to cart"}
      </button>

      {isCartOpen ? <CartOverlay /> : null}
    </div>
  );
}
