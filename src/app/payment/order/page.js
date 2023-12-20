"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCart,
  clearErrorMessage,
} from "../../../redux/slices/cartSlice";
import { orderCart } from "../../../redux/slices/orderSlice";
import OrderPayment from "./components/OrderPayment";
import customAxios from "../../../lib/api";
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
  const { isLoadingOrderCart, messageOrderCart, errorOrderCart } = useSelector(
    state => state.order
  );
  const [errorMessage, setErrorMessage] = useState("");
  console.log("🚀 ~ file: page.js:16 ~ PreviewPage ~ cart:", cart);

  useEffect(() => {
    if ((!cart || Object.keys(cart).length === 0) && session?.customJwt) {
      dispatch(getUserCart(session?.customJwt));
    }
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

      // // Continue with Stripe payment if order update is successful
      // const stripe = await stripePromise;

      // // Request session ID from backend
      // const response = await customAxios(session?.customJwt).post(
      //   "/api/payment/checkout",
      //   { cartId: cart?._id }
      // );

      // // Redirect to Stripe Checkout
      // const result = await stripe.redirectToCheckout({
      //   sessionId: response.data.sessionId,
      // });

      // if (result.error) {
      //   setErrorMessage(result.error.message);
      // }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

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
      {errorMessage && (
        <Alert
          className="w-2/3 mx-auto mb-3"
          onDismiss={() => setErrorMessage("")}
          color="failure"
        >
          {errorMessage}
        </Alert>
      )}
      <OrderPayment handleSubmit={handleSubmit} />
    </>
  );
}
