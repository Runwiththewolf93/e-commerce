/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserCart } from "../../redux/slices/cartSlice";
import CartItems from "../cart/components/CartItems";
import CartCoupon from "../cart/components/CartCoupon";
import CartOrder from "../cart/components/CartOrder";
import { useSession } from "next-auth/react";

export default function Cart() {
  const dispatch = useDispatch();
  const { isLoadingGetCart, cart, errorGetCart } = useSelector(
    state => state.cart
  );
  console.log("🚀 ~ file: page.js:15 ~ Cart ~ cart:", cart);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.customJwt && (!cart || Object.keys(cart).length === 0)) {
      dispatch(getUserCart(session.customJwt));
    }
  }, [dispatch, session?.customJwt, cart]);

  return (
    <section className="py-24 bg-gray-100 font-poppins dark:bg-gray-700">
      <div className="px-4 py-6 mx-auto max-w-7xl lg:py-4 md:px-6">
        <div>
          <h2 className="mb-8 text-4xl font-bold dark:text-gray-400">
            Your Cart
          </h2>
          <CartItems cart={cart} jwt={session?.customJwt} />
          <div className="flex flex-wrap justify-between">
            <CartCoupon />
            <CartOrder />
          </div>
        </div>
      </div>
    </section>
  );
}
