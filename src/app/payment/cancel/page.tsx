"use client";

import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reactReduxHooks";
import Link from "next/link";
import { Alert } from "flowbite-react";
import { useCustomSession } from "../../hooks/useCustomSession";
import {
  paymentConfirmation,
  clearOrderMessage,
  clearOrderError,
  clearSessionId,
  orderStatus,
  setIsPaymentProcessed,
} from "../../../redux/slices/orderSlice";
import { useRouter } from "next/navigation";

/**
 * Renders the Cancel component.
 *
 * @return {JSX.Element} The rendered Cancel component.
 */
export default function Cancel() {
  const dispatch = useAppDispatch();
  const { data: session } = useCustomSession();
  const jwt = session?.customJwt;
  const {
    sessionId,
    isLoadingPaymentConfirmation,
    messagePaymentConfirmation,
    errorPaymentConfirmation,
    isLoadingOrderStatus,
    messageOrderStatus,
    errorOrderStatus,
    isPaymentProcessed,
  } = useAppSelector(state => state.order);
  const router = useRouter();
  console.log(
    "🚀 ~ file: page.js:29 ~ Cancel ~ messagePaymentConfirmation:",
    messagePaymentConfirmation
  );
  console.log(
    "🚀 ~ file: page.js:29 ~ Cancel ~ messageOrderStatus:",
    messageOrderStatus
  );
  const { cart } = useAppSelector(state => state.cart);
  const cartId = cart?._id;
  console.log("🚀 ~ file: page.js:27 ~ Success ~ cart:", cart);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!isPaymentProcessed) {
        router.push("/payment/order");
      } else {
        // Reset isPaymentProcessed to false for future payment attempts
        dispatch(setIsPaymentProcessed(false));
      }
    }
  }, [isPaymentProcessed, router, dispatch]);

  useEffect(() => {
    const executeDispatches = async () => {
      if (!sessionId || !cartId || !jwt) {
        return;
      }

      try {
        await Promise.all([
          dispatch(paymentConfirmation({ sessionId, cartId, jwt })).unwrap(),
          dispatch(
            orderStatus({ orderStatus: "Cancelled", cartId, jwt })
          ).unwrap(),
        ]);

        // Clear error and sessionID on successful completion of both dispatches
        dispatch(clearOrderError());
        dispatch(clearSessionId());
      } catch (error) {
        console.error("Error in one of the dispatches:", error);
        // Handle error (e.g., show an alert or notification)
      }
    };

    executeDispatches();

    // Cleanup functions
    // return () => {
    //   dispatch(clearOrderMessage());
    //   dispatch(clearOrderError());
    // };
  }, [
    sessionId,
    cartId,
    jwt,
    dispatch,
    errorPaymentConfirmation,
    errorOrderStatus,
  ]);

  const isLoading = isLoadingPaymentConfirmation || isLoadingOrderStatus;
  const isSuccess = messagePaymentConfirmation && messageOrderStatus;
  const isError = errorPaymentConfirmation || errorOrderStatus;

  // IMPLEMENT REDIRECTING... WHEN ISPAYMENTPROCESSED IS FALSE - SO USERS DON'T SEE THE COMPONENT AT ALL.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      {isError && (
        <Alert
          color="failure"
          className="text-base mb-3"
          onDismiss={() => dispatch(clearOrderError())}
        >
          {isError}
        </Alert>
      )}
      <h1 className="text-3xl font-bold text-red-800">Payment Canceled</h1>
      {isSuccess && (
        <Alert
          color="failure"
          className="text-xl my-4"
          onDismiss={() => dispatch(clearOrderMessage())}
        >
          {
            "Your payment process was not completed. You may have cancelled the payment, or an issue might have occurred during the transaction."
          }
        </Alert>
      )}
      <div className="flex flex-col xl:flex-row xl:space-x-10">
        <Link href="/payment/order" className="mb-10 mt-10">
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96"
            disabled={isLoading}
          >
            Try Payment Again
          </button>
        </Link>
        <Link href="/contact" className="mb-10 mt-10">
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96 cursor-not-allowed"
            disabled
          >
            Contact Support
          </button>
        </Link>
        <Link href="/" className="mb-10 mt-10">
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96"
            disabled={isLoading}
          >
            Continue Shopping
          </button>
        </Link>
      </div>
      {/* <Link href="/" className="mb-10 mt-10">
        <button
          className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96"
          disabled={isLoading}
          onClick={() =>
            dispatch(orderStatus({ orderStatus: "Cancelled", cartId, jwt }))
          }
        >
          Testing orderStatus route
        </button>
      </Link> */}
    </div>
  );
}
