"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reactReduxHooks";
import Link from "next/link";
import OrderSummary from "./components/OrderSummary";
import { Alert } from "flowbite-react";
import { useCustomSession } from "@/app/hooks/useCustomSession";
import {
  paymentConfirmation,
  clearOrderMessage,
  clearOrderError,
  clearSessionId,
  orderStatus,
  setIsPaymentProcessed,
} from "../../../redux/slices/orderSlice";
import { useRouter, usePathname } from "next/navigation";
import RedirectingIndicator from "../cancel/components/RedirectingIndicator";
import { PaymentStates } from "../../../redux/types/orderSliceTypes";

/**
 * Renders the Success component.
 *
 * @return {JSX.Element} The rendered Success component.
 */
export default function Success() {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
    paymentState,
  } = useAppSelector(state => state.order);
  const { cart } = useAppSelector(state => state.cart);
  const cartId = cart?._id;
  const pathname = usePathname();
  const currentPath = "/payment/success";
  console.log("🚀 ~ file: page.js:34 ~ Success ~ paymentState:", paymentState);
  console.log("🚀 ~ file: page.js:27 ~ Success ~ cart:", cart);

  useEffect(() => {
    // At least I tried to reset the state here, but it didn't work
    if (pathname !== currentPath) {
      dispatch(setIsPaymentProcessed(PaymentStates.NONE));
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    if (
      paymentState === PaymentStates.CANCELLED ||
      paymentState === PaymentStates.NONE
    ) {
      router.push("/payment/order");
    } else {
      dispatch(setIsPaymentProcessed(PaymentStates.SUCCESSFUL));
    }
  }, [dispatch, paymentState, router]);

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
  }, [sessionId, cartId, jwt, dispatch]);

  const isLoading = isLoadingPaymentConfirmation || isLoadingOrderStatus;
  const isSuccess = messagePaymentConfirmation && messageOrderStatus;
  const isError = errorPaymentConfirmation || errorOrderStatus;

  if (
    paymentState === PaymentStates.CANCELLED ||
    paymentState === PaymentStates.NONE
  ) {
    return <RedirectingIndicator />;
  }

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
            onClick={() => dispatch(setIsPaymentProcessed(PaymentStates.NONE))}
          >
            Go to Homepage
          </button>
        </Link>
        <Link href="/profile" className="mb-20 mt-10">
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg font-medium leading-4 text-white min-w-96"
            disabled={isLoading}
            onClick={() => dispatch(setIsPaymentProcessed(PaymentStates.NONE))}
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
