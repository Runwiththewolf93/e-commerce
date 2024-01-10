/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  closeCartOverlay,
  getUserCart,
  clearErrorMessage,
} from "../../../redux/slices/cartSlice";
import { IoMdClose } from "react-icons/io";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import CartItems from "./components/CartItems";
import CartTotal from "./components/CartTotal";
import CartButtons from "./components/CartButtons";
import { Alert } from "flowbite-react";

/**
 * Renders the CartOverlay component.
 *
 * @return {JSX.Element} The rendered CartOverlay component.
 */
const CartOverlay = () => {
  const dispatch = useDispatch();
  const { isCartOpen, cart, errorAddCart } = useSelector(state => state.cart);
  // console.log("🚀 ~ file: page.js:22 ~ CartOverlay ~ isCartOpen:", isCartOpen);
  // console.log("🚀 ~ file: page.js:14 ~ CartOverlay ~ cart:", cart);
  const { data: session } = useSession();
  const closeButtonRef = useRef(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => {
    if (isCartOpen) {
      if (session?.customJwt && (!cart || Object.keys(cart).length === 0)) {
        dispatch(getUserCart({ jwt: session.customJwt }));
      }
      closeButtonRef.current?.focus();

      if (isFirstOpen) {
        setIsFirstOpen(false);
      }
    } else {
      setIsFirstOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, session?.customJwt, cart, isCartOpen]);

  const handleClose = () => {
    dispatch(closeCartOverlay());
    dispatch(clearErrorMessage());
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
                      {isFirstOpen && errorAddCart && (
                        <Alert
                          color="failure"
                          onDismiss={() => dispatch(clearErrorMessage())}
                          className="mb-3"
                          aria-live="assertive"
                        >
                          {errorAddCart}{" "}
                          <div>Please exit the modal and try again.</div>
                        </Alert>
                      )}
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            ref={closeButtonRef}
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

                      <div className="mt-6">
                        <div className="flow-root">
                          <CartItems cart={cart} session={session} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-3 py-3 sm:px-6">
                      <CartTotal cart={cart} />
                      <CartButtons handleClose={handleClose} />
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
