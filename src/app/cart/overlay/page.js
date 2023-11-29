/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  closeCartOverlay,
  getUserCart,
  deleteFromCart,
} from "../../../redux/slices/cartSlice";
import { IoMdClose } from "react-icons/io";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { categoryToLink } from "../../../../utils/helper";
import CartSkeletonItem from "./components/CartSkeletonItem";
import { Alert } from "flowbite-react";
import CartQuantity from "../shared/CartQuantity";

const CartOverlay = () => {
  const dispatch = useDispatch();
  const { isCartOpen, isLoadingGetCart, cart, errorGetCart } = useSelector(
    state => state.cart
  );
  console.log("🚀 ~ file: page.js:14 ~ CartOverlay ~ cart:", cart);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.customJwt && (!cart || Object.keys(cart).length === 0)) {
      dispatch(getUserCart(session.customJwt));
    }
  }, [dispatch, session?.customJwt, cart]);

  const handleClose = () => {
    dispatch(closeCartOverlay());
  };

  if (!isCartOpen) return null;

  return (
    <Transition.Root show={isCartOpen} as={Fragment} className="z-50">
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <IoMdClose className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {isLoadingGetCart ? (
                              <CartSkeletonItem /> ? (
                                errorGetCart
                              ) : (
                                <Alert color="failure">{errorGetCart}</Alert>
                              )
                            ) : (
                              cart.items?.map(item => (
                                <li key={item._id} className="flex py-6">
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
                                        <p className="ml-4">
                                          €{item.product.price}
                                        </p>
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
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="flex flex-col">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${cart.totalAmount}</p>
                        </div>
                        <div className="h-0.5 bg-slate-800"></div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p className="font-bold">Total with discount</p>
                          <p className="font-bold">
                            ${cart.totalAmountDiscount}
                          </p>
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-5 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                            onClick={handleClose}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartOverlay;
