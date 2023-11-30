/* eslint-disable @next/next/no-img-element */
import CartSkeletonItem from "./CartSkeletonItem";
import { Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import CartQuantity from "../../shared/CartQuantity";
import {
  clearErrorMessage,
  deleteFromCart,
} from "../../../../redux/slices/cartSlice";
import { categoryToLink } from "../../../../../utils/helper";

export default function CartItem({ cart, session }) {
  const dispatch = useDispatch();
  const { isLoadingGetCart, errorGetCart, errorAddCart, errorDeleteCart } =
    useSelector(state => state.cart);

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

          return (
            <div key={item._id}>
              {errorDeleteCart ||
                (errorAddCart && (
                  <Alert
                    color="failure"
                    className="-mb-5"
                    onDismiss={() => dispatch(clearErrorMessage())}
                  >
                    {errorDeleteCart || errorAddCart}
                  </Alert>
                ))}
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
                    />
                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
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
