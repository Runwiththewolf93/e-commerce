/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Alert } from "flowbite-react";
import CartSkeletonItem from "./CartSkeletonItem";
import CartQuantity from "./CartQuantity";
import { useAppDispatch } from "../../hooks/reactReduxHooks";
import {
  deleteFromCart,
  clearErrorMessage,
  getUserCart,
} from "../../../redux/slices/cartSlice";
import { CartType } from "../../../redux/types/cartSliceTypes";

interface CartItemsProps {
  cart: CartType;
  jwt: string;
  isLoadingGetCart: boolean;
  errorGetCart: string;
}

interface ErrorMap {
  [productId: string]: string;
}

/**
 * Renders the list of cart items.
 *
 * @param {CartItemsProps} {
 *   cart - The cart object containing items.
 *   jwt - The JSON Web Token for authentication.
 *   isLoadingGetCart - A flag indicating if the cart is currently being loaded.
 *   errorGetCart - The error message if there was an error loading the cart.
 * } The properties of CartItemsProps.
 * @return {JSX.Element} The JSX element containing the list of cart items.
 */
export default function CartItems({
  cart,
  jwt,
  isLoadingGetCart,
  errorGetCart,
}: CartItemsProps) {
  console.log("🚀 ~ file: CartItems.tsx:38 ~ jwt:", jwt);
  const dispatch = useAppDispatch();

  const [errorMap, setErrorMap] = useState<ErrorMap>({});
  console.log("🚀 ~ file: CartItems.tsx:37 ~ errorMap:", errorMap);

  const handleActionError = (productId: string, errorMessage: string) => {
    setErrorMap(prevErrorMap => ({
      ...prevErrorMap,
      [productId]: errorMessage,
    }));
  };

  const clearError = (productId: string) => {
    setErrorMap(prevErrorMap => {
      const newErrorMap = { ...prevErrorMap };
      delete newErrorMap[productId];
      return newErrorMap;
    });
  };

  return (
    <div className="p-6 mb-8 border bg-gray-50 dark:bg-gray-800 dark:border-gray-800">
      <div className="flex-wrap items-center hidden mb-6 -mx-4 md:flex md:mb-8">
        <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
          <h2 className="font-bold text-gray-500 dark:text-gray-400">
            Product name
          </h2>
        </div>
        <div className="hidden px-4 lg:block lg:w-2/12">
          <h2 className="font-bold text-gray-500 dark:text-gray-400">Price</h2>
        </div>
        <div className="w-auto px-4 md:w-1/6 lg:w-2/12 ">
          <h2 className="font-bold text-gray-500 dark:text-gray-400">
            Quantity
          </h2>
        </div>
        <div className="w-auto px-4 text-right md:w-1/6 lg:w-2/12 ">
          <h2 className="font-bold text-gray-500 dark:text-gray-400">
            {" "}
            Subtotal
          </h2>
        </div>
      </div>
      <div className="py-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700">
        {isLoadingGetCart ? (
          <CartSkeletonItem />
        ) : errorGetCart ? (
          <Alert
            color="failure"
            onDismiss={() => dispatch(clearErrorMessage())}
          >
            {errorGetCart}{" "}
            <div>
              Please click{" "}
              <span
                className="text-blue-600 hover:underline"
                onClick={() => dispatch(getUserCart({ jwt }))}
              >
                here
              </span>{" "}
              to reload.
            </div>
          </Alert>
        ) : (
          cart?.items?.map(item => {
            const discountedPrice = item.product.discount?.percentage
              ? item.product.price *
                (1 - item.product.discount?.percentage / 100)
              : item.product.price;

            const errorAddOrDeleteCart = errorMap[item.product._id];

            return (
              <div key={item._id}>
                {errorAddOrDeleteCart && (
                  <Alert
                    color="failure"
                    className="text-base"
                    onDismiss={() => clearError(item.product._id)}
                  >
                    {errorAddOrDeleteCart}
                  </Alert>
                )}
                <div className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                  <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                    <div className="flex flex-wrap items-center -mx-4">
                      <div className="w-full px-4 mb-3 md:w-1/3">
                        <div className="w-full h-96 md:h-24 md:w-24">
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.images[0].alt}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="w-2/3 px-4">
                        <h2 className="mb-2 text-xl font-bold dark:text-gray-400">
                          {item.product.name}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 ">
                          {item.product.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden px-4 lg:block lg:w-2/12">
                    {item.product.price &&
                    item.product.discount?.percentage > 0 ? (
                      <>
                        <p className="text-lg font-bold text-blue-500 dark:text-gray-400">
                          €{discountedPrice.toFixed(2)}
                        </p>
                        <span className="text-xs text-gray-500 line-through dark:text-gray-400">
                          €{item.product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-blue-500 dark:text-gray-400">
                        €{item.product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="w-auto px-4 md:w-1/6 lg:w-2/12 ">
                    <CartQuantity
                      cartItem={item}
                      jwt={jwt}
                      onError={(error: string) =>
                        handleActionError(item.product._id, error)
                      }
                      onClearError={() => clearError(item.product._id)}
                    />
                  </div>
                  <div className="w-auto px-4 text-right md:w-1/6 lg:w-2/12 ">
                    {item.product.price && item.product.discount?.percentage ? (
                      <div className="flex flex-col space-y-2">
                        <p className="text-lg font-bold text-blue-500 dark:text-gray-400">
                          €{(discountedPrice * item.quantity).toFixed(2)}
                        </p>
                        <button
                          type="button"
                          className="font-medium text-blue-600 hover:text-blue-500 text-end"
                          onClick={() =>
                            dispatch(
                              deleteFromCart({
                                productId: item.product._id,
                                removeCartItem: true,
                                jwt,
                              })
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <p className="text-lg font-bold text-blue-500 dark:text-gray-400">
                          €{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          type="button"
                          className="font-medium text-blue-600 hover:text-blue-500 text-end"
                          onClick={() =>
                            dispatch(
                              deleteFromCart({
                                productId: item.product._id,
                                removeCartItem: true,
                                jwt,
                              })
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
