"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartRedirect from "./components/CartRedirect";
import { useSession } from "next-auth/react";

function CartLayout({ children }) {
  const { status } = useSession();

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
        {status === "authenticated" ? children : <CartRedirect />}
      </section>
      <Footer />
    </>
  );
}

export default CartLayout;
