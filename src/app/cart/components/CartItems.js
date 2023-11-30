/* eslint-disable @next/next/no-img-element */
import { useSelector } from "react-redux";
import { Alert } from "flowbite-react";
import CartSkeletonItem from "./CartSkeletonItem";
import CartQuantity from "./CartQuantity";

export default function CartItems({ cart, jwt }) {
  const { isLoadingGetCart, errorGetCart } = useSelector(state => state.cart);

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
          <Alert>{errorGetCart}</Alert>
        ) : (
          cart?.items?.map(item => {
            const discountedPrice = item.product.discount?.percentage
              ? item.product.price *
                (1 - item.product.discount?.percentage / 100)
              : item.product.price;

            return (
              <div
                key={item._id}
                className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8"
              >
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
                  <CartQuantity cartItem={item} jwt={jwt} />
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
                              jwt: session?.customJwt,
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
                              jwt: session?.customJwt,
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
            );
          })
        )}
      </div>
    </div>
  );
}
