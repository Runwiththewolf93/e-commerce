"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCustomSession } from "../../hooks/useCustomSession";
import { useAppDispatch, useAppSelector } from "../../hooks/reactReduxHooks";
import {
  getUserCart,
  clearErrorMessage,
} from "../../../redux/slices/cartSlice";
import {
  orderCart,
  clearOrderMessage,
  clearOrderError,
  paymentCheckout,
  setIsPaymentProcessed,
} from "../../../redux/slices/orderSlice";
import OrderPayment from "./components/OrderPayment";
import { Alert } from "flowbite-react";
import ConfirmationCart from "./components/ConfirmationCart";
import { PaymentCheckoutResponse } from "@/redux/types/orderSliceTypes";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

/**
 * Renders the preview page.
 *
 * @return {void} This function does not return a value.
 */
export default function PreviewPage() {
  const dispatch = useAppDispatch();
  const { data: session } = useCustomSession();
  const { isLoadingGetCart, cart, errorGetCart } = useAppSelector(
    state => state.cart
  );
  const {
    isLoadingOrderCart,
    messageOrderCart,
    errorOrderCart,
    isLoadingPaymentCheckout,
    sessionId,
    errorPaymentCheckout,
  } = useAppSelector(state => state.order);
  const [errorMessage, setErrorMessage] = useState("");
  console.log("🚀 ~ file: page.js:16 ~ PreviewPage ~ cart:", cart);

  useEffect(() => {
    if ((!cart || Object.keys(cart).length === 0) && session?.customJwt) {
      dispatch(getUserCart({ jwt: session?.customJwt }));
    }

    return () => {
      dispatch(clearOrderMessage());
      dispatch(clearOrderError());
    };
  }, [cart, dispatch, session?.customJwt]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    function isErrorResponse(
      action: any
    ): action is { error: { message: string } } {
      return action.error !== undefined;
    }

    function isSuccessResponse(
      action: any
    ): action is { payload: PaymentCheckoutResponse } {
      return action.payload && "sessionId" in action.payload;
    }

    try {
      // Update the order
      const orderUpdateResponse = await dispatch(
        orderCart({ cartObject: cart, jwt: session?.customJwt })
      );
      if (isErrorResponse(orderUpdateResponse)) {
        setErrorMessage(
          orderUpdateResponse.error.message || "Error updating order"
        );
        return;
      }

      // Request session ID from Stripe Checkout
      const checkoutResponse = await dispatch(
        paymentCheckout({ cartId: cart?._id, jwt: session?.customJwt })
      );
      if (isErrorResponse(checkoutResponse)) {
        setErrorMessage(
          checkoutResponse.error.message || "Error requesting session ID"
        );
        return;
      }
      if (!isSuccessResponse(checkoutResponse)) {
        // Handle case where checkoutResponse is not a success response
        setErrorMessage("Failed to process payment checkout.");
        return;
      }

      // Continue with Stripe payment if order update is successful
      const stripe = await stripePromise;
      const sessionId = checkoutResponse.payload.sessionId;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setErrorMessage(result.error.message);
      }

      dispatch(setIsPaymentProcessed(true));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const displayedError = errorMessage || errorOrderCart || errorPaymentCheckout;

  return (
    <>
      {errorGetCart && (
        <Alert
          color="failure"
          className="w-2/3 mx-auto mt-6 text-base max-w-fit"
          onDismiss={() => dispatch(clearErrorMessage())}
        >
          {errorGetCart}
        </Alert>
      )}
      <ConfirmationCart isLoadingGetCart={isLoadingGetCart} cart={cart} />
      {displayedError && (
        <Alert
          className="w-2/3 mx-auto mb-3 text-base"
          onDismiss={() => {
            setErrorMessage("");
            dispatch(clearOrderError());
          }}
          color="failure"
        >
          {displayedError}
        </Alert>
      )}
      <OrderPayment
        handleSubmit={handleSubmit}
        isLoadingOrderCart={isLoadingOrderCart}
        messageOrderCart={messageOrderCart}
        isLoadingPaymentCheckout={isLoadingPaymentCheckout}
        sessionId={sessionId}
      />
    </>
  );
}
