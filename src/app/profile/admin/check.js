"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import AddProduct from "./addProduct";
import EditProduct from "./editProduct";

export default function AdminCheck({ session }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    axios
      .get("/api/users/checkAdmin", {
        headers: { Authorization: `Bearer ${session?.customJwt}` },
      })
      .then(res => setIsAdmin(res.data.isAdmin))
      .catch(err => setError(err.message));

    if (pathname === "/profile/admin" && isAdmin === false) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  return (
    <section className="bg-blue-400 min-h-screen">
      {isAdmin !== null && (
        <div>
          {isAdmin ? (
            <>
              <p className="text-4xl font-bold text-center pt-10">
                Welcome back, {session.user.name}
              </p>
              <div className="grid grid-cols-3">
                <AddProduct token={session.customJwt} />
                <EditProduct token={session.customJwt} />
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
