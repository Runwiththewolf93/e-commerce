/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import CartSkeletonItem from "./CartSkeletonItem";
import { Alert } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reactReduxHooks";
import Link from "next/link";
import CartQuantity from "../../shared/CartQuantity";
import { deleteFromCart } from "../../../../redux/slices/cartSlice";
import { categoryToLink } from "../../../../../utils/helper";
import { CartType } from "../../../../redux/types/cartSliceTypes";
import { CustomSession } from "../../../types/authentication/authenticationTypes";

interface CartItemProps {
  cart: CartType;
  session: CustomSession;
}

interface ErrorMap {
  [productId: string]: string;
}

interface LoadingMap {
  [productId: string]: boolean;
}

/**
 * Renders a single item in the cart.
 *
 * @param {object} cart - The cart object containing cart items.
 * @param {object} session - The session object containing user session data.
 * @return {JSX.Element} The rendered cart item.
 */
export default function CartItem({ cart, session }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { isLoadingGetCart, errorGetCart } = useAppSelector(
    state => state.cart
  );
  const [errorMap, setErrorMap] = useState<ErrorMap>({});
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});

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

  const resetLoading = (productId: string) => {
    setLoadingMap(prev => ({ ...prev, [productId]: false }));
  };

  const handleRemoveItem = useCallback(
    async (productId: string) => {
      setLoadingMap(prev => ({ ...prev, [productId]: true }));

      // Simulate an error for testing purposes
      // const mockError = "This is a simulated error message.";
      // handleActionError(productId, mockError);
      // resetLoading(productId);

      try {
        // Await the completion of the deleteFromCart thunk
        await dispatch(
          deleteFromCart({
            productId,
            removeCartItem: true,
            jwt: session?.customJwt,
          })
        ).unwrap();

        // Clear error on successful dispatch
        clearError(productId);
      } catch (error) {
        handleActionError(productId, error);
      } finally {
        resetLoading(productId);
      }
    },
    [dispatch, session?.customJwt]
  );

  return (
    <ul role="list" className="-my-6 divide-y divide-gray-200">
      {isLoadingGetCart ? (
        <CartSkeletonItem />
      ) : errorGetCart ? (
        <Alert color="failure">{errorGetCart}</Alert>
      ) : (
        cart.items?.map(item => {
          const price = item.product.discount?.percentage
            ? item.product.price * (1 - item.product.discount.percentage / 100)
            : item.product.price;

          const errorAddOrDeleteCart = errorMap[item.product._id];
          const isLoading = loadingMap[item.product._id] || false;

          // console.log("item.product", item.product);

          return (
            <div key={item._id}>
              {errorAddOrDeleteCart && (
                <Alert
                  color="failure"
                  className="-mb-5"
                  onDismiss={() => clearError(item.product._id)}
                >
                  {errorAddOrDeleteCart}
                </Alert>
              )}
              <li className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.images[0].alt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="text-indigo-600 hover:text-indigo-800 hover:underline">
                        <Link
                          href={`/categories/${categoryToLink(
                            item.product.category
                          )}/${item.product._id}`}
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="ml-4">€{price}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <CartQuantity
                      productFromProp={item.product}
                      quantityFromProp={item.quantity}
                      jwt={session?.customJwt}
                      onError={(error: string) =>
                        handleActionError(item.product._id, error)
                      }
                      onClearError={() => clearError(item.product._id)}
                    />
                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        disabled={isLoading}
                        onClick={() => handleRemoveItem(item.product._id)}
                      >
                        {isLoading ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          );
        })
      )}
    </ul>
  );
}
