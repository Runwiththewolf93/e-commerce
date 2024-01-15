"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PaymentRedirect from "./components/PaymentRedirect";
import { useCustomSession } from "../hooks/useCustomSession";
import { useAppSelector } from "../hooks/reactReduxHooks";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface PaymentLayoutProps {
  children: ReactNode;
}

/**
 * Renders the payment layout component.
 *
 * @param {object} children - The child components to be rendered.
 * @return {JSX.Element} The rendered payment layout component.
 */
function PaymentLayout({ children }: PaymentLayoutProps) {
  const { status } = useCustomSession();
  const router = useRouter();
  const { cart } = useAppSelector(state => state.cart);

  const isCartEmpty = !cart.items && cart.items.length === 0;

  useEffect(() => {
    if (status === "authenticated" && isCartEmpty) {
      router.push("/");
    }
  }, [status, isCartEmpty, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen">
        {status === "authenticated" && !isCartEmpty ? (
          children
        ) : (
          <PaymentRedirect isCartEmpty={isCartEmpty} />
        )}
      </section>
      <Footer />
    </>
  );
}

export default PaymentLayout;
