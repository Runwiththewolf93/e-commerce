"use client";

import { useCallback } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import styles from "./CartQuantity.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/reactReduxHooks";
import {
  setQuantity,
  addToCart,
  deleteFromCart,
} from "../../../redux/slices/cartSlice";
import { ProductType } from "../../../redux/types/cartSliceTypes";
import { isRejectedWithValue } from "@reduxjs/toolkit";

interface CartQuantityProps {
  productFromProp?: ProductType;
  quantityFromProp?: number;
  jwt: string;
  onError?: (message: string) => void;
  onClearError?: () => void;
}

/**
 * Renders a component that displays the quantity of a product in a cart.
 *
 * @param {Object} productFromProp - The product object passed as a prop.
 * @param {number} quantityFromProp - The quantity of the product passed as a prop.
 * @param {string} jwt - The JSON Web Token.
 * @param {Function} onError - The callback function to handle errors.
 * @param {Function} onClearError - The callback function to clear error messages.
 * @return {JSX.Element} The rendered component.
 */
export default function CartQuantity({
  productFromProp,
  quantityFromProp,
  jwt,
  onError,
  onClearError,
}: CartQuantityProps) {
  const dispatch = useAppDispatch();
  const { product: productFromState } = useAppSelector(state => state.products);
  // console.log(
  //   "🚀 ~ file: CartQuantity.js:12 ~ CartQuantity ~ product:",
  //   product
  // );
  const {
    quantity: quantityFromState,
    isLoadingAddCart,
    isLoadingDeleteCart,
  } = useAppSelector(state => state.cart);

  // console.log(
  //   "🚀 ~ file: CartQuantity.js:13 ~ CartQuantity ~ quantity:",
  //   quantity
  // );

  // Decide whether to use props or state
  const product = productFromProp || productFromState;
  const quantity =
    quantityFromProp !== undefined ? quantityFromProp : quantityFromState;

  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity > 0 && newQuantity <= product.stock) {
        if (productFromProp) {
          // Product from props, use addToCart or deleteFromCart
          try {
            const actionResult =
              newQuantity > quantity
                ? await dispatch(
                    addToCart({
                      productId: product._id,
                      quantity: newQuantity - quantity,
                      jwt,
                    })
                  )
                : await dispatch(
                    deleteFromCart({
                      productId: product._id,
                      quantity: quantity - newQuantity,
                      jwt,
                    })
                  );

            if (isRejectedWithValue(actionResult)) {
              throw new Error(actionResult.payload as string);
            }

            // Clearing the error on success
            onClearError();
          } catch (error) {
            onError(error.message);
          }
        } else {
          // Product from state, use setQuantity
          dispatch(setQuantity(newQuantity));
        }
      }
    },
    [product, quantity, productFromProp, jwt, dispatch, onError, onClearError]
  );

  const incrementQuantity = useCallback(() => {
    handleQuantityChange(quantity + 1);
  }, [quantity, handleQuantityChange]);

  const decrementQuantity = useCallback(() => {
    handleQuantityChange(quantity - 1);
  }, [quantity, handleQuantityChange]);

  return (
    <div className="flex justify-center">
      <div
        className={`custom-number-input h-10 w-32 ${
          productFromProp ? "mb-1" : "mb-3"
        }`}
      >
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
            disabled={quantity === 1 || isLoadingAddCart || isLoadingDeleteCart}
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
            disabled
          />
          <button
            onClick={incrementQuantity}
            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
            disabled={
              quantity === product.stock ||
              isLoadingAddCart ||
              isLoadingDeleteCart
            }
          >
            <HiPlusSm className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
