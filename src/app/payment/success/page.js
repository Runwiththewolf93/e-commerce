"use client";

import { useEffect } from "react";
import Link from "next/link";
import customAxios from "../../../lib/api";
import OrderSummary from "./components/OrderSummary";

export default function Success() {
  useEffect(() => {
    async function confirmPayment() {
      // This is bullshit, compare with checkout page - IMPORTANT - THE APPENDED QUERY PARAMS ARE DIFFERENT
      const query = new URLSearchParams(window.location.search);
      const sessionId = query.get("session_id");

      if (sessionId) {
        try {
          // Send request to backend to confirm and record the payment
          await customAxios.post("/api/payment/confirmation", { sessionId });
          console.log("Payment recorded successfully.");
        } catch (error) {
          console.error("Error recording payment: ", error);
        }
      }
    }

    confirmPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-800">Payment Successful</h1>
      <p className="my-4 text-xl">Your payment was processed successfully.</p>
      <Link
        href="/"
        className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
