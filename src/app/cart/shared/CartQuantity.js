"use client";

import { useCallback } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import styles from "./CartQuantity.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuantity,
  addToCart,
  deleteFromCart,
} from "../../../redux/slices/cartSlice";

export default function CartQuantity({
  productFromProp,
  quantityFromProp,
  jwt,
  onError,
  onClearError,
}) {
  const dispatch = useDispatch();
  const { product: productFromState } = useSelector(state => state.products);
  // console.log(
  //   "🚀 ~ file: CartQuantity.js:12 ~ CartQuantity ~ product:",
  //   product
  // );
  const {
    quantity: quantityFromState,
    isLoadingAddCart,
    isLoadingDeleteCart,
  } = useSelector(state => state.cart);
  // console.log(
  //   "🚀 ~ file: CartQuantity.js:13 ~ CartQuantity ~ quantity:",
  //   quantity
  // );

  // Decide whether to use props or state
  const product = productFromProp || productFromState;
  const quantity =
    quantityFromProp !== undefined ? quantityFromProp : quantityFromState;

  const handleQuantityChange = useCallback(
    async newQuantity => {
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

            if (actionResult?.error) {
              // console.log(
              //   "🚀 ~ file: CartQuantity.js:63 ~ handleQuantityChange ~ actionResult:",
              //   actionResult
              // );
              throw new Error(
                actionResult?.payload || "Error in cart operation"
              );
            }

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
