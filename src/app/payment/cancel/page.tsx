"use client";

import { useEffect } from "react";
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
import { useRouter, usePathname } from "next/navigation";
import RedirectingIndicator from "./components/RedirectingIndicator";
import { PaymentStates } from "../../../redux/types/orderSliceTypes";

/**
 * Renders the Cancel component.
 *
 * @return {JSX.Element} The rendered Cancel component.
 */
export default function Cancel() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  console.log("🚀 ~ file: page.tsx:29 ~ Cancel ~ pathname:", pathname);
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
  console.log("🚀 ~ file: page.tsx:38 ~ Cancel ~ paymentState:", paymentState);
  const cartId = cart?._id;
  console.log("🚀 ~ file: page.js:27 ~ Success ~ cart:", cart);
  const currentPath = "/payment/cancel";

  useEffect(() => {
    // At least I tried to reset the state here, but it didn't work
    if (pathname !== currentPath) {
      dispatch(setIsPaymentProcessed(PaymentStates.NONE));
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    if (
      paymentState === PaymentStates.SUCCESSFUL ||
      paymentState === PaymentStates.NONE
    ) {
      router.push("/payment/order");
    } else {
      dispatch(setIsPaymentProcessed(PaymentStates.CANCELLED));
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
  }, [sessionId, cartId, jwt, dispatch]);

  const isLoading = isLoadingPaymentConfirmation || isLoadingOrderStatus;
  const isSuccess = messagePaymentConfirmation && messageOrderStatus;
  const isError = errorPaymentConfirmation || errorOrderStatus;

  if (
    paymentState === PaymentStates.SUCCESSFUL ||
    paymentState === PaymentStates.NONE
  ) {
    return <RedirectingIndicator />;
  }

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
            onClick={() => dispatch(setIsPaymentProcessed(PaymentStates.NONE))}
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
            onClick={() => dispatch(setIsPaymentProcessed(PaymentStates.NONE))}
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
