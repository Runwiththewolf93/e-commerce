"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../../redux/slices/cartSlice";
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
  const [errorMessage, setErrorMessage] = useState("");
  console.log("🚀 ~ file: page.js:16 ~ PreviewPage ~ cart:", cart);

  useEffect(() => {
    if (!cart || Object.keys(cart).length === 0 || !session?.customJwt) {
      dispatch(getUserCart(session?.customJwt));
    }
  }, [cart, dispatch, session?.customJwt]);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const stripe = await stripePromise;

      // Request session ID from backend
      const response = await customAxios(session?.customJwt).post(
        "/api/payment/checkout",
        { cartId: cart?._id }
      );

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      {errorGetCart && <Alert>{errorGetCart}</Alert>}
      <ConfirmationCart isLoadingGetCart={isLoadingGetCart} cart={cart} />
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <OrderPayment handleSubmit={handleSubmit} />
    </>
  );
}
