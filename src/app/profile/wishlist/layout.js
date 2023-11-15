import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Wishlist from "./page";

export default async function WishlistLayout() {
  const session = await getServerSession(authOptions);
  // const session = false;

  return (
    <>
      <Header />
      {session ? (
        <section className="min-h-screen">
          <Wishlist session={session} />
        </section>
      ) : (
        <div className="text-center py-10 min-h-screen text-2xl font-bold">
          <p>Please log in to view your wishlist.</p>
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Log in
          </a>{" "}
          or
          <a href="/register" className="text-blue-500 hover:text-blue-700">
            {" "}
            Register
          </a>
        </div>
      )}
      <Footer />
    </>
  );
}

// create route to fetch wishlist from db
