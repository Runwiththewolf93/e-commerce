"use client";

import React, { ReactNode } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartRedirect from "./components/CartRedirect";
import { useSession } from "next-auth/react";

interface CartLayoutProps {
  children: ReactNode;
}

/**
 * Renders the layout for the cart page.
 *
 * @param {object} props - The cart layout properties.
 * @param {ReactNode} props.children - The children components to render.
 * @return {ReactNode} The rendered cart layout.
 */
const CartLayout: React.FC<CartLayoutProps> = ({ children }) => {
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
};

export default CartLayout;
