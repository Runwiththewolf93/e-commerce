"use client";

import { useState, useEffect } from "react";
import customAxios from "../../../lib/api";
import { useRouter, usePathname } from "next/navigation";
import AddProduct from "./addProduct";
import EditProduct from "./editProduct";
import DeleteProduct from "./deleteProduct";

export default function AdminCheck({ session }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    customAxios(session?.customJwt)
      .get("/api/users/checkAdmin")
      .then(res => setIsAdmin(res.data.isAdmin))
      .catch(err => {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMessage);
      });

    if (pathname === "/profile/admin" && isAdmin === false) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  return (
    <section className="bg-blue-400 min-h-screen">
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center w-1/2 mx-auto"
          role="alert"
        >
          <span className="font-medium text-2xl">{error}</span>
        </div>
      )}
      {isAdmin !== null && (
        <div>
          {isAdmin ? (
            <>
              <p className="text-4xl font-bold text-center pt-10">
                Welcome back, {session.user.name}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                <AddProduct token={session.customJwt} />
                <EditProduct token={session.customJwt} />
                <DeleteProduct token={session.customJwt} />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-4xl font-bold text-red-500">
                You do not have admin privileges. Redirecting...
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
