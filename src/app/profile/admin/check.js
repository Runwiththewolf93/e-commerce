"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AddProduct from "./addProduct";
import EditProduct from "./editProduct";
import DeleteProduct from "./deleteProduct";
import AddCoupon from "./coupon/AddCoupon";
import DeleteCoupon from "./coupon/DeleteCoupon";
import { checkAdmin } from "../../../redux/slices/userSlice";
import { useSession } from "next-auth/react";

export default function AdminCheck() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoadingCheckAdmin, isAdmin, errorCheckAdmin } = useSelector(
    state => state.user
  );
  const { data: session } = useSession();
  const jwt = session?.customJwt;

  // Directly dispatch checkAdmin action if jwt exists
  useEffect(() => {
    if (jwt) {
      dispatch(checkAdmin({ jwt }));
    }
  }, [jwt, dispatch]);

  // Redirection if not admin and on a specific route
  useEffect(() => {
    let timeout;
    if (isAdmin === false) {
      timeout = setTimeout(() => router.push("/"), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isAdmin, router]);

  if (isLoadingCheckAdmin) {
    return (
      <div className="bg-blue-400 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (errorCheckAdmin) {
    return (
      <div className="bg-blue-400 min-h-screen flex justify-center items-center">
        <div className="text-center p-4 mb-4 text-2xl font-bold text-red-800 bg-red-100 rounded-lg">
          {errorCheckAdmin}
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="bg-blue-400 min-h-screen flex justify-center items-center">
        <div className="text-center text-4xl font-bold text-red-800">
          <p>You do not have admin privileges.</p>
          <p className="text-2xl">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-blue-400 min-h-screen">
      <p className="text-4xl font-bold text-center pt-10">
        Welcome back, {session?.user?.name}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        <AddProduct token={jwt} />
        <EditProduct token={jwt} />
        <DeleteProduct token={jwt} />
      </div>
      <div className="divider"></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        <AddCoupon token={jwt} />
        <DeleteCoupon token={jwt} />
      </div>
    </section>
  );
}
