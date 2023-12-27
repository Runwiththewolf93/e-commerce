"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCart,
  clearErrorMessage,
} from "../../../redux/slices/cartSlice";
import {
  orderCart,
  clearOrderMessage,
  clearOrderError,
  paymentCheckout,
} from "../../../redux/slices/orderSlice";
import OrderPayment from "./components/OrderPayment";
import { Alert } from "flowbite-react";
import ConfirmationCart from "./components/ConfirmationCart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PreviewPage() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { isLoadingGetCart, cart, errorGetCart } = useSelector(
    state => state.cart
  );
  const {
    isLoadingOrderCart,
    messageOrderCart,
    errorOrderCart,
    isLoadingPaymentCheckout,
    sessionId,
    errorPaymentCheckout,
  } = useSelector(state => state.order);
  const [errorMessage, setErrorMessage] = useState("");
  console.log("🚀 ~ file: page.js:16 ~ PreviewPage ~ cart:", cart);

  useEffect(() => {
    if ((!cart || Object.keys(cart).length === 0) && session?.customJwt) {
      dispatch(getUserCart(session?.customJwt));
    }

    return () => {
      dispatch(clearOrderMessage());
      dispatch(clearOrderError());
    };
  }, [cart, dispatch, session?.customJwt]);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Update the order
      const orderUpdateResponse = await dispatch(
        orderCart({ cartObject: cart, jwt: session?.customJwt })
      );
      if (orderUpdateResponse.error) {
        setErrorMessage(
          orderUpdateResponse.error.message || "Error updating order"
        );
        return;
      }

      // Request session ID from Stripe Checkout
      const checkoutResponse = await dispatch(
        paymentCheckout({ cartId: cart?._id, jwt: session?.customJwt })
      );
      if (checkoutResponse.error) {
        setErrorMessage(
          checkoutResponse.error.message || "Error requesting session ID"
        );
        return;
      }

      console.log("Checkout Response Payload:", checkoutResponse.payload);
      console.log("Session ID:", checkoutResponse.payload.sessionId);

      // Continue with Stripe payment if order update is successful
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutResponse.payload.sessionId,
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      }
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
