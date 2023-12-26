"use client";

import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import OrderSummary from "./components/OrderSummary";
import { Alert } from "flowbite-react";
import { useSession } from "next-auth/react";
import {
  paymentConfirmation,
  clearOrderMessage,
  clearOrderError,
  clearSessionId,
  orderStatus,
} from "../../../redux/slices/orderSlice";
import { getUserCart } from "../../../redux/slices/cartSlice";

export default function Success() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const jwt = session?.customJwt;
  const {
    sessionId,
    isLoadingPaymentConfirmation,
    messagePaymentConfirmation,
    errorPaymentConfirmation,
    isLoadingOrderStatus,
    messageOrderStatus,
    errorOrderStatus,
  } = useSelector(state => state.order);
  const { cart } = useSelector(state => state.cart);
  const cartId = cart?._id;
  console.log("🚀 ~ file: page.js:27 ~ Success ~ cart:", cart);
  console.log("🚀 ~ file: page.js:17 ~ Success ~ sessionId:", sessionId);
  const orderRef = useRef(false);

  useEffect(() => {
    const executeDispatches = async () => {
      if (!sessionId || !cartId || !jwt) {
        return;
      }

      try {
        await Promise.all([
          dispatch(paymentConfirmation({ sessionId, cartId, jwt })).unwrap(),
          dispatch(
            orderStatus({ orderStatus: "Processed", cartId, jwt })
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
    return () => {
      dispatch(clearOrderMessage());
      dispatch(clearOrderError());
    };
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      {isError && (
        <Alert
          color="failure"
          className="text-base mb-3"
          onDismiss={() => dispatch(clearOrderError())}
        >
          {isError}
        </Alert>
      )}
      <h1 className="text-3xl font-bold text-green-800 mt-20">
        Payment Successful
      </h1>
      {isSuccess && (
        <Alert
          color="success"
          className="text-xl my-4"
          onDismiss={() => dispatch(clearOrderMessage())}
        >
          {
            "Thank you for your payment. You will receive an email confirmation shortly."
          }
        </Alert>
      )}
      <OrderSummary cartId={cartId} jwt={jwt} />
      <div className="flex flex-col xl:flex-row xl:space-x-10">
        <Link href="/" className="mb-20 mt-10">
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96"
            disabled={isLoading}
          >
            Go to Homepage
          </button>
        </Link>
        <Link href="/profile" className="mb-20 mt-10">
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96"
            disabled={isLoading}
          >
            Go to Profile
          </button>
        </Link>
      </div>
      {/* <Link
        href="/payment/order"
        className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
      >
        TESTING
      </Link>
      <button
        onClick={() =>
          dispatch(orderStatus({ orderStatus: "Processed", cartId, jwt }))
        }
      >
        getOrder
      </button> */}
    </div>
  );
}
