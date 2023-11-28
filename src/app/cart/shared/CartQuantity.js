"use client";

import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import styles from "./CartQuantity.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setQuantity } from "../../../redux/slices/cartSlice";

export default function CartQuantity() {
  const dispatch = useDispatch();
  const { product } = useSelector(state => state.products);
  const { quantity } = useSelector(state => state.cart);
  console.log(
    "🚀 ~ file: CartQuantity.js:13 ~ CartQuantity ~ quantity:",
    quantity
  );

  const handleQuantityChange = newQuantity => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      dispatch(setQuantity(newQuantity));
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  return (
    <div className="flex justify-center">
      <div className="custom-number-input h-10 w-32 mb-3">
        <label
          htmlFor="custom-input-number"
          className="w-full text-gray-700 text-sm font-semibold sr-only"
        >
          Counter Input
        </label>
        <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
          <button
            onClick={decrementQuantity}
            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer"
            disabled={quantity === 1}
          >
            <HiMinusSm className="mx-auto" />
          </button>
          <input
            type="number"
            className={`outline-none focus:outline-none text-center w-full bg-gray-100 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 border-none ${styles["quantity-input"]}`}
            value={quantity}
            name="custom-input-number"
            onChange={e => handleQuantityChange(parseInt(e.target.value, 10))}
            min="1"
            max={product.stock}
          />
          <button
            onClick={incrementQuantity}
            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
            disabled={quantity === product.stock}
          >
            <HiPlusSm className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
